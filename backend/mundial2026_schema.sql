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
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

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
CREATE TABLE public.prode_predictions (
  partido_id uuid NOT NULL,
  user_id uuid NOT NULL,
  pred_goles_local integer NOT NULL CHECK (pred_goles_local >= 0),
  pred_goles_visitante integer NOT NULL CHECK (pred_goles_visitante >= 0),
  puntos_obtenidos integer CHECK (puntos_obtenidos = ANY (ARRAY[0, 1, 3])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT prode_predictions_pkey PRIMARY KEY (partido_id, user_id),
  CONSTRAINT prode_predictions_partido_id_fkey FOREIGN KEY (partido_id) REFERENCES public.partidos(id),
  CONSTRAINT prode_predictions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
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

Tercer cambio
ALTER TABLE public.partidos
  DROP COLUMN IF EXISTS posesion_local,
  DROP COLUMN IF EXISTS posesion_visitante;