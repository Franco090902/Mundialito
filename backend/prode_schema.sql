-- ══════════════════════════════════════════════════════════════════
-- MUNDIALITO 2026 — Sistema de Prode (Predicciones Deportivas)
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
--
-- ORDEN DE EJECUCIÓN:
--   1. Modificar prode_predictions (agregar columnas bonus)
--   2. Crear prode_groups
--   3. Crear prode_group_members
--   4. Crear prode_group_scores (vista/tabla de puntos por grupo)
--   5. Función y Trigger de cálculo de puntos
--   6. Políticas RLS
-- ══════════════════════════════════════════════════════════════════


 DROP TRIGGER IF EXISTS trg_calcular_puntos ON public.partidos;
 DROP FUNCTION IF EXISTS public.calcular_puntos_prode();
 DROP FUNCTION IF EXISTS public.get_group_leaderboard(uuid);
 DROP TABLE IF EXISTS public.prode_group_scores CASCADE;
 DROP TABLE IF EXISTS public.prode_group_members CASCADE;
 DROP TABLE IF EXISTS public.prode_groups CASCADE;


-- ══════════════════════════════════════════════════════════════════
-- PASO 1: Ampliar la tabla prode_predictions (ya existe)
-- Si la tabla NO existe aún, ejecutar el bloque completo de CREATE.
-- Si ya existe (parcial), ejecutar solo los ALTER TABLE.
-- ══════════════════════════════════════════════════════════════════

-- Opción A: Si prode_predictions YA EXISTE, agregar columnas faltantes:
ALTER TABLE public.prode_predictions
  ADD COLUMN IF NOT EXISTS puntos_bonus integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bonus_aplicado boolean NOT NULL DEFAULT false;

-- Relajar el constraint de puntos_obtenidos para admitir más valores:
-- (el trigger asignará 0, 1, o 3 en puntos_obtenidos, y 0 o 5 en puntos_bonus)
ALTER TABLE public.prode_predictions
  DROP CONSTRAINT IF EXISTS prode_predictions_puntos_obtenidos_check;

ALTER TABLE public.prode_predictions
  ADD CONSTRAINT prode_predictions_puntos_obtenidos_check
  CHECK (puntos_obtenidos IS NULL OR puntos_obtenidos IN (0, 1, 3));

ALTER TABLE public.prode_predictions
  ADD CONSTRAINT prode_predictions_puntos_bonus_check
  CHECK (puntos_bonus IN (0, 5));

-- Opción B: Si prode_predictions NO EXISTE, crear desde cero:
-- (descomenta este bloque si aplica)
/*
CREATE TABLE public.prode_predictions (
  partido_id          uuid    NOT NULL,
  user_id             uuid    NOT NULL,
  pred_goles_local    integer NOT NULL CHECK (pred_goles_local >= 0),
  pred_goles_visitante integer NOT NULL CHECK (pred_goles_visitante >= 0),
  puntos_obtenidos    integer CHECK (puntos_obtenidos IN (0, 1, 3)),
  puntos_bonus        integer NOT NULL DEFAULT 0 CHECK (puntos_bonus IN (0, 5)),
  bonus_aplicado      boolean NOT NULL DEFAULT false,
  created_at          timestamp with time zone NOT NULL DEFAULT now(),
  updated_at          timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT prode_predictions_pkey PRIMARY KEY (partido_id, user_id),
  CONSTRAINT prode_predictions_partido_id_fkey FOREIGN KEY (partido_id) REFERENCES public.partidos(id),
  CONSTRAINT prode_predictions_user_id_fkey   FOREIGN KEY (user_id)    REFERENCES public.profiles(id)
);
*/


-- ══════════════════════════════════════════════════════════════════
-- PASO 2: Tabla prode_groups (Comunidades / Grupos de amigos)
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.prode_groups (
  id          uuid    NOT NULL DEFAULT gen_random_uuid(),
  nombre      text    NOT NULL CHECK (char_length(nombre) >= 2 AND char_length(nombre) <= 50),
  admin_id    uuid    NOT NULL,
  -- Código de 6 caracteres alfanuméricos para unirse (case-insensitive)
  invite_code text    NOT NULL UNIQUE DEFAULT upper(substr(md5(random()::text), 1, 6)),
  es_publico  boolean NOT NULL DEFAULT false,
  created_at  timestamp with time zone NOT NULL DEFAULT now(),
  updated_at  timestamp with time zone NOT NULL DEFAULT now(),

  CONSTRAINT prode_groups_pkey       PRIMARY KEY (id),
  CONSTRAINT prode_groups_admin_fkey FOREIGN KEY (admin_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Índice para búsqueda rápida por código
CREATE INDEX IF NOT EXISTS idx_prode_groups_invite_code ON public.prode_groups (upper(invite_code));


-- ══════════════════════════════════════════════════════════════════
-- PASO 3: Tabla prode_group_members (Miembros de cada grupo)
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.prode_group_members (
  group_id  uuid NOT NULL,
  user_id   uuid NOT NULL,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),

  CONSTRAINT prode_group_members_pkey       PRIMARY KEY (group_id, user_id),
  CONSTRAINT prode_group_members_group_fkey FOREIGN KEY (group_id) REFERENCES public.prode_groups(id) ON DELETE CASCADE,
  CONSTRAINT prode_group_members_user_fkey  FOREIGN KEY (user_id)  REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Índice para listar todos los grupos de un usuario
CREATE INDEX IF NOT EXISTS idx_prode_members_user ON public.prode_group_members (user_id);


-- ══════════════════════════════════════════════════════════════════
-- PASO 4: Función que regenera un invite_code único
-- Se llama cuando el admin quiere un nuevo código
-- ══════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.regenerar_invite_code(p_group_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_code text;
  v_attempts int := 0;
BEGIN
  -- Solo el admin del grupo puede regenerar el código
  IF NOT EXISTS (
    SELECT 1 FROM public.prode_groups
    WHERE id = p_group_id AND admin_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'No tenés permiso para regenerar el código de este grupo.';
  END IF;

  -- Generar un código único (máximo 10 intentos)
  LOOP
    v_new_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    v_attempts := v_attempts + 1;
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.prode_groups WHERE invite_code = v_new_code
    ) OR v_attempts >= 10;
  END LOOP;

  UPDATE public.prode_groups
  SET invite_code = v_new_code, updated_at = now()
  WHERE id = p_group_id;

  RETURN v_new_code;
END;
$$;


-- ══════════════════════════════════════════════════════════════════
-- PASO 5: Función para unirse a un grupo por código
-- ══════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.unirse_a_grupo(p_invite_code text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_group public.prode_groups%ROWTYPE;
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RETURN json_build_object('ok', false, 'error', 'Debés estar autenticado.');
  END IF;

  -- Buscar el grupo por código (case-insensitive)
  SELECT * INTO v_group
  FROM public.prode_groups
  WHERE upper(invite_code) = upper(p_invite_code);

  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'error', 'Código inválido. Verificá que esté bien escrito.');
  END IF;

  -- Verificar si ya es miembro
  IF EXISTS (
    SELECT 1 FROM public.prode_group_members
    WHERE group_id = v_group.id AND user_id = v_user_id
  ) THEN
    RETURN json_build_object('ok', false, 'error', 'Ya sos miembro de este grupo.', 'group_id', v_group.id);
  END IF;

  -- Agregar como miembro
  INSERT INTO public.prode_group_members (group_id, user_id)
  VALUES (v_group.id, v_user_id);

  RETURN json_build_object(
    'ok', true,
    'group_id', v_group.id,
    'group_name', v_group.nombre
  );
END;
$$;


-- ══════════════════════════════════════════════════════════════════
-- PASO 6: Función para obtener el leaderboard de un grupo
-- Retorna el ranking de miembros con sus puntos totales
-- ══════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.get_group_leaderboard(p_group_id uuid)
RETURNS TABLE (
  user_id          uuid,
  username         text,
  avatar_url       text,
  puntos_base      bigint,
  puntos_bonus     bigint,
  puntos_total     bigint,
  aciertos_exactos bigint,
  aciertos_signo   bigint,
  posicion         bigint
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    p.id                                                        AS user_id,
    p.username,
    p.avatar_url,
    COALESCE(SUM(pp.puntos_obtenidos), 0)                       AS puntos_base,
    COALESCE(SUM(pp.puntos_bonus), 0)                           AS puntos_bonus,
    COALESCE(SUM(pp.puntos_obtenidos), 0)
      + COALESCE(SUM(pp.puntos_bonus), 0)                       AS puntos_total,
    COALESCE(SUM(CASE WHEN pp.puntos_obtenidos = 3 THEN 1 ELSE 0 END), 0) AS aciertos_exactos,
    COALESCE(SUM(CASE WHEN pp.puntos_obtenidos >= 1 THEN 1 ELSE 0 END), 0) AS aciertos_signo,
    ROW_NUMBER() OVER (
      ORDER BY
        COALESCE(SUM(pp.puntos_obtenidos), 0)
          + COALESCE(SUM(pp.puntos_bonus), 0) DESC,
        COALESCE(SUM(CASE WHEN pp.puntos_obtenidos = 3 THEN 1 ELSE 0 END), 0) DESC
    )                                                           AS posicion
  FROM public.prode_group_members gm
  JOIN public.profiles p ON p.id = gm.user_id
  LEFT JOIN public.prode_predictions pp ON pp.user_id = gm.user_id
  WHERE gm.group_id = p_group_id
  GROUP BY p.id, p.username, p.avatar_url
  ORDER BY puntos_total DESC, aciertos_exactos DESC;
$$;


-- ══════════════════════════════════════════════════════════════════
-- PASO 7: Función principal — Cálculo de puntos del Prode
-- Se ejecuta como TRIGGER cuando partidos.estado cambia a 'finalizado'
-- ══════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.calcular_puntos_prode()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_pred              RECORD;
  v_puntos_base       integer;
  v_goles_local_real  integer;
  v_goles_vis_real    integer;
  v_res_local_real    integer;  -- signo del resultado real
  v_res_local_pred    integer;  -- signo del resultado predicho
  v_fase              text;
  v_jornada           integer;
  v_bonus_llave       text;    -- clave para identificar el "bloque" del bonus
  v_es_fase_grupos    boolean;
BEGIN
  -- ── Solo procesamos cuando el estado cambia A 'finalizado' ──
  IF NEW.estado <> 'finalizado' OR OLD.estado = 'finalizado' THEN
    RETURN NEW;
  END IF;

  -- ── Los goles deben estar cargados ──
  IF NEW.goles_local IS NULL OR NEW.goles_visitante IS NULL THEN
    RETURN NEW;
  END IF;

  v_goles_local_real := NEW.goles_local;
  v_goles_vis_real   := NEW.goles_visitante;
  v_fase             := NEW.fase;
  v_jornada          := NEW.jornada;

  -- Determinar si es Fase de Grupos (para el bonus)
  v_es_fase_grupos := (v_fase ILIKE 'Grupo %');

  -- La "llave del bonus" es la fase (ej: 'Grupo A') o la jornada en eliminatorias
  v_bonus_llave := CASE
    WHEN v_es_fase_grupos THEN v_fase
    ELSE 'jornada_' || COALESCE(v_jornada::text, 'sin_jornada')
  END;

  -- ── LOOP: calcular puntos para cada usuario que predijo este partido ──
  FOR v_pred IN
    SELECT * FROM public.prode_predictions
    WHERE partido_id = NEW.id
  LOOP

    -- Calcular signo real
    v_res_local_real := SIGN(v_goles_local_real - v_goles_vis_real);
    -- Calcular signo predicho
    v_res_local_pred := SIGN(v_pred.pred_goles_local - v_pred.pred_goles_visitante);

    -- ── Puntos base ──
    IF v_pred.pred_goles_local = v_goles_local_real
       AND v_pred.pred_goles_visitante = v_goles_vis_real THEN
      -- Resultado exacto
      v_puntos_base := 3;
    ELSIF v_res_local_real = v_res_local_pred THEN
      -- Solo tendencia (ganador o empate)
      v_puntos_base := 1;
    ELSE
      v_puntos_base := 0;
    END IF;

    -- Actualizar puntos base del partido
    UPDATE public.prode_predictions
    SET
      puntos_obtenidos = v_puntos_base,
      updated_at       = now()
    WHERE partido_id = NEW.id
      AND user_id    = v_pred.user_id;

    -- ── Actualizar el total global en profiles ──
    -- (solo sumamos la diferencia con respecto al valor anterior)
    UPDATE public.profiles
    SET
      puntos_prode     = puntos_prode
                          - COALESCE(v_pred.puntos_obtenidos, 0)
                          + v_puntos_base,
      aciertos_exactos = aciertos_exactos
                          - CASE WHEN COALESCE(v_pred.puntos_obtenidos, -1) = 3 THEN 1 ELSE 0 END
                          + CASE WHEN v_puntos_base = 3 THEN 1 ELSE 0 END,
      aciertos_signo   = aciertos_signo
                          - CASE WHEN COALESCE(v_pred.puntos_obtenidos, -1) >= 1 THEN 1 ELSE 0 END
                          + CASE WHEN v_puntos_base >= 1 THEN 1 ELSE 0 END,
      updated_at       = now()
    WHERE id = v_pred.user_id;

  END LOOP;

  -- ══════════════════════════════════════════════════════════════
  -- BONUS: +5 puntos si el usuario acertó TODOS los exactos
  -- del mismo bloque (grupo completo o jornada eliminatoria)
  -- ══════════════════════════════════════════════════════════════

  -- Verificar si todos los partidos del bloque están finalizados
  IF NOT (
    SELECT bool_and(p2.estado = 'finalizado')
    FROM public.partidos p2
    WHERE (
      CASE
        WHEN v_es_fase_grupos THEN p2.fase = v_fase
        ELSE p2.jornada = v_jornada AND p2.fase NOT ILIKE 'Grupo %'
      END
    )
  ) THEN
    -- No todos los partidos del bloque han terminado, no aplicamos bonus aún
    RETURN NEW;
  END IF;

  -- Obtener todos los partido_ids del bloque
  -- Para cada usuario que tenga predicciones en el bloque, verificar si acertó TODOS exactos
  FOR v_pred IN
    SELECT DISTINCT pp.user_id
    FROM public.prode_predictions pp
    JOIN public.partidos pt ON pt.id = pp.partido_id
    WHERE (
      CASE
        WHEN v_es_fase_grupos THEN pt.fase = v_fase
        ELSE pt.jornada = v_jornada AND pt.fase NOT ILIKE 'Grupo %'
      END
    )
  LOOP
    DECLARE
      v_total_partidos   integer;
      v_exactos_usuario  integer;
      v_ya_tiene_bonus   boolean;
    BEGIN
      -- Total de partidos finalizados en el bloque
      SELECT COUNT(*) INTO v_total_partidos
      FROM public.partidos pt
      WHERE (
        CASE
          WHEN v_es_fase_grupos THEN pt.fase = v_fase
          ELSE pt.jornada = v_jornada AND pt.fase NOT ILIKE 'Grupo %'
        END
      ) AND pt.estado = 'finalizado';

      -- Cuántos acertó exactos este usuario en el bloque
      SELECT COUNT(*) INTO v_exactos_usuario
      FROM public.prode_predictions pp2
      JOIN public.partidos pt2 ON pt2.id = pp2.partido_id
      WHERE pp2.user_id = v_pred.user_id
        AND pp2.puntos_obtenidos = 3
        AND (
          CASE
            WHEN v_es_fase_grupos THEN pt2.fase = v_fase
            ELSE pt2.jornada = v_jornada AND pt2.fase NOT ILIKE 'Grupo %'
          END
        );

      -- Verificar si ya se le otorgó el bonus en algún partido del bloque
      SELECT bool_or(pp3.bonus_aplicado) INTO v_ya_tiene_bonus
      FROM public.prode_predictions pp3
      JOIN public.partidos pt3 ON pt3.id = pp3.partido_id
      WHERE pp3.user_id = v_pred.user_id
        AND (
          CASE
            WHEN v_es_fase_grupos THEN pt3.fase = v_fase
            ELSE pt3.jornada = v_jornada AND pt3.fase NOT ILIKE 'Grupo %'
          END
        );

      -- Otorgar bonus SOLO si:
      -- 1. Acertó TODOS los partidos del bloque de forma exacta
      -- 2. Predijo TODOS los partidos del bloque (no puede haber dejado alguno sin predecir)
      -- 3. No se le aplicó el bonus antes
      IF v_total_partidos > 0
         AND v_exactos_usuario = v_total_partidos
         AND NOT COALESCE(v_ya_tiene_bonus, false)
      THEN
        -- Marcar bonus en el partido actual (el que acaba de finalizar)
        UPDATE public.prode_predictions
        SET
          puntos_bonus   = 5,
          bonus_aplicado = true,
          updated_at     = now()
        WHERE partido_id = NEW.id
          AND user_id    = v_pred.user_id;

        -- Sumar 5 puntos al total global del usuario
        UPDATE public.profiles
        SET
          puntos_prode = puntos_prode + 5,
          updated_at   = now()
        WHERE id = v_pred.user_id;

      END IF;
    END;
  END LOOP;

  RETURN NEW;
END;
$$;


-- ══════════════════════════════════════════════════════════════════
-- PASO 8: Trigger sobre la tabla partidos
-- ══════════════════════════════════════════════════════════════════
DROP TRIGGER IF EXISTS trg_calcular_puntos ON public.partidos;

CREATE TRIGGER trg_calcular_puntos
  AFTER UPDATE OF estado ON public.partidos
  FOR EACH ROW
  EXECUTE FUNCTION public.calcular_puntos_prode();


-- ══════════════════════════════════════════════════════════════════
-- PASO 9: Habilitar RLS en las tablas nuevas
-- ══════════════════════════════════════════════════════════════════
ALTER TABLE public.prode_groups        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prode_group_members ENABLE ROW LEVEL SECURITY;

-- (prode_predictions ya debería tener RLS habilitado del schema anterior)
ALTER TABLE public.prode_predictions   ENABLE ROW LEVEL SECURITY;


-- ══════════════════════════════════════════════════════════════════
-- PASO 10: Políticas RLS — prode_predictions
-- ══════════════════════════════════════════════════════════════════

-- Limpiar políticas previas
DROP POLICY IF EXISTS "predictions_select_own_before_match" ON public.prode_predictions;
DROP POLICY IF EXISTS "predictions_select_public_after_match" ON public.prode_predictions;
DROP POLICY IF EXISTS "predictions_insert" ON public.prode_predictions;
DROP POLICY IF EXISTS "predictions_update" ON public.prode_predictions;
DROP POLICY IF EXISTS "predictions_delete" ON public.prode_predictions;

-- POLÍTICA 1: Ver tus propias predicciones (siempre)
CREATE POLICY "predictions_select_own"
  ON public.prode_predictions
  FOR SELECT
  USING (user_id = auth.uid());

-- POLÍTICA 2: Ver predicciones de compañeros de grupo cuando el partido está bloqueado
-- (kickoff <= ahora + 1 hora O estado != programado)
-- Solo si el que consulta es miembro del mismo grupo que el dueño de la predicción
CREATE POLICY "predictions_select_group_members_after_lock"
  ON public.prode_predictions
  FOR SELECT
  USING (
    -- El partido ya está bloqueado (menos de 1h para el kickoff o ya iniciado)
    EXISTS (
      SELECT 1 FROM public.partidos p
      WHERE p.id = partido_id
        AND (p.fecha_utc <= NOW() + INTERVAL '1 hour' OR p.estado <> 'programado')
    )
    AND
    -- El usuario autenticado comparte al menos un grupo con el dueño de la predicción
    EXISTS (
      SELECT 1
      FROM public.prode_group_members m1
      JOIN public.prode_group_members m2
        ON m1.group_id = m2.group_id
      WHERE m1.user_id = auth.uid()
        AND m2.user_id = prode_predictions.user_id
    )
  );

-- POLÍTICA 3: INSERT — solo antes del bloqueo (más de 1h antes del kickoff)
CREATE POLICY "predictions_insert"
  ON public.prode_predictions
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.partidos p
      WHERE p.id = partido_id
        AND p.fecha_utc > NOW() + INTERVAL '1 hour'
        AND p.estado = 'programado'
    )
  );

-- POLÍTICA 4: UPDATE — solo antes del bloqueo y solo el propio usuario
CREATE POLICY "predictions_update"
  ON public.prode_predictions
  FOR UPDATE
  USING (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.partidos p
      WHERE p.id = partido_id
        AND p.fecha_utc > NOW() + INTERVAL '1 hour'
        AND p.estado = 'programado'
    )
  )
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.partidos p
      WHERE p.id = partido_id
        AND p.fecha_utc > NOW() + INTERVAL '1 hour'
        AND p.estado = 'programado'
    )
  );

-- POLÍTICA 5: No se pueden borrar predicciones
-- (omitida intencionalmente — sin DELETE policy = nadie puede borrar)


-- ══════════════════════════════════════════════════════════════════
-- PASO 11: Políticas RLS — prode_groups
-- ══════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "groups_select_public" ON public.prode_groups;
DROP POLICY IF EXISTS "groups_select_member"  ON public.prode_groups;
DROP POLICY IF EXISTS "groups_insert"         ON public.prode_groups;
DROP POLICY IF EXISTS "groups_update_admin"   ON public.prode_groups;
DROP POLICY IF EXISTS "groups_delete_admin"   ON public.prode_groups;

-- Ver grupos públicos o en los que soy miembro
CREATE POLICY "groups_select"
  ON public.prode_groups
  FOR SELECT
  USING (
    es_publico = true
    OR admin_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.prode_group_members
      WHERE group_id = prode_groups.id AND user_id = auth.uid()
    )
  );

-- Crear un grupo (cualquier usuario autenticado)
CREATE POLICY "groups_insert"
  ON public.prode_groups
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND admin_id = auth.uid());

-- Solo el admin puede modificar nombre, visibilidad
CREATE POLICY "groups_update_admin"
  ON public.prode_groups
  FOR UPDATE
  USING (admin_id = auth.uid())
  WITH CHECK (admin_id = auth.uid());

-- Solo el admin puede eliminar el grupo
CREATE POLICY "groups_delete_admin"
  ON public.prode_groups
  FOR DELETE
  USING (admin_id = auth.uid());


-- ══════════════════════════════════════════════════════════════════
-- PASO 12: Políticas RLS — prode_group_members
-- ══════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "members_select" ON public.prode_group_members;
DROP POLICY IF EXISTS "members_insert" ON public.prode_group_members;
DROP POLICY IF EXISTS "members_delete" ON public.prode_group_members;

-- Ver los miembros de grupos en los que participo
CREATE POLICY "members_select"
  ON public.prode_group_members
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.prode_group_members m2
      WHERE m2.group_id = prode_group_members.group_id
        AND m2.user_id = auth.uid()
    )
  );

-- Unirse a un grupo (el insert lo controla la función unirse_a_grupo, pero
-- la política permisiva es necesaria para que SECURITY DEFINER funcione)
-- Usamos SECURITY DEFINER en la función para saltear RLS en el INSERT
CREATE POLICY "members_insert"
  ON public.prode_group_members
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- El admin puede expulsar miembros, o el propio miembro puede salir
CREATE POLICY "members_delete"
  ON public.prode_group_members
  FOR DELETE
  USING (
    user_id = auth.uid()  -- el propio usuario sale
    OR EXISTS (           -- o el admin del grupo expulsa
      SELECT 1 FROM public.prode_groups
      WHERE id = prode_group_members.group_id AND admin_id = auth.uid()
    )
  );


-- ══════════════════════════════════════════════════════════════════
-- PASO 13: Trigger para auto-agregar al admin como miembro al crear grupo
--
-- IMPORTANTE (Supabase): Aunque la función es SECURITY DEFINER,
-- en Supabase las RLS siguen activas a menos que se deshabiliten
-- explícitamente con SET LOCAL row_security = off dentro de la función.
-- Sin esto, auth.uid() devuelve NULL en el contexto del trigger
-- y la política "members_insert" (user_id = auth.uid()) falla.
-- ══════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.auto_join_admin_to_group()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Deshabilitar RLS temporalmente para este INSERT
  -- (el admin_id viene del NEW row que YA pasó las RLS de prode_groups)
  SET LOCAL row_security = off;

  INSERT INTO public.prode_group_members (group_id, user_id)
  VALUES (NEW.id, NEW.admin_id)
  ON CONFLICT (group_id, user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_join_admin ON public.prode_groups;

CREATE TRIGGER trg_auto_join_admin
  AFTER INSERT ON public.prode_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_join_admin_to_group();



-- ══════════════════════════════════════════════════════════════════
-- FIN DEL SCRIPT
-- Verificar ejecutando:
--   SELECT * FROM prode_groups LIMIT 5;
--   SELECT * FROM prode_group_members LIMIT 5;
--   \d prode_predictions  -- para ver las nuevas columnas
-- ══════════════════════════════════════════════════════════════════
