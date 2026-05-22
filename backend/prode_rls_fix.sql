-- ══════════════════════════════════════════════════════════════════
-- PRODE — FIX DEFINITIVO: Políticas RLS sin recursión
--
-- PROBLEMA ANTERIOR:
-- La política que te dí recién ("solo ver mis propias membresías") 
-- arregla el timeout, pero es demasiado restrictiva: ¡no te dejaría ver
-- a los otros miembros de tu grupo ni sus predicciones!
--
-- LA SOLUCIÓN CORRECTA:
-- En Supabase, para evitar el bucle infinito al consultar la misma tabla
-- dentro de una política, se usa una pequeña función "SECURITY DEFINER".
-- Esta función hace la comprobación "por detrás" sin disparar las
-- políticas de nuevo.
--
-- 👉 Ejecutá todo este script en Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────
-- 1. Crear función auxiliar que verifica membresía de forma segura
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_member_of(p_group_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER -- Ejecuta con privilegios elevados (salta el bucle de RLS)
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.prode_group_members
    WHERE group_id = p_group_id AND user_id = auth.uid()
  );
$$;

-- ─────────────────────────────────────────────────────────────────
-- 2. Corregir RLS de prode_group_members
--    (Puedo ver mis filas, O las filas de los grupos donde estoy)
-- ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "members_select" ON public.prode_group_members;

CREATE POLICY "members_select"
  ON public.prode_group_members
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.is_member_of(group_id)
  );

-- ─────────────────────────────────────────────────────────────────
-- 3. Corregir RLS de prode_groups
-- ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "groups_select" ON public.prode_groups;

CREATE POLICY "groups_select"
  ON public.prode_groups
  FOR SELECT
  USING (
    es_publico = true
    OR admin_id = auth.uid()
    OR public.is_member_of(id)
  );

-- ─────────────────────────────────────────────────────────────────
-- 4. Corregir RLS de prode_predictions para ver predicciones ajenas
--    después del bloqueo (kickoff)
-- ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "predictions_select_group_members_after_lock" ON public.prode_predictions;

CREATE POLICY "predictions_select_group_members_after_lock"
  ON public.prode_predictions
  FOR SELECT
  USING (
    -- El partido ya está bloqueado
    EXISTS (
      SELECT 1 FROM public.partidos p
      WHERE p.id = partido_id
        AND (p.fecha_utc <= NOW() + INTERVAL '1 hour' OR p.estado <> 'programado')
    )
    AND
    -- El dueño de esta predicción está en al menos un grupo conmigo
    EXISTS (
      SELECT 1 FROM public.prode_group_members m
      WHERE m.user_id = prode_predictions.user_id
        AND public.is_member_of(m.group_id)
    )
  );

-- Listo! Ya podés probar crear un grupo en la app.
