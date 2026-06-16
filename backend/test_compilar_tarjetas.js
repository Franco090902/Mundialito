require('dotenv').config();
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const key = process.env.ZAFRONIX_API_KEY;
const baseUrl = 'https://api.zafronix.com/fifa/worldcup/v1';

// Copied translation function from server.js to maintain consistency
const TRADUCCION_EQUIPOS = {
  // Europa (UEFA)
  'Germany': 'Alemania', 'France': 'Francia', 'Spain': 'España', 'England': 'Inglaterra',
  'Italy': 'Italia', 'Netherlands': 'Países Bajos', 'Croatia': 'Croacia', 'Belgium': 'Bélgica',
  'Portugal': 'Portugal', 'Switzerland': 'Suiza', 'Denmark': 'Dinamarca', 'Poland': 'Polonia',
  'Serbia': 'Serbia', 'Ukraine': 'Ucrania', 'Turkey': 'Turquía', 'Scotland': 'Escocia',
  'Wales': 'Gales', 'Sweden': 'Suecia', 'Austria': 'Austria', 'Czechia': 'Chequia', 
  'Czech Republic': 'República Checa', 'Norway': 'Noruega', 'Greece': 'Grecia', 
  'Finland': 'Finlandia', 'Slovakia': 'Eslovaquia', 'Slovenia': 'Eslovenia', 
  'Hungary': 'Hungría', 'Romania': 'Rumania', 'Bulgaria': 'Bulgaria', 
  'Iceland': 'Islandia', 'Albania': 'Albania', 'Georgia': 'Georgia', 
  'Republic of Ireland': 'Irlanda', 'Ireland': 'Irlanda', 'Northern Ireland': 'Irlanda del Norte',
  
  // Sudamérica (CONMEBOL)
  'Argentina': 'Argentina', 'Brazil': 'Brasil', 'Uruguay': 'Uruguay', 'Colombia': 'Colombia',
  'Ecuador': 'Ecuador', 'Paraguay': 'Paraguay', 'Chile': 'Chile', 'Peru': 'Perú', 'Venezuela': 'Venezuela',
  'Bolivia': 'Bolivia',
  
  // Norte, Centroamérica y Caribe (CONCACAF)
  'United States': 'Estados Unidos', 'USA': 'Estados Unidos', 'Mexico': 'México', 'Canada': 'Canadá',
  'Costa Rica': 'Costa Rica', 'Panama': 'Panamá', 'Jamaica': 'Jamaica', 'Honduras': 'Honduras',
  'El Salvador': 'El Salvador', 'Curaçao': 'Curazao', 'Curacao': 'Curazao', 'Haiti': 'Haití',
  'Trinidad and Tobago': 'Trinidad y Tobago', 'Guatemala': 'Guatemala', 'Nicaragua': 'Nicaragua', 'Cuba': 'Cuba',
  
  // África (CAF)
  'Morocco': 'Marruecos', 'Senegal': 'Senegal', 'Cameroon': 'Camerún', 'Ivory Coast': 'Costa de Marfil',
  'Nigeria': 'Nigeria', 'Egypt': 'Egipto', 'Tunisia': 'Túnez', 'Algeria': 'Argelia', 'Ghana': 'Ghana',
  'South Africa': 'Sudáfrica', 'Mali': 'Malí', 'DR Congo': 'República Democrática del Congo',
  'Democratic Republic of the Congo': 'República Democrática del Congo', 'Congo': 'Congo',
  'Angola': 'Angola', 'Zambia': 'Zambia', 'Uganda': 'Uganda', 'Togo': 'Togo', 'Benin': 'Benín',
  'Guinea': 'Guinea', 'Gabon': 'Gabón', 'Libya': 'Libia', 'Sudan': 'Sudán', 'Cape Verde': 'Cabo Verde',
  'Mauritania': 'Mauritania', 'Madagascar': 'Madagascar', 'Kenya': 'Kenia', 'Zimbabwe': 'Zimbabue',
  
  // Asia (AFC)
  'Japan': 'Japón', 'South Korea': 'Corea del Sur', 'Korea Republic': 'Corea del Sur', 'Iran': 'Irán', 
  'Saudi Arabia': 'Arabia Saudita', 'Australia': 'Australia', 'Qatar': 'Catar', 'Iraq': 'Irak', 
  'United Arab Emirates': 'Emiratos Árabes Unidos', 'Jordan': 'Jordania', 'Uzbekistan': 'Uzbekistán',
  'China': 'China', 'China PR': 'China', 'North Korea': 'Corea del Norte', 'Syria': 'Siria', 
  'Bahrain': 'Bahréin', 'Oman': 'Omán', 'Vietnam': 'Vietnam', 'Thailand': 'Tailandia', 
  'Indonesia': 'Indonesia', 'Lebanon': 'Líbano', 'Palestine': 'Palestina', 'Kuwait': 'Kuwait',
  'Kyrgyzstan': 'Kirguistán', 'Tajikistan': 'Tayikistán',
  
  // Oceanía (OFC)
  'New Zealand': 'Nueva Zelanda', 'Fiji': 'Fiyi', 'Solomon Islands': 'Islas Salomón', 
  'Vanuatu': 'Vanuatu', 'New Caledonia': 'Nueva Caledonia', 'Tahiti': 'Tahití', 
  'Papua New Guinea': 'Papúa Nueva Guinea', 'Samoa': 'Samoa'
};

function translateTeam(name) {
  if (!name) return name;
  const trimmed = name.trim();
  return TRADUCCION_EQUIPOS[trimmed] || trimmed;
}

async function run() {
  try {
    console.log("1. Fetching teams and flags from Zafronix...");
    const responseTeams = await axios.get(`${baseUrl}/tournaments/2026`, {
      headers: { 'X-API-Key': key }
    });
    
    const teamsMap = {};
    (responseTeams.data.teams || []).forEach(t => {
      teamsMap[t.name.trim()] = t.flag?.flagUrl || null;
    });
    console.log(`Mapped ${Object.keys(teamsMap).length} team flags.`);
    
    console.log("\n2. Fetching World Cup 2026 matches from Zafronix...");
    const responseMatches = await axios.get(`${baseUrl}/matches?year=2026`, {
      headers: { 'X-API-Key': key }
    });
    
    const matches = responseMatches.data.data || [];
    console.log(`Retrieved ${matches.length} matches.`);
    
    const cardsMap = new Map();
    matches.forEach(m => {
      const cards = m.cards || [];
      const homeTeam = m.homeTeam?.trim();
      const awayTeam = m.awayTeam?.trim();

      cards.forEach(c => {
        const playerName = c.player?.trim();
        const teamEnglish = c.team === 'home' ? homeTeam : awayTeam;
        const teamSpanish = translateTeam(teamEnglish);
        const color = c.color || 'yellow';

        const id = `${playerName}-${teamSpanish}`;
        if (!cardsMap.has(id)) {
          cardsMap.set(id, {
            id,
            nombre: playerName,
            equipo: teamSpanish,
            equipo_short: teamSpanish,
            escudo: teamsMap[teamEnglish] || null,
            amarillas: 0,
            rojas: 0,
            updated_at: new Date().toISOString()
          });
        }

        const current = cardsMap.get(id);
        if (color === 'yellow') {
          current.amarillas += 1;
        } else if (['red', 'second_yellow', 'indirect_red'].includes(color)) {
          current.rojas += 1;
        }
      });
    });
    
    const rows = Array.from(cardsMap.values());
    console.log(`Compiled ${rows.length} players with cards.`);
    
    if (rows.length > 0) {
      console.log("\n3. Cleaning old tarjetas from Supabase...");
      const { error: deleteErr } = await supabase.from('tarjetas').delete().neq('id', 'borrar_todo');
      if (deleteErr) throw deleteErr;
      console.log("Old cards deleted.");
      
      console.log("\n4. Inserting new Compiled cards into Supabase...");
      const { error: insertErr } = await supabase.from('tarjetas').upsert(rows, { onConflict: 'id' });
      if (insertErr) throw insertErr;
      console.log(`Successfully upserted ${rows.length} cards into Supabase.`);
    } else {
      console.log("No card data to insert.");
    }
  } catch (err) {
    console.error("Failed:", err.message);
  }
}

run();
