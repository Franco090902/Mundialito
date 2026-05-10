-- Script para ejecutar en el SQL Editor de Supabase
-- Crea la tabla "mundiales_historicos"

CREATE TABLE IF NOT EXISTS mundiales_historicos (
    año INTEGER PRIMARY KEY,
    sede TEXT NOT NULL,
    fechas TEXT,
    campeon TEXT NOT NULL,
    campeon_bandera TEXT,
    subcampeon TEXT,
    subcampeon_bandera TEXT,
    tercero TEXT,
    cuarto TEXT,
    goleadores JSONB DEFAULT '[]'::jsonb,
    records JSONB DEFAULT '[]'::jsonb,
    datos_curiosos JSONB DEFAULT '[]'::jsonb,
    videos JSONB DEFAULT '[]'::jsonb,
    partido_final JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Políticas de seguridad (Opcional, para permitir lectura a todo el mundo)
ALTER TABLE mundiales_historicos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública a mundiales_historicos" 
ON mundiales_historicos 
FOR SELECT 
USING (true);
