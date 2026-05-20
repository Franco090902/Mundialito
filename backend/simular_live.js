require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function simularPartidoEnVivo() {
  console.log('⚽ Iniciando simulador de partido en vivo...');

  // Buscar un partido programado o finalizado para simular
  const { data: partidos, error } = await supabase
    .from('partidos')
    .select('id, equipo_local, equipo_visitante')
    .limit(1);

  if (error || !partidos || partidos.length === 0) {
    console.error('❌ No se encontraron partidos en la base de datos para simular.');
    return;
  }

  const partido = partidos[0];
  console.log(`🔄 Convirtiendo a EN VIVO: ${partido.equipo_local} vs ${partido.equipo_visitante}`);

  let minuto = 1;
  let golesLocal = 0;
  let golesVisitante = 0;

  // Actualizar el estado a en_curso inicialmente
  await supabase.from('partidos').update({
    estado: 'en_curso',
    minuto: minuto,
    goles_local: golesLocal,
    goles_visitante: golesVisitante
  }).eq('id', partido.id);

  console.log(`✅ Partido puesto en vivo! Abre el frontend para verlo.`);
  console.log(`⏱️  El simulador actualizará el partido cada 5 segundos. Presiona Ctrl+C para detener.\n`);

  setInterval(async () => {
    minuto++;
    
    // Simular goles aleatorios para darle realismo
    if (Math.random() < 0.15) golesLocal++;
    if (Math.random() < 0.15) golesVisitante++;

    // Generar estadísticas falsas para que se actualicen las barras de stats
    const stats = {
      posesion_local: Math.floor(Math.random() * 20) + 40,
      posesion_visitante: 0, // Se calcula restando 100
      tiros_local: Math.floor(Math.random() * 10),
      tiros_visitante: Math.floor(Math.random() * 10),
      tiros_al_arco_local: Math.floor(Math.random() * 5),
      tiros_al_arco_visit: Math.floor(Math.random() * 5),
      corners_local: Math.floor(Math.random() * 8),
      corners_visitante: Math.floor(Math.random() * 8),
      faltas_local: Math.floor(Math.random() * 15),
      faltas_visitante: Math.floor(Math.random() * 15),
    };
    stats.posesion_visitante = 100 - stats.posesion_local;

    await supabase.from('partidos').update({
      minuto: minuto,
      goles_local: golesLocal,
      goles_visitante: golesVisitante,
      estadisticas: stats,
      updated_at: new Date().toISOString()
    }).eq('id', partido.id);

    console.log(`⏱️ ${minuto}' | ${partido.equipo_local} ${golesLocal} - ${golesVisitante} ${partido.equipo_visitante}`);

  }, 5000); // Actualizar cada 5 segundos para que se note en el frontend
}

simularPartidoEnVivo();
