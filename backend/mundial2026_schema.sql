-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  username text NOT NULL,
  avatar_url text,
  puntos_prode integer NOT NULL DEFAULT 0,
  aciertos_exactos integer NOT NULL DEFAULT 0,
  aciertos_signo integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.partidos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  id_football_data integer UNIQUE,
  id_api_football integer UNIQUE,
  fase text NOT NULL,
  jornada integer,
  fecha_utc timestamp with time zone NOT NULL,
  equipo_local text NOT NULL,
  equipo_visitante text NOT NULL,
  escudo_local text,
  escudo_visitante text,
  estado text NOT NULL DEFAULT 'programado'::text CHECK (estado = ANY (ARRAY['programado'::text, 'en_curso'::text, 'finalizado'::text, 'suspendido'::text])),
  minuto integer,
  goles_local integer,
  goles_visitante integer,
  estadisticas jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  edicion_mundial text,
  CONSTRAINT partidos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.live_votes (
  partido_id uuid NOT NULL,
  user_id uuid NOT NULL,
  voto text NOT NULL CHECK (voto = ANY (ARRAY['local'::text, 'empate'::text, 'visitante'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT live_votes_pkey PRIMARY KEY (partido_id, user_id),
  CONSTRAINT live_votes_partido_id_fkey FOREIGN KEY (partido_id) REFERENCES public.partidos(id),
  CONSTRAINT live_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.chat_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  partido_id uuid NOT NULL,
  user_id uuid NOT NULL,
  username text NOT NULL,
  avatar_url text,
  mensaje text NOT NULL CHECK (char_length(mensaje) >= 1 AND char_length(mensaje) <= 400),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT chat_messages_pkey PRIMARY KEY (id),
  CONSTRAINT chat_messages_partido_id_fkey FOREIGN KEY (partido_id) REFERENCES public.partidos(id),
  CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.prode_predictions (
  partido_id uuid NOT NULL,
  user_id uuid NOT NULL,
  pred_goles_local integer NOT NULL CHECK (pred_goles_local >= 0),
  pred_goles_visitante integer NOT NULL CHECK (pred_goles_visitante >= 0),
  puntos_obtenidos integer CHECK (puntos_obtenidos IS NULL OR (puntos_obtenidos = ANY (ARRAY[0, 1, 3]))),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  puntos_bonus integer NOT NULL DEFAULT 0 CHECK (puntos_bonus = ANY (ARRAY[0, 5])),
  bonus_aplicado boolean NOT NULL DEFAULT false,
  CONSTRAINT prode_predictions_pkey PRIMARY KEY (partido_id, user_id),
  CONSTRAINT prode_predictions_partido_id_fkey FOREIGN KEY (partido_id) REFERENCES public.partidos(id),
  CONSTRAINT prode_predictions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.articulos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  contenido text NOT NULL,
  categoria text NOT NULL,
  imagen_url text,
  created_at timestamp with time zone DEFAULT now(),
  autor_id uuid,
  publicado boolean NOT NULL DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT articulos_pkey PRIMARY KEY (id),
  CONSTRAINT articulos_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.productos_ml (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  link_afiliado text NOT NULL,
  imagen_url text,
  precio text,
  categoria_relacionada text,
  created_at timestamp with time zone DEFAULT now(),
  activo boolean NOT NULL DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT productos_ml_pkey PRIMARY KEY (id)
);
CREATE TABLE public.chatbot_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  consulta text,
  respuesta text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chatbot_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.historia_ediciones (
  id_thesports bigint NOT NULL,
  nombre text,
  fecha date,
  equipo_local text,
  equipo_visitante text,
  goles_local integer,
  goles_visitante integer,
  temporada text,
  CONSTRAINT historia_ediciones_pkey PRIMARY KEY (id_thesports)
);
CREATE TABLE public.posiciones (
  id text NOT NULL,
  grupo text NOT NULL,
  posicion integer NOT NULL,
  equipo text NOT NULL,
  equipo_short text,
  escudo text,
  pj integer DEFAULT 0,
  g integer DEFAULT 0,
  e integer DEFAULT 0,
  p integer DEFAULT 0,
  gf integer DEFAULT 0,
  gc integer DEFAULT 0,
  dg integer DEFAULT 0,
  pts integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT posiciones_pkey PRIMARY KEY (id)
);
CREATE TABLE public.goleadores (
  id text NOT NULL,
  nombre text NOT NULL,
  equipo text NOT NULL,
  equipo_short text,
  escudo text,
  goles integer DEFAULT 0,
  asistencias integer DEFAULT 0,
  partidos integer DEFAULT 0,
  penales integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT goleadores_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tarjetas (
  id text NOT NULL,
  nombre text NOT NULL,
  equipo text NOT NULL,
  equipo_short text,
  escudo text,
  amarillas integer DEFAULT 0,
  rojas integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tarjetas_pkey PRIMARY KEY (id)
);
CREATE TABLE public.mundiales_historicos (
  año integer NOT NULL,
  sede text NOT NULL,
  fechas text,
  campeon text NOT NULL,
  campeon_bandera text,
  subcampeon text,
  subcampeon_bandera text,
  tercero text,
  cuarto text,
  goleadores jsonb DEFAULT '[]'::jsonb,
  records jsonb DEFAULT '[]'::jsonb,
  datos_curiosos jsonb DEFAULT '[]'::jsonb,
  videos jsonb DEFAULT '[]'::jsonb,
  partido_final jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT mundiales_historicos_pkey PRIMARY KEY (año)
);
CREATE TABLE public.prode_groups (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL CHECK (char_length(nombre) >= 2 AND char_length(nombre) <= 50),
  admin_id uuid NOT NULL,
  invite_code text NOT NULL DEFAULT upper(substr(md5((random())::text), 1, 6)) UNIQUE,
  es_publico boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT prode_groups_pkey PRIMARY KEY (id),
  CONSTRAINT prode_groups_admin_fkey FOREIGN KEY (admin_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.prode_group_members (
  group_id uuid NOT NULL,
  user_id uuid NOT NULL,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT prode_group_members_pkey PRIMARY KEY (group_id, user_id),
  CONSTRAINT prode_group_members_group_fkey FOREIGN KEY (group_id) REFERENCES public.prode_groups(id),
  CONSTRAINT prode_group_members_user_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT prode_group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.prode_groups(id)
);
CREATE TABLE public.encuestas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  partido_id uuid NOT NULL,
  pregunta text NOT NULL,
  tipo text NOT NULL CHECK (tipo = ANY (ARRAY['winner'::text, 'cards_range'::text, 'fouls_range'::text, 'mvp'::text, 'possession'::text, 'next_scorer'::text, 'goal_type'::text, 'first_sub'::text, 'direct_card'::text])),
  opciones jsonb NOT NULL DEFAULT '[]'::jsonb,
  activa boolean NOT NULL DEFAULT true,
  creada_en integer DEFAULT 0,
  expires_at_minute integer DEFAULT 90,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT encuestas_pkey PRIMARY KEY (id),
  CONSTRAINT encuestas_partido_id_fkey FOREIGN KEY (partido_id) REFERENCES public.partidos(id)
);
CREATE TABLE public.encuestas_votos (
  encuesta_id uuid NOT NULL,
  user_id uuid NOT NULL,
  opcion_index integer NOT NULL CHECK (opcion_index >= 0),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT encuestas_votos_pkey PRIMARY KEY (encuesta_id, user_id),
  CONSTRAINT encuestas_votos_encuesta_id_fkey FOREIGN KEY (encuesta_id) REFERENCES public.encuestas(id),
  CONSTRAINT encuestas_votos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.game_stats (
  user_id uuid NOT NULL,
  game_name text NOT NULL,
  max_score integer NOT NULL DEFAULT 0,
  current_streak integer NOT NULL DEFAULT 0,
  max_streak integer NOT NULL DEFAULT 0,
  last_played_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT game_stats_pkey PRIMARY KEY (user_id, game_name),
  CONSTRAINT game_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
