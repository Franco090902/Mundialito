-- ══════════════════════════════════════════════════════════════════
-- PRODE — PARCHE DE CORRECCIÓN
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
--
-- Este parche es IDEMPOTENTE (se puede ejecutar varias veces sin daño).
-- Soluciona:
--   1. Columnas faltantes en profiles (puntos_prode, etc.)
--   2. Función RPC crear_grupo (crea grupo + agrega miembro en una
--      transacción con RLS deshabilitado → elimina el bug de cuelgue)
--   3. Regenera el trigger con bypass de RLS correcto
-- ══════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────
-- 1. Agregar columnas al perfil (si no existen)
--    Necesarias para el hero banner con estadísticas personales
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS puntos_prode     integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS aciertos_exactos integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS aciertos_signo   integer NOT NULL DEFAULT 0;

-- Verificar:
-- SELECT id, username, puntos_prode, aciertos_exactos, aciertos_signo
-- FROM public.profiles LIMIT 3;


-- ─────────────────────────────────────────────────────────────────
-- 2. Función RPC crear_grupo
--
--    Por qué RPC en vez de INSERT directo desde el frontend:
--    - En Supabase, RLS puede bloquear el INSERT sin devolver error
--      explícito, dejando el await de JS colgado indefinidamente.
--    - SECURITY DEFINER + SET LOCAL row_security = off garantiza que
--      tanto el INSERT del grupo como el del miembro funcionen.
--    - Todo ocurre en una única transacción atómica.
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.crear_grupo(
  p_nombre     text,
  p_es_publico boolean DEFAULT false
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id     uuid   := auth.uid();
  v_group_id    uuid;
  v_invite_code text;
  v_attempts    int    := 0;
  v_row         public.prode_groups%ROWTYPE;
BEGIN
  -- Validar autenticación
  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'ok', false,
      'error', 'Debés estar autenticado para crear un grupo.'
    );
  END IF;

  -- Validar nombre
  IF p_nombre IS NULL OR char_length(trim(p_nombre)) < 2 THEN
    RETURN json_build_object(
      'ok', false,
      'error', 'El nombre debe tener al menos 2 caracteres.'
    );
  END IF;

  -- Desactivar RLS para toda la función
  -- (el usuario YA autenticado, validamos con auth.uid() arriba)
  SET LOCAL row_security = off;

  -- Generar código de invitación único (máx. 10 intentos)
  LOOP
    v_invite_code := upper(substr(
      md5(random()::text || clock_timestamp()::text || v_user_id::text),
      1, 6
    ));
    v_attempts := v_attempts + 1;
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.prode_groups WHERE invite_code = v_invite_code
    ) OR v_attempts >= 10;
  END LOOP;

  -- Crear el grupo
  INSERT INTO public.prode_groups (nombre, admin_id, es_publico, invite_code)
  VALUES (trim(p_nombre), v_user_id, p_es_publico, v_invite_code)
  RETURNING id INTO v_group_id;

  -- Agregar al admin como miembro (sin esperar al trigger)
  INSERT INTO public.prode_group_members (group_id, user_id)
  VALUES (v_group_id, v_user_id)
  ON CONFLICT (group_id, user_id) DO NOTHING;

  -- Leer el registro creado para devolverlo completo
  SELECT * INTO v_row FROM public.prode_groups WHERE id = v_group_id;

  RETURN json_build_object(
    'ok',          true,
    'id',          v_row.id,
    'nombre',      v_row.nombre,
    'invite_code', v_row.invite_code,
    'es_publico',  v_row.es_publico,
    'admin_id',    v_row.admin_id,
    'created_at',  v_row.created_at
  );

EXCEPTION WHEN OTHERS THEN
  -- Capturar cualquier error inesperado y devolverlo como JSON
  RETURN json_build_object(
    'ok',    false,
    'error', SQLERRM,
    'code',  SQLSTATE
  );
END;
$$;

-- Verificar que la función existe:
-- SELECT public.crear_grupo('Grupo Test', false);


-- ─────────────────────────────────────────────────────────────────
-- 3. Regenerar trigger con RLS desactivado correctamente
--    (redundante si ya se usa crear_grupo, pero necesario como backup)
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.auto_join_admin_to_group()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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


-- ─────────────────────────────────────────────────────────────────
-- 4. Verificación final — ejecutar después del parche
-- ─────────────────────────────────────────────────────────────────
-- Probar que todo funciona (reemplazar el UUID por el tuyo):
--
-- SELECT public.crear_grupo('Grupo de Prueba', false);
--
-- Debería devolver algo como:
-- {"ok":true,"id":"...","nombre":"Grupo de Prueba","invite_code":"AB3X9K",...}
--
-- Luego verificar en las tablas:
-- SELECT * FROM public.prode_groups ORDER BY created_at DESC LIMIT 5;
-- SELECT * FROM public.prode_group_members ORDER BY joined_at DESC LIMIT 5;
-- SELECT puntos_prode, aciertos_exactos, aciertos_signo FROM public.profiles LIMIT 3;
