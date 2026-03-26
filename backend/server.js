require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cron = require('node-cron');

// 1. Conexión a Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

console.log('✅ Servidor de Todo Fútbol iniciado...');

// ============================================================================
// ESTRATEGIA 1: EL "HOY" (Football-Data.org) - Fixtures y Tablas
// Límite: 10 peticiones/minuto.
// ============================================================================
async function actualizarFixture() {
  console.log('🔄 Consultando Football-Data (Fixture general)...');
  try {
    // Aquí harás el fetch a Football-Data.org
    // const respuesta = await axios.get('URL_FOOTBALL_DATA', { headers: { 'X-Auth-Token': 'TU_TOKEN' } });
    
    // Luego actualizas Supabase
    // await supabase.from('partidos').upsert(respuesta.data...);
  } catch (error) {
    console.error('Error en Fixture:', error.message);
  }
}

// Ejecutar cada 1 hora (No necesitas actualizar el fixture de mañana cada segundo)
cron.schedule('0 * * * *', actualizarFixture);


// ============================================================================
// ESTRATEGIA 2: EL "MINUTO A MINUTO" (API-Football) - Solo partidos en vivo
// Límite: 100 peticiones/día (¡Cuidado aquí!)
// ============================================================================
async function actualizarEnVivo() {
  // Primero, le preguntamos a NUESTRA base de datos si hay algún partido jugándose AHORA
  const { data: partidosEnJuego } = await supabase
    .from('partidos')
    .select('id_externo')
    .eq('estado', 'en_curso');

  // Si no hay partidos en juego, NO gastamos peticiones a la API
  if (!partidosEnJuego || partidosEnJuego.length === 0) {
    return; 
  }

  console.log('🔥 Hay partidos en curso. Consultando API-Football...');
  try {
    // Si hay partidos, consultamos API-Football solo para esos IDs
    // const respuesta = await axios.get('URL_API_FOOTBALL/fixtures?live=all', { headers: { 'x-apisports-key': 'TU_TOKEN' } });
    
    // Actualizamos los goles en Supabase para que el Frontend (Realtime) los detecte
    // await supabase.from('partidos').update({ goles_local: X, goles_visitante: Y }).eq('id_externo', ID);
  } catch (error) {
    console.error('Error en Minuto a Minuto:', error.message);
  }
}

// Ejecutar cada 3 minutos 
// (90 min de partido / 3 = 30 peticiones por partido. Te sobran 70 para el resto del día)
cron.schedule('*/3 * * * *', actualizarEnVivo);


// ============================================================================
// ESTRATEGIA 3: LA "HISTORIA" (TheSportsDB) - Estadios, equipos, biografías
// ============================================================================
async function actualizarHistoria() {
  console.log('📚 Consultando TheSportsDB (Historia)...');
  // Esta data casi nunca cambia. Puedes ejecutarla una vez al día de madrugada.
}

// Ejecutar a las 03:00 AM todos los días
cron.schedule('0 3 * * *', actualizarHistoria);