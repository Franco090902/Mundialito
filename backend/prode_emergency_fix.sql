-- ══════════════════════════════════════════════════════════════════
-- PRUEBA DE FUEGO: APAGAR RLS TEMPORALMENTE
--
-- Mi teoría es que el script anterior falló al ejecutarse en tu
-- Supabase (quizás tiró un error que no viste) y las políticas
-- recursivas que rompen todo NUNCA se borraron.
--
-- Por lo tanto, cada vez que abrís la app, la base de datos se
-- vuelve a colgar instantáneamente.
--
-- Vamos a APAGAR la seguridad de esas dos tablas por un momento
-- para confirmar que este es el problema.
-- ══════════════════════════════════════════════════════════════════

-- 1. Apagamos la seguridad a nivel de fila (RLS)
ALTER TABLE public.prode_group_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.prode_groups DISABLE ROW LEVEL SECURITY;

-- 2. Borramos las políticas problemáticas para que no molesten
DROP POLICY IF EXISTS "members_select" ON public.prode_group_members;
DROP POLICY IF EXISTS "groups_select" ON public.prode_groups;

-- Listo. Ejecutá esto y probá la app de nuevo.
