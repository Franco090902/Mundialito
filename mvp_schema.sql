-- 1. Crear tabla mvp_votes
CREATE TABLE public.mvp_votes (
    partido_id UUID NOT NULL REFERENCES public.partidos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    jugador VARCHAR(255) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (partido_id, user_id)
);

-- 2. Habilitar RLS
ALTER TABLE public.mvp_votes ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de RLS
CREATE POLICY "Cualquiera puede ver los votos MVP"
    ON public.mvp_votes
    FOR SELECT
    USING (true);

CREATE POLICY "Usuarios autenticados pueden votar MVP"
    ON public.mvp_votes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios autenticados pueden actualizar su voto MVP"
    ON public.mvp_votes
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. Función RPC para obtener los porcentajes de votos del MVP
CREATE OR REPLACE FUNCTION public.get_mvp_vote_stats(p_partido_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_total_votes INT;
    v_stats JSONB;
BEGIN
    -- Contar el total de votos para este partido
    SELECT COUNT(*) INTO v_total_votes
    FROM public.mvp_votes
    WHERE partido_id = p_partido_id;

    IF v_total_votes = 0 THEN
        RETURN '{"total": 0, "jugadores": {}}'::JSONB;
    END IF;

    -- Calcular porcentajes por jugador y armar objeto JSON
    SELECT jsonb_build_object(
        'total', v_total_votes,
        'jugadores', jsonb_object_agg(jugador, (COUNT(*) * 100.0 / v_total_votes)::INT)
    ) INTO v_stats
    FROM (
        SELECT jugador, COUNT(*) as votos
        FROM public.mvp_votes
        WHERE partido_id = p_partido_id
        GROUP BY jugador
    ) sub;

    RETURN v_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
