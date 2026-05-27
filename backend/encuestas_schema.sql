-- ══════════════════════════════════════════════════════════════════
-- MUNDIALITO 2026 — Encuestas Rápidas En Vivo
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- Proyecto: https://iplsamlkpkuzurthdzdh.supabase.co
--
-- INSTRUCCIONES:
--   1. Ir a Supabase Dashboard → SQL Editor → "New Query"
--   2. Copiar TODO este archivo y pegarlo en el editor
--   3. Hacer click en "Run" (▶)
--   4. Verificar en Table Editor que aparezcan:
--      - tabla "encuestas"
--      - tabla "encuestas_votos"
--
-- NO modifica nada de las tablas existentes (live_votes, partidos, etc.)
-- ══════════════════════════════════════════════════════════════════


-- ──────────────────────────────────────────────────────────────────
-- TABLA 1: encuestas
-- Almacena las encuestas rápidas por partido.
-- Las opciones están en JSONB: [{"label":"...", "votes": 0}, ...]
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.encuestas (
  id                uuid        NOT NULL DEFAULT gen_random_uuid(),
  partido_id        uuid        NOT NULL,
  pregunta          text        NOT NULL,
  tipo              text        NOT NULL CHECK (tipo = ANY (ARRAY[
                                  'winner', 'cards_range', 'fouls_range', 'mvp',
                                  'possession', 'next_scorer', 'goal_type',
                                  'first_sub', 'direct_card'
                                ])),
  opciones          jsonb       NOT NULL DEFAULT '[]'::jsonb,
  activa            boolean     NOT NULL DEFAULT true,
  creada_en         integer     DEFAULT 0,          -- minuto del partido cuando se creó
  expires_at_minute integer     DEFAULT 90,         -- minuto en que expira
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT encuestas_pkey PRIMARY KEY (id),
  CONSTRAINT encuestas_partido_id_fkey
    FOREIGN KEY (partido_id) REFERENCES public.partidos(id) ON DELETE CASCADE
);

-- Índice para consultas rápidas por partido
CREATE INDEX IF NOT EXISTS idx_encuestas_partido_activa
  ON public.encuestas (partido_id, activa);


-- ──────────────────────────────────────────────────────────────────
-- TABLA 2: encuestas_votos
-- Un voto por usuario por encuesta (PK compuesta garantiza unicidad).
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.encuestas_votos (
  encuesta_id   uuid        NOT NULL,
  user_id       uuid        NOT NULL,
  opcion_index  integer     NOT NULL CHECK (opcion_index >= 0),
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT encuestas_votos_pkey PRIMARY KEY (encuesta_id, user_id),
  CONSTRAINT encuestas_votos_encuesta_fkey
    FOREIGN KEY (encuesta_id) REFERENCES public.encuestas(id) ON DELETE CASCADE,
  CONSTRAINT encuestas_votos_user_fkey
    FOREIGN KEY (user_id)     REFERENCES public.profiles(id)
);

-- Índice para consultas por encuesta (calcular conteos)
CREATE INDEX IF NOT EXISTS idx_encuestas_votos_encuesta
  ON public.encuestas_votos (encuesta_id, opcion_index);


-- ──────────────────────────────────────────────────────────────────
-- RLS (Row Level Security)
-- encuestas: lectura pública, escritura solo desde service role (backend)
-- encuestas_votos: el usuario solo puede insertar/ver sus propios votos
-- ──────────────────────────────────────────────────────────────────
ALTER TABLE public.encuestas       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encuestas_votos ENABLE ROW LEVEL SECURITY;

-- Encuestas: cualquiera puede leer (usuarios, anónimos)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'encuestas' AND policyname = 'encuestas_read_all'
  ) THEN
    CREATE POLICY "encuestas_read_all"
      ON public.encuestas FOR SELECT USING (true);
  END IF;
END $$;

-- Encuestas_votos: insertar solo si el user_id coincide con el usuario autenticado
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'encuestas_votos' AND policyname = 'encuestas_votos_insert_own'
  ) THEN
    CREATE POLICY "encuestas_votos_insert_own"
      ON public.encuestas_votos FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Encuestas_votos: leer solo los votos propios
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'encuestas_votos' AND policyname = 'encuestas_votos_select_own'
  ) THEN
    CREATE POLICY "encuestas_votos_select_own"
      ON public.encuestas_votos FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Encuestas_votos: actualizar (para cambiar voto — UPSERT)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'encuestas_votos' AND policyname = 'encuestas_votos_update_own'
  ) THEN
    CREATE POLICY "encuestas_votos_update_own"
      ON public.encuestas_votos FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Encuestas: insertar (el browser genera las encuestas cuando detecta un partido)
-- Permitir INSERT si hay una sesión activa (para cualquier usuario logueado)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'encuestas' AND policyname = 'encuestas_insert_authenticated'
  ) THEN
    CREATE POLICY "encuestas_insert_authenticated"
      ON public.encuestas FOR INSERT
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;


-- ──────────────────────────────────────────────────────────────────
-- FUNCIÓN RPC: get_encuesta_stats
-- Calcula los conteos de votos por opción para una encuesta.
-- Llamada desde el frontend: supabase.rpc('get_encuesta_stats', {...})
-- Retorna: { "total": 47, "por_opcion": { "0": 20, "1": 15, "2": 12 } }
-- ──────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_encuesta_stats(p_encuesta_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    CASE
      WHEN COUNT(*) = 0 THEN
        jsonb_build_object('total', 0, 'por_opcion', '{}'::jsonb)
      ELSE
        jsonb_build_object(
          'total',     COUNT(*),
          'por_opcion', COALESCE(
            jsonb_object_agg(opcion_index::text, cnt),
            '{}'::jsonb
          )
        )
    END
  FROM (
    SELECT opcion_index, COUNT(*) AS cnt
    FROM public.encuestas_votos
    WHERE encuesta_id = p_encuesta_id
    GROUP BY opcion_index
  ) counts;
$$;

-- Dar permiso de ejecución a usuarios autenticados y anónimos (para leer stats)
GRANT EXECUTE ON FUNCTION public.get_encuesta_stats(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_encuesta_stats(uuid) TO anon;


-- ──────────────────────────────────────────────────────────────────
-- HABILITAR REALTIME en encuestas_votos
-- Esto permite que Supabase Realtime notifique a los clientes
-- cuando se insertan nuevos votos.
-- ──────────────────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.encuestas_votos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.encuestas;


-- ──────────────────────────────────────────────────────────────────
-- VERIFICACIÓN FINAL
-- Después de ejecutar, deberías ver:
-- ──────────────────────────────────────────────────────────────────
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns c
   WHERE c.table_name = t.table_name AND c.table_schema = 'public') AS columnas
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('encuestas', 'encuestas_votos')
ORDER BY table_name;
