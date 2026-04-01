-- ══════════════════════════════════════════════════════════════════
-- MUNDIALITO 2026 — Schema Completo
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- Proyecto: https://iplsamlkpkuzurthdzdh.supabase.co
--
-- ORDEN DE EJECUCIÓN (importante por las Foreign Keys):
--   1. profiles
--   2. partidos
--   3. live_votes
--   4. chat_messages
--   5. prode_predictions
--   6. Funciones y Triggers
--   7. Políticas RLS
-- ══════════════════════════════════════════════════════════════════


-- ──────────────────────────────────────────────────────────────────
-- LIMPIEZA (útil si ya existe una versión anterior)
-- Descomenta estas líneas solo si querés empezar de cero.
-- ──────────────────────────────────────────────────────────────────
-- DROP TABLE IF EXISTS prode_predictions CASCADE;
-- DROP TABLE IF EXISTS chat_messages     CASCADE;
-- DROP TABLE IF EXISTS live_votes        CASCADE;
-- DROP TABLE IF EXISTS partidos          CASCADE;
-- DROP TABLE IF EXISTS profiles          CASCADE;


-- ══════════════════════════════════════════════════════════════════
-- TABLA 1: profiles
-- Extiende auth.users de Supabase.
-- Guarda datos públicos del usuario: avatar, username y puntos del prode.
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.profiles (
  -- PK ligada a auth.users. Si se borra el usuario de auth, se borra su perfil.
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  username        TEXT        NOT NULL,
  avatar_url      TEXT,                           -- URL de foto de perfil (Google OAuth la llena automáticamente)
  
  -- ── Acumuladores del Prode ──────────────────────────────────────
  -- Se actualizan con un trigger cada vez que se cierra un partido.
  -- Así el ranking es un simple ORDER BY puntos_prode, sin cálculos costosos.
  puntos_prode    INT         NOT NULL DEFAULT 0,
  aciertos_exactos INT        NOT NULL DEFAULT 0, -- Resultado exacto (3 pts)
  aciertos_signo  INT         NOT NULL DEFAULT 0, -- Solo ganador/empate correcto (1 pt)

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para el ranking (consulta muy frecuente)
CREATE INDEX IF NOT EXISTS idx_profiles_puntos ON public.profiles(puntos_prode DESC);

COMMENT ON TABLE  public.profiles IS 'Perfiles públicos de usuario, extendiendo auth.users.';
COMMENT ON COLUMN public.profiles.puntos_prode IS 'Puntos acumulados del prode. Actualizado por trigger al cerrar partido.';


-- ══════════════════════════════════════════════════════════════════
-- TABLA 2: partidos
-- La fuente de verdad de los partidos.
-- Solo el Worker de Node.js (con Service Role Key) puede escribir aquí.
-- El frontend solo lee.
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.partidos (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- IDs externos para cruzar datos entre APIs
  id_football_data    INT         UNIQUE,         -- ID de football-data.org
  id_api_football     INT         UNIQUE,         -- ID de api-football.com

  -- Información del partido
  fase                TEXT        NOT NULL,        -- 'Grupo A', 'Octavos', 'Final', etc.
  jornada             INT,
  fecha_utc           TIMESTAMPTZ NOT NULL,

  equipo_local        TEXT        NOT NULL,
  equipo_visitante    TEXT        NOT NULL,
  escudo_local        TEXT,                        -- URL del escudo
  escudo_visitante    TEXT,

  -- Estado y resultado (actualizados por el Worker)
  -- 'programado' | 'en_curso' | 'finalizado' | 'suspendido'
  estado              TEXT        NOT NULL DEFAULT 'programado'
                      CHECK (estado IN ('programado','en_curso','finalizado','suspendido')),

  minuto              INT,                         -- Minuto actual del partido (si está en curso)
  goles_local         INT,                         -- NULL hasta que empiece
  goles_visitante     INT,

  -- Estadísticas en tiempo real (JSON flexible, actualizado por Worker)
  -- Ejemplo: { "posesion_local": 55, "tiros_local": 8, ... }
  estadisticas        JSONB       DEFAULT '{}',

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para buscar partidos por estado (la consulta más frecuente del Worker)
CREATE INDEX IF NOT EXISTS idx_partidos_estado  ON public.partidos(estado);
CREATE INDEX IF NOT EXISTS idx_partidos_fecha   ON public.partidos(fecha_utc DESC);

COMMENT ON TABLE  public.partidos IS 'Partidos del Mundial. Escritura exclusiva del Worker de Node.js.';
COMMENT ON COLUMN public.partidos.estadisticas IS 'JSON con stats en vivo: posesion, tiros, corners, etc.';


-- ══════════════════════════════════════════════════════════════════
-- TABLA 3: live_votes
-- Predicciones en vivo: el usuario vota mientras el partido está en curso.
-- Un usuario solo puede tener UN voto activo por partido (UPSERT).
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.live_votes (
  -- Clave compuesta: un voto por usuario por partido
  partido_id  UUID        NOT NULL REFERENCES public.partidos(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (partido_id, user_id),

  -- 'local' | 'empate' | 'visitante'
  voto        TEXT        NOT NULL
              CHECK (voto IN ('local', 'empate', 'visitante')),

  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para calcular porcentajes rápidamente
CREATE INDEX IF NOT EXISTS idx_live_votes_partido ON public.live_votes(partido_id);

COMMENT ON TABLE public.live_votes IS 'Votos en vivo por partido. Un voto por usuario (UPSERT).';


-- ══════════════════════════════════════════════════════════════════
-- TABLA 4: chat_messages
-- Chat global por partido.
-- Lectura pública, escritura solo para usuarios autenticados.
-- Paginación por cursor (created_at) para no traer todo el historial.
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  partido_id  UUID        NOT NULL REFERENCES public.partidos(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- Guardamos el username en el mensaje para no hacer JOIN en cada lectura
  username    TEXT        NOT NULL,
  avatar_url  TEXT,

  -- Contenido del mensaje con validación de largo
  mensaje     TEXT        NOT NULL CHECK (char_length(mensaje) BETWEEN 1 AND 400),

  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice compuesto para la consulta principal: "últimos N mensajes de partido X"
CREATE INDEX IF NOT EXISTS idx_chat_partido_fecha
  ON public.chat_messages(partido_id, created_at DESC);

COMMENT ON TABLE public.chat_messages IS 'Chat en vivo por partido. Desnormalizado (username/avatar) para evitar JOINs.';


-- ══════════════════════════════════════════════════════════════════
-- TABLA 5: prode_predictions
-- El "Prode": el usuario pronostica el marcador exacto ANTES del partido.
-- Restricción clave: solo se puede guardar/modificar ANTES de que empiece.
-- La puntuación se calcula automáticamente al finalizar el partido (trigger).
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.prode_predictions (
  -- Clave compuesta: un pronóstico por usuario por partido
  partido_id          UUID  NOT NULL REFERENCES public.partidos(id) ON DELETE CASCADE,
  user_id             UUID  NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (partido_id, user_id),

  -- El pronóstico del usuario
  pred_goles_local    INT   NOT NULL CHECK (pred_goles_local    >= 0),
  pred_goles_visitante INT  NOT NULL CHECK (pred_goles_visitante >= 0),

  -- Resultado calculado automáticamente por el trigger al finalizar el partido.
  -- NULL = partido no finalizado todavía.
  -- 0 = fallo, 1 = acertó signo (ganador/empate), 3 = resultado exacto.
  puntos_obtenidos    INT   CHECK (puntos_obtenidos IN (0, 1, 3)),

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para el ranking del prode
CREATE INDEX IF NOT EXISTS idx_prode_user     ON public.prode_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_prode_partido  ON public.prode_predictions(partido_id);

COMMENT ON TABLE  public.prode_predictions IS 'Pronósticos pre-partido. Puntos calculados por trigger al finalizar.';
COMMENT ON COLUMN public.prode_predictions.puntos_obtenidos IS 'NULL=pendiente, 0=fallo, 1=signo correcto, 3=exacto.';


-- ══════════════════════════════════════════════════════════════════
-- FUNCIONES Y TRIGGERS
-- ══════════════════════════════════════════════════════════════════

-- ── Trigger 1: Crear perfil automáticamente al registrarse ────────
-- Se dispara cuando Supabase Auth inserta un nuevo usuario.
-- Esto evita que el developer tenga que hacer dos llamadas al registrarse.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER   -- Corre con permisos del dueño (bypass RLS)
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    -- Prioridad: metadata.username > parte local del email > 'usuario'
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      NEW.raw_user_meta_data->>'full_name',
      SPLIT_PART(NEW.email, '@', 1),
      'usuario'
    ),
    -- Para Google OAuth, el avatar viene en raw_user_meta_data
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING; -- Idempotente: no falla si ya existe
  RETURN NEW;
END;
$$;

-- Asociar el trigger al evento de auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── Trigger 2: Calcular puntos del Prode al finalizar partido ─────
-- Se dispara cuando el Worker actualiza estado → 'finalizado'.
-- Calcula los puntos de TODOS los pronósticos del partido de una sola vez.
-- Evita hacer cálculos en el frontend o en el Worker.
CREATE OR REPLACE FUNCTION public.calcular_puntos_prode()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Solo actuar cuando el partido pasa a 'finalizado' con goles definidos
  IF NEW.estado = 'finalizado'
     AND OLD.estado <> 'finalizado'
     AND NEW.goles_local IS NOT NULL
     AND NEW.goles_visitante IS NOT NULL
  THEN

    -- ── Paso 1: Asignar puntos a cada pronóstico ──────────────────
    UPDATE public.prode_predictions AS pp
    SET
      puntos_obtenidos = CASE
        -- Resultado exacto: 3 puntos
        WHEN pp.pred_goles_local = NEW.goles_local
         AND pp.pred_goles_visitante = NEW.goles_visitante
        THEN 3

        -- Acertó el signo (quién gana o empate): 1 punto
        WHEN SIGN(pp.pred_goles_local - pp.pred_goles_visitante)
           = SIGN(NEW.goles_local - NEW.goles_visitante)
        THEN 1

        -- Falló todo: 0 puntos
        ELSE 0
      END,
      updated_at = NOW()
    WHERE pp.partido_id = NEW.id;

    -- ── Paso 2: Acumular puntos en el perfil del usuario ──────────
    -- Sumar los puntos nuevos al total y actualizar los contadores.
    UPDATE public.profiles AS p
    SET
      puntos_prode     = p.puntos_prode    + pp.puntos_obtenidos,
      aciertos_exactos = p.aciertos_exactos + CASE WHEN pp.puntos_obtenidos = 3 THEN 1 ELSE 0 END,
      aciertos_signo   = p.aciertos_signo  + CASE WHEN pp.puntos_obtenidos = 1 THEN 1 ELSE 0 END,
      updated_at       = NOW()
    FROM public.prode_predictions pp
    WHERE pp.partido_id = NEW.id
      AND pp.user_id    = p.id
      AND pp.puntos_obtenidos IS NOT NULL;

  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_partido_finalizado ON public.partidos;
CREATE TRIGGER on_partido_finalizado
  AFTER UPDATE OF estado ON public.partidos
  FOR EACH ROW EXECUTE FUNCTION public.calcular_puntos_prode();


-- ── Función: Estadísticas de votos en vivo (para el frontend) ─────
-- Retorna los porcentajes de cada opción para un partido.
-- El frontend la llama con: supabase.rpc('get_live_vote_stats', { p_partido_id: '...' })
CREATE OR REPLACE FUNCTION public.get_live_vote_stats(p_partido_id UUID)
RETURNS JSON
LANGUAGE plpgsql
STABLE      -- No modifica datos, puede ser cacheado
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total   INT;
  result  JSON;
BEGIN
  SELECT COUNT(*) INTO total
  FROM public.live_votes
  WHERE partido_id = p_partido_id;

  IF total = 0 THEN
    RETURN json_build_object('local', 0, 'empate', 0, 'visitante', 0, 'total', 0);
  END IF;

  SELECT json_build_object(
    'local',
      ROUND(COUNT(*) FILTER (WHERE voto = 'local')     * 100.0 / total),
    'empate',
      ROUND(COUNT(*) FILTER (WHERE voto = 'empate')    * 100.0 / total),
    'visitante',
      ROUND(COUNT(*) FILTER (WHERE voto = 'visitante') * 100.0 / total),
    'total', total
  )
  INTO result
  FROM public.live_votes
  WHERE partido_id = p_partido_id;

  RETURN result;
END;
$$;


-- ── Función: Ranking del Prode ────────────────────────────────────
-- Top N jugadores. El frontend la llama para mostrar el leaderboard.
-- Muy eficiente: solo lee la columna desnormalizada, sin calcular nada.
CREATE OR REPLACE FUNCTION public.get_prode_ranking(p_limit INT DEFAULT 20)
RETURNS TABLE (
  posicion         INT,
  user_id          UUID,
  username         TEXT,
  avatar_url       TEXT,
  puntos_prode     INT,
  aciertos_exactos INT,
  aciertos_signo   INT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    ROW_NUMBER() OVER (ORDER BY p.puntos_prode DESC, p.aciertos_exactos DESC)::INT AS posicion,
    p.id,
    p.username,
    p.avatar_url,
    p.puntos_prode,
    p.aciertos_exactos,
    p.aciertos_signo
  FROM public.profiles p
  WHERE p.puntos_prode > 0
  ORDER BY p.puntos_prode DESC, p.aciertos_exactos DESC
  LIMIT p_limit;
$$;


-- ── Función: Pronósticos de un usuario (con resultado incluido) ───
CREATE OR REPLACE FUNCTION public.get_my_prode(p_user_id UUID)
RETURNS TABLE (
  partido_id           UUID,
  equipo_local         TEXT,
  equipo_visitante     TEXT,
  fecha_utc            TIMESTAMPTZ,
  estado               TEXT,
  pred_goles_local     INT,
  pred_goles_visitante INT,
  goles_local          INT,
  goles_visitante      INT,
  puntos_obtenidos     INT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    pa.id,
    pa.equipo_local,
    pa.equipo_visitante,
    pa.fecha_utc,
    pa.estado,
    pp.pred_goles_local,
    pp.pred_goles_visitante,
    pa.goles_local,
    pa.goles_visitante,
    pp.puntos_obtenidos
  FROM public.prode_predictions pp
  JOIN public.partidos pa ON pa.id = pp.partido_id
  WHERE pp.user_id = p_user_id
  ORDER BY pa.fecha_utc ASC;
$$;


-- ══════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- La segunda capa de seguridad después de las API keys.
-- Garantiza que aunque alguien tenga la anon key, solo ve/modifica lo que debe.
-- ══════════════════════════════════════════════════════════════════

-- Activar RLS en todas las tablas
ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partidos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_votes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prode_predictions  ENABLE ROW LEVEL SECURITY;


-- ── PROFILES ──────────────────────────────────────────────────────

-- Cualquiera puede ver perfiles (para el ranking del prode, avatares en chat)
CREATE POLICY "Perfiles: lectura pública"
  ON public.profiles FOR SELECT
  USING (true);

-- Solo el dueño puede actualizar su propio perfil
CREATE POLICY "Perfiles: solo el dueño edita"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- El insert lo hace el trigger handle_new_user con SECURITY DEFINER, no el usuario.
-- No necesita política de INSERT desde el cliente.


-- ── PARTIDOS ──────────────────────────────────────────────────────

-- Todos pueden leer partidos (incluidos usuarios anónimos)
CREATE POLICY "Partidos: lectura pública"
  ON public.partidos FOR SELECT
  USING (true);

-- Nadie puede escribir/modificar desde el frontend.
-- El Worker usa la Service Role Key que bypasea RLS completamente.
-- No se crean políticas de INSERT/UPDATE/DELETE → quedan bloqueadas para el cliente.


-- ── LIVE VOTES ────────────────────────────────────────────────────

-- Cualquiera puede ver los votos (para mostrar porcentajes a todos)
CREATE POLICY "Votos: lectura pública"
  ON public.live_votes FOR SELECT
  USING (true);

-- Solo usuarios autenticados pueden insertar su propio voto
CREATE POLICY "Votos: insertar propio"
  ON public.live_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede actualizar (cambiar) su voto
CREATE POLICY "Votos: actualizar propio"
  ON public.live_votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Restricción extra: no se puede votar en partidos que ya terminaron.
-- (La validación principal es en el frontend, pero esto es el seguro de BD)


-- ── CHAT MESSAGES ─────────────────────────────────────────────────

-- Todos pueden leer el chat
CREATE POLICY "Chat: lectura pública"
  ON public.chat_messages FOR SELECT
  USING (true);

-- Solo autenticados pueden escribir, y solo pueden escribir como ellos mismos
CREATE POLICY "Chat: solo autenticados escriben"
  ON public.chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Nadie puede editar ni borrar mensajes del chat (integridad histórica)
-- No se crean políticas UPDATE/DELETE → bloqueadas.


-- ── PRODE PREDICTIONS ─────────────────────────────────────────────

-- Todos pueden ver los pronósticos (transparencia del juego)
CREATE POLICY "Prode: lectura pública"
  ON public.prode_predictions FOR SELECT
  USING (true);

-- Solo autenticados pueden crear su propio pronóstico
CREATE POLICY "Prode: insertar propio"
  ON public.prode_predictions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede modificar su pronóstico,
-- Y SOLO si el partido todavía no empezó (estado = 'programado')
CREATE POLICY "Prode: modificar propio solo antes del partido"
  ON public.prode_predictions FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.partidos
      WHERE id = partido_id AND estado = 'programado'
    )
  )
  WITH CHECK (auth.uid() = user_id);


-- ══════════════════════════════════════════════════════════════════
-- HABILITAR REALTIME
-- Necesario para que el frontend reciba cambios en tiempo real
-- sin hacer polling. Ir también a: Supabase Dashboard → Database →
-- Replication y activar las tablas manualmente si este comando no alcanza.
-- ══════════════════════════════════════════════════════════════════
ALTER PUBLICATION supabase_realtime ADD TABLE public.partidos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;


-- ══════════════════════════════════════════════════════════════════
-- DATOS DE PRUEBA (opcional, para desarrollo)
-- Descomenta para tener partidos de prueba sin conectar la API.
-- ══════════════════════════════════════════════════════════════════
/*
INSERT INTO public.partidos
  (id_football_data, fase, jornada, fecha_utc, equipo_local, equipo_visitante, estado, goles_local, goles_visitante)
VALUES
  (1001, 'Grupo A', 1, NOW() - INTERVAL '2 hours', 'Argentina', 'Arabia Saudita', 'finalizado', 1, 2),
  (1002, 'Grupo A', 1, NOW() - INTERVAL '1 hour',  'México',    'Polonia',        'finalizado', 0, 0),
  (1003, 'Grupo B', 1, NOW() + INTERVAL '2 hours', 'España',    'Alemania',       'programado', NULL, NULL),
  (1004, 'Grupo C', 1, NOW() + INTERVAL '30 minutes','Brasil',  'Suiza',          'en_curso',   1, 0)
ON CONFLICT DO NOTHING;
*/












/*
POSIBLE SQL PARA EL CHATBOT (NO EJECUTAR, SOLO REFERENCIA):
-- ══════════════════════════════════════════════════════════════════
-- MÓDULO DE INTELIGENCIA ARTIFICIAL (RAG & Historial)
-- ══════════════════════════════════════════════════════════════════

-- 1. Habilitar la extensión de vectores (Crucial para RAG)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Base de Conocimiento (Knowledge Base)
-- Aquí guardarás textos estáticos: reglas del prode, historia de los mundiales, etc.
CREATE TABLE IF NOT EXISTS public.bot_knowledge (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contenido     TEXT NOT NULL,
  -- Metadata útil para filtrar antes de buscar (ej: {"tipo": "regla", "tema": "puntuacion"})
  metadata      JSONB DEFAULT '{}', 
  -- El vector matemático que representa el texto. 
  -- 768 es el tamaño típico para modelos de embeddings de código abierto o de Google/OpenAI.
  embedding     vector(768) 
);

-- Índice HNSW para que las búsquedas vectoriales sean ultra rápidas
CREATE INDEX IF NOT EXISTS idx_bot_knowledge_embedding 
ON public.bot_knowledge USING hnsw (embedding vector_ip_ops);

-- 3. Función RPC para buscar contexto por similitud
-- Tu backend en Node.js llamará a esta función pasándole la pregunta del usuario vectorizada.
CREATE OR REPLACE FUNCTION public.match_knowledge(
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  contenido TEXT,
  metadata JSONB,
  similitud float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    bk.id,
    bk.contenido,
    bk.metadata,
    1 - (bk.embedding <=> query_embedding) AS similitud
  FROM public.bot_knowledge bk
  -- Solo devuelve resultados que superen el umbral de similitud
  WHERE 1 - (bk.embedding <=> query_embedding) > match_threshold
  ORDER BY bk.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 4. Historial de Chat con el Bot
-- Para que el bot recuerde qué viene hablando con cada usuario en particular.
CREATE TABLE IF NOT EXISTS public.ai_chat_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para cargar rápido la conversación de un usuario
CREATE INDEX IF NOT EXISTS idx_ai_chat_user ON public.ai_chat_sessions(user_id, created_at ASC);

-- Habilitar RLS en el chat del bot
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven su propio historial de bot"
  ON public.ai_chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios insertan sus mensajes al bot"
  ON public.ai_chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
  /*

