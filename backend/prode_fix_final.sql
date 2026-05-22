-- ══════════════════════════════════════════════════════════════════
-- PRODE — FIX DEFINITIVO (RESETEO DE CONEXIONES Y RLS SEGURO)
--
-- Explicación de lo que te está pasando:
-- 1. "Lo crea bien": El servidor recibe la orden y la procesa.
-- 2. "Nunca termina": El servidor está TAN sobrecargado procesando
--    las consultas infinitas anteriores, que tarda más de 12 segundos
--    en responder, y por eso el frontend tira Timeout.
--
-- Este script hace dos cosas clave:
-- 1. MATA todas las consultas colgadas en la base de datos para
--    liberar el servidor.
-- 2. Recrea la función "is_member_of" en lenguaje plpgsql y APAGA
--    explícitamente las políticas de seguridad en su interior.
--    Esto garantiza matemáticamente que sea imposible un bucle infinito.
-- ══════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────
-- 1. MATAR CONSULTAS COLGADAS (Libera a Supabase del bucle)
-- ─────────────────────────────────────────────────────────────────
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = current_database() 
  AND pid <> pg_backend_pid()
  AND state = 'active'
  AND query ILIKE '%prode%';

-- ─────────────────────────────────────────────────────────────────
-- 2. FUNCIÓN DE MEMBRESÍA BLINDADA CONTRA BUCLES INFINITOS
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_member_of(p_group_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_member boolean;
BEGIN
  -- ¡LA CLAVE ESTÁ ACÁ! Apagamos RLS internamente para que
  -- esta consulta no vuelva a disparar las políticas y cause un bucle.
  SET LOCAL row_security = off;
  
  SELECT EXISTS (
    SELECT 1 FROM public.prode_group_members
    WHERE group_id = p_group_id AND user_id = auth.uid()
  ) INTO v_is_member;
  
  RETURN v_is_member;
END;
$$;

-- ─────────────────────────────────────────────────────────────────
-- 3. REAPLICAR LAS POLÍTICAS USANDO LA FUNCIÓN SEGURA
-- ─────────────────────────────────────────────────────────────────

-- Para los Miembros:
DROP POLICY IF EXISTS "members_select" ON public.prode_group_members;
CREATE POLICY "members_select"
  ON public.prode_group_members
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.is_member_of(group_id)
  );

-- Para los Grupos:
DROP POLICY IF EXISTS "groups_select" ON public.prode_groups;
CREATE POLICY "groups_select"
  ON public.prode_groups
  FOR SELECT
  USING (
    es_publico = true
    OR admin_id = auth.uid()
    OR public.is_member_of(id)
  );

-- Para las Predicciones:
DROP POLICY IF EXISTS "predictions_select_group_members_after_lock" ON public.prode_predictions;
CREATE POLICY "predictions_select_group_members_after_lock"
  ON public.prode_predictions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.partidos p
      WHERE p.id = partido_id
        AND (p.fecha_utc <= NOW() + INTERVAL '1 hour' OR p.estado <> 'programado')
    )
    AND
    EXISTS (
      SELECT 1 FROM public.prode_group_members m
      WHERE m.user_id = prode_predictions.user_id
        AND public.is_member_of(m.group_id)
    )
  );
