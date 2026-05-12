require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Faltan las variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el archivo .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ediciones = [
  {
    año: 1930,
    sede: "Uruguay",
    fechas: "13 Jul – 30 Jul",
    campeon: "Uruguay", campeon_bandera: "🇺🇾",
    subcampeon: "Argentina", subcampeon_bandera: "🇦🇷",
    tercero: "Estados Unidos", cuarto: "Yugoslavia",
    goleadores: [
      { name: "Guillermo Stábile", flag: "🇦🇷", goals: 8 },
      { name: "Pedro Cea", flag: "🇺🇾", goals: 5 },
      { name: "Bert Patenaude", flag: "🇺🇸", goals: 4 }
    ],
    records: [
      { cat: "Primer gol", val: "19'", desc: "Lucien Laurent (Francia) marcó el primer gol en la historia de los Mundiales." },
      { cat: "Primer Hat-trick", val: "x3", desc: "Bert Patenaude (EEUU) marcó el primer triplete oficial." }
    ],
    datos_curiosos: [
      "No hubo fase de clasificación; los equipos fueron invitados por la FIFA.",
      "Solo participaron 4 selecciones europeas debido al largo viaje en barco.",
      "Héctor Castro, quien marcó para Uruguay, no tenía el antebrazo derecho."
    ],
    videos: [
      { title: "Final Uruguay vs Argentina (1930)", url: "https://youtu.be/wN21I_F7MN0?si=_m0PvvBHgEYskwO-", description: "Imágenes históricas del primer partido final de una Copa del Mundo." }
    ]
  },
  {
    año: 1934,
    sede: "Italia",
    fechas: "27 May – 10 Jun",
    campeon: "Italia", campeon_bandera: "🇮🇹",
    subcampeon: "Checoslovaquia", subcampeon_bandera: "🇨🇸",
    tercero: "Alemania", cuarto: "Austria",
    goleadores: [
      { name: "Oldřich Nejedlý", flag: "🇨🇸", goals: 5 },
      { name: "Edmund Conen", flag: "🇩🇪", goals: 4 },
      { name: "Angelo Schiavio", flag: "🇮🇹", goals: 4 }
    ],
    records: [
      { cat: "Defensor del título", val: "Ausente", desc: "Uruguay no participó en protesta por la baja asistencia europea en 1930." }
    ],
    datos_curiosos: [
      "El anfitrión, Italia, tuvo que jugar la fase de clasificación.",
      "Fue un torneo de eliminación directa desde el principio (octavos de final)."
    ],
    videos: [
      { title: "Resumen Mundial 1934", url: "https://youtu.be/evpu3Jr3Txk?si=7gh6y_kdIgsbs7Hf", description: "Italia se corona campeona en casa." }
    ]
  },
  {
    año: 1938,
    sede: "Francia",
    fechas: "4 Jun – 19 Jun",
    campeon: "Italia", campeon_bandera: "🇮🇹",
    subcampeon: "Hungría", subcampeon_bandera: "🇭🇺",
    tercero: "Brasil", cuarto: "Suecia",
    goleadores: [
      { name: "Leônidas", flag: "🇧🇷", goals: 7 },
      { name: "György Sárosi", flag: "🇭🇺", goals: 5 },
      { name: "Silvio Piola", flag: "🇮🇹", goals: 5 }
    ],
    records: [
      { cat: "Bicampeón", val: "Italia", desc: "Italia se convirtió en la primera selección en ganar dos mundiales consecutivos." }
    ],
    datos_curiosos: [
      "Brasil inventó el 'Diamante Negro', Leônidas, quien hizo goles hasta descalzo.",
      "Austria clasificó pero no jugó debido al Anschluss (anexión por parte de Alemania nazi)."
    ],
    videos: [
      { title: "Final del Mundial 1938 Italia 4-2 Hungria", url: "https://youtu.be/UUyhSCYCCOo?si=VLbznIY8WeYixj2f", description: "Italia domina" }
    ]
  },
  {
    año: 1950,
    sede: "Brasil",
    fechas: "24 Jun – 16 Jul",
    campeon: "Uruguay", campeon_bandera: "🇺🇾",
    subcampeon: "Brasil", subcampeon_bandera: "🇧🇷",
    tercero: "Suecia", cuarto: "España",
    goleadores: [
      { name: "Ademir", flag: "🇧🇷", goals: 8 },
      { name: "Óscar Míguez", flag: "🇺🇾", goals: 5 },
      { name: "Estanislao Basora", flag: "🇪🇸", goals: 4 }
    ],
    records: [
      { cat: "Asistencia", val: "199,854", desc: "El partido final (Maracanazo) tiene el récord de mayor asistencia." },
      { cat: "El Maracanazo", val: "2-1", desc: "Uruguay venció a Brasil en su casa contra todo pronóstico." }
    ],
    datos_curiosos: [
      "No hubo final oficial; el campeón se decidió en una liguilla de cuatro equipos.",
      "India se retiró supuestamente porque la FIFA no les permitió jugar descalzos."
    ],
    videos: [
      { title: "El Maracanazo", url: "https://youtu.be/FH6rFY_6Ym0?si=8K23SPXqvWcvV7yC", description: "El legendario partido donde Uruguay venció a Brasil en 1950." }
    ]
  },
  {
    año: 1954,
    sede: "Suiza",
    fechas: "16 Jun – 4 Jul",
    campeon: "Alemania Federal", campeon_bandera: "🇩🇪",
    subcampeon: "Hungría", subcampeon_bandera: "🇭🇺",
    tercero: "Austria", cuarto: "Uruguay",
    goleadores: [
      { name: "Sándor Kocsis", flag: "🇭🇺", goals: 11 },
      { name: "Max Morlock", flag: "🇩🇪", goals: 6 },
      { name: "Josef Hügi", flag: "🇨🇭", goals: 6 }
    ],
    records: [
      { cat: "Goles por partido", val: "5.38", desc: "El promedio de goles más alto en la historia de los mundiales." },
      { cat: "Partido con más goles", val: "7-5", desc: "Austria vs Suiza, el encuentro con mayor cantidad de anotaciones." }
    ],
    datos_curiosos: [
      "La final es conocida como 'El Milagro de Berna', donde Alemania venció a la invencible Hungría de Puskás.",
      "Primera Copa del Mundo televisada."
    ],
    videos: [
      { title: "El Milagro de Berna", url: "https://youtu.be/YTwwOmLmGm8?si=toqq8EvnxmXpX1ZW", description: "Resumen de la increíble final de 1954." }
    ]
  },
  {
    año: 1958,
    sede: "Suecia",
    fechas: "8 Jun – 29 Jun",
    campeon: "Brasil", campeon_bandera: "🇧🇷",
    subcampeon: "Suecia", subcampeon_bandera: "🇸🇪",
    tercero: "Francia", cuarto: "Alemania Federal",
    goleadores: [
      { name: "Just Fontaine", flag: "🇫🇷", goals: 13 },
      { name: "Pelé", flag: "🇧🇷", goals: 6 },
      { name: "Helmut Rahn", flag: "🇩🇪", goals: 6 }
    ],
    records: [
      { cat: "Goles en un torneo", val: "13", desc: "Récord absoluto de Just Fontaine (Francia) en una sola edición." },
      { cat: "Campeón más joven", val: "17 años", desc: "Pelé anotó en la final con solo 17 años y 249 días." }
    ],
    datos_curiosos: [
      "Debut mundialista de Edson Arantes do Nascimento, 'Pelé'.",
      "Primera vez que un equipo (Brasil) ganó el Mundial fuera de su continente."
    ],
    videos: [
      { title: "El surgimiento de Pelé", url: "https://youtu.be/jYbVf2HXKsw?si=8UNrN5d_KbnoWH4O", description: "Los mejores momentos del joven Pelé en 1958." }
    ]
  },
  {
    año: 1962,
    sede: "Chile",
    fechas: "30 May – 17 Jun",
    campeon: "Brasil", campeon_bandera: "🇧🇷",
    subcampeon: "Checoslovaquia", subcampeon_bandera: "🇨🇸",
    tercero: "Chile", cuarto: "Yugoslavia",
    goleadores: [
      { name: "Garrincha", flag: "🇧🇷", goals: 4 },
      { name: "Vavá", flag: "🇧🇷", goals: 4 },
      { name: "Leonel Sánchez", flag: "🇨🇱", goals: 4 }
    ],
    records: [
      { cat: "Bicampeonato", val: "Brasil", desc: "Brasil igualó a Italia al ganar mundiales consecutivos." }
    ],
    datos_curiosos: [
      "Pelé se lesionó en el segundo partido, pero Garrincha tomó las riendas y fue la figura del torneo.",
      "La Batalla de Santiago: El violento partido entre Chile e Italia."
    ],
    videos: [
      { title: "La Magia de Garrincha", url: "https://youtu.be/cHu5yoOsQlU?si=_diaYtIpfZklrX4b", description: "Garrincha guía a Brasil al bicampeonato." }
    ]
  },
  {
    año: 1966,
    sede: "Inglaterra",
    fechas: "11 Jul – 30 Jul",
    campeon: "Inglaterra", campeon_bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    subcampeon: "Alemania Federal", subcampeon_bandera: "🇩🇪",
    tercero: "Portugal", cuarto: "Unión Soviética",
    goleadores: [
      { name: "Eusébio", flag: "🇵🇹", goals: 9 },
      { name: "Helmut Haller", flag: "🇩🇪", goals: 6 },
      { name: "Geoff Hurst", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", goals: 4 }
    ],
    records: [
      { cat: "Hat-trick en Final", val: "x3", desc: "Geoff Hurst es el primer jugador en marcar 3 goles en una final." }
    ],
    datos_curiosos: [
      "El trofeo Jules Rimet fue robado antes del torneo y encontrado por un perro llamado Pickles.",
      "El polémico 'Gol fantasma' de Geoff Hurst en la final."
    ],
    videos: [
      { title: "Inglaterra vs Alemania Occidental 1966", url: "https://youtu.be/C0aK2IgORGA?si=pkNTx7UsAHPXphks", description: "La polémica final en Wembley." }
    ]
  },
  {
    año: 1970,
    sede: "México",
    fechas: "31 May – 21 Jun",
    campeon: "Brasil", campeon_bandera: "🇧🇷",
    subcampeon: "Italia", subcampeon_bandera: "🇮🇹",
    tercero: "Alemania Federal", cuarto: "Uruguay",
    goleadores: [
      { name: "Gerd Müller", flag: "🇩🇪", goals: 10 },
      { name: "Jairzinho", flag: "🇧🇷", goals: 7 },
      { name: "Teófilo Cubillas", flag: "🇵🇪", goals: 5 }
    ],
    records: [
      { cat: "Tres Títulos", val: "Pelé", desc: "Pelé se convierte en el único jugador en ganar 3 Mundiales." },
      { cat: "Trofeo en propiedad", val: "Jules Rimet", desc: "Brasil se quedó con el trofeo Jules Rimet por ganarlo tres veces." }
    ],
    datos_curiosos: [
      "Primer Mundial transmitido a color y el primero en introducir las tarjetas amarilla y roja.",
      "Jairzinho anotó en todos los partidos de Brasil en el torneo."
    ],
    videos: [
      { title: "Brasil de 1970", url: "https://youtu.be/0lo6aW0EYM0?si=F3AZrI-WhVKdzGcF", description: "El mejor equipo de la historia en color." }
    ]
  },
  {
    año: 1974,
    sede: "Alemania Federal",
    fechas: "13 Jun – 7 Jul",
    campeon: "Alemania Federal", campeon_bandera: "🇩🇪",
    subcampeon: "Países Bajos", subcampeon_bandera: "🇳🇱",
    tercero: "Polonia", cuarto: "Brasil",
    goleadores: [
      { name: "Grzegorz Lato", flag: "🇵🇱", goals: 7 },
      { name: "Andrzej Szarmach", flag: "🇵🇱", goals: 5 },
      { name: "Johan Neeskens", flag: "🇳🇱", goals: 5 }
    ],
    records: [
      { cat: "Nuevo Trofeo", val: "1974", desc: "Primera edición en entregar el actual trofeo de la Copa Mundial de la FIFA." }
    ],
    datos_curiosos: [
      "Aparición del 'Fútbol Total' por parte de la Naranja Mecánica de Johan Cruyff.",
      "Países Bajos marcó a los 2 minutos de la final sin que Alemania tocara el balón antes del penal."
    ],
    videos: [
      { title: "El Fútbol Total de 1974", url: "https://youtu.be/7ySk4KZHEnY?si=adQUQHn0fZpfIJDk", description: "Cruyff y la Naranja Mecánica." }
    ]
  },
  {
    año: 1978,
    sede: "Argentina",
    fechas: "1 Jun – 25 Jun",
    campeon: "Argentina", campeon_bandera: "🇦🇷",
    subcampeon: "Países Bajos", subcampeon_bandera: "🇳🇱",
    tercero: "Brasil", cuarto: "Italia",
    goleadores: [
      { name: "Mario Kempes", flag: "🇦🇷", goals: 6 },
      { name: "Teófilo Cubillas", flag: "🇵🇪", goals: 5 },
      { name: "Rob Rensenbrink", flag: "🇳🇱", goals: 5 }
    ],
    records: [
      { cat: "Primer Título", val: "🇦🇷", desc: "Argentina gana su primera Copa del Mundo siendo local." }
    ],
    datos_curiosos: [
      "Cruyff no participó en el torneo tras un intento de secuestro meses antes.",
      "El polémico 6-0 de Argentina a Perú que le dio el pase a la final."
    ],
    videos: [
      { title: "Argentina Campeón 1978", url: "https://youtu.be/7aZ7GV8T2mk?si=tnNjWvzoQklyoQml", description: "Los goles de Kempes en la final." }
    ]
  },
  {
    año: 1982,
    sede: "España",
    fechas: "13 Jun – 11 Jul",
    campeon: "Italia", campeon_bandera: "🇮🇹",
    subcampeon: "Alemania Federal", subcampeon_bandera: "🇩🇪",
    tercero: "Polonia", cuarto: "Francia",
    goleadores: [
      { name: "Paolo Rossi", flag: "🇮🇹", goals: 6 },
      { name: "Karl-Heinz Rummenigge", flag: "🇩🇪", goals: 5 },
      { name: "Zico", flag: "🇧🇷", goals: 4 }
    ],
    records: [
      { cat: "Goleada récord", val: "10-1", desc: "Hungría goleó a El Salvador, la mayor diferencia en la historia." }
    ],
    datos_curiosos: [
      "El 'Pacto de El Molinón' entre Alemania y Austria perjudicó a Argelia, forzando a la FIFA a jugar la última fecha simultáneamente desde entonces.",
      "La primera vez que se utilizó la tanda de penales (Alemania vs Francia)."
    ],
    videos: [
      { title: "El Renacer de Paolo Rossi", url: "https://youtu.be/4Br3lHOrMCs?si=8WgEXCEpTbkqbE7x", description: "Los goles de Rossi que le dieron el título a Italia." }
    ]
  },
  {
    año: 1986,
    sede: "México",
    fechas: "31 May – 29 Jun",
    campeon: "Argentina", campeon_bandera: "🇦🇷",
    subcampeon: "Alemania Federal", subcampeon_bandera: "🇩🇪",
    tercero: "Francia", cuarto: "Bélgica",
    goleadores: [
      { name: "Gary Lineker", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", goals: 6 },
      { name: "Diego Maradona", flag: "🇦🇷", goals: 5 },
      { name: "Careca", flag: "🇧🇷", goals: 5 },
      { name: "Emilio Butragueño", flag: "🇪🇸", goals: 5 }
    ],
    records: [
      { cat: "Gol del Siglo", val: "11 Jun", desc: "Diego Maradona anotó el mejor gol de la historia de los Mundiales ante Inglaterra." }
    ],
    datos_curiosos: [
      "México fue el primer país en organizar el Mundial dos veces tras la renuncia de Colombia.",
      "La Mano de Dios: Maradona anotó con la mano frente a los ingleses."
    ],
    videos: [
      { title: "El Gol del Siglo", url: "https://youtu.be/ZN3jcfJSJMY?si=yzS2voH_kHbp8nn5", description: "Maradona contra todos los ingleses." }
    ]
  },
  {
    año: 1990,
    sede: "Italia",
    fechas: "8 Jun – 8 Jul",
    campeon: "Alemania Federal", campeon_bandera: "🇩🇪",
    subcampeon: "Argentina", subcampeon_bandera: "🇦🇷",
    tercero: "Italia", cuarto: "Inglaterra",
    goleadores: [
      { name: "Salvatore Schillaci", flag: "🇮🇹", goals: 6 },
      { name: "Tomáš Skuhravý", flag: "🇨🇸", goals: 5 },
      { name: "Roger Milla", flag: "🇨🇲", goals: 4 },
      { name: "Gary Lineker", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", goals: 4 }
    ],
    records: [
      { cat: "Menos Goles", val: "2.21", desc: "El promedio de goles más bajo de la historia (2.21 por partido)." }
    ],
    datos_curiosos: [
      "Primer mundial con repetición en la final (Alemania y Argentina también jugaron la final en 1986).",
      "Camerún, guiado por Roger Milla (38 años), se convirtió en el primer africano en cuartos."
    ],
    videos: [
      { title: "Alemania 1990", url: "https://youtu.be/Jh3IpG5GuzI?si=uQTUWN6gjB4_SbVu", description: "Alemania se consagra tricampeón en Italia." }
    ]
  },
  {
    año: 1994,
    sede: "Estados Unidos",
    fechas: "17 Jun – 17 Jul",
    campeon: "Brasil", campeon_bandera: "🇧🇷",
    subcampeon: "Italia", subcampeon_bandera: "🇮🇹",
    tercero: "Suecia", cuarto: "Bulgaria",
    goleadores: [
      { name: "Hristo Stoichkov", flag: "🇧🇬", goals: 6 },
      { name: "Oleg Salenko", flag: "🇷🇺", goals: 6 },
      { name: "Romário", flag: "🇧🇷", goals: 5 }
    ],
    records: [
      { cat: "Asistencia Histórica", val: "3,587,538", desc: "Récord histórico de asistencia total de público a los estadios." },
      { cat: "5 Goles", val: "Salenko", desc: "Oleg Salenko anotó 5 goles en un solo partido vs Camerún." }
    ],
    datos_curiosos: [
      "Primera final que terminó 0-0 y se definió por penales. Baggio falló el penal decisivo.",
      "Diego Maradona dio positivo en un control antidopaje ('Me cortaron las piernas').",
      "Asesinato del jugador colombiano Andrés Escobar por marcar un autogol."
    ],
    videos: [
      { title: "Penales de la Final 1994", url: "https://youtu.be/8pdHAGjKt2w?si=sFz-5fPoOLjzOgUj", description: "Baggio falla y Brasil es tetracampeón." }
    ]
  },
  {
    año: 1998,
    sede: "Francia",
    fechas: "10 Jun – 12 Jul",
    campeon: "Francia", campeon_bandera: "🇫🇷",
    subcampeon: "Brasil", subcampeon_bandera: "🇧🇷",
    tercero: "Croacia", cuarto: "Países Bajos",
    goleadores: [
      { name: "Davor Šuker", flag: "🇭🇷", goals: 6 },
      { name: "Gabriel Batistuta", flag: "🇦🇷", goals: 5 },
      { name: "Christian Vieri", flag: "🇮🇹", goals: 5 }
    ],
    records: [
      { cat: "32 Equipos", val: "1998", desc: "Primera edición en tener 32 selecciones participantes." }
    ],
    datos_curiosos: [
      "Francia ganó su primer mundial comandada por Zinedine Zidane.",
      "Ronaldo sufrió convulsiones horas antes de la final."
    ],
    videos: [
      { title: "Zidane en la Final de 1998", url: "https://youtu.be/ZREZNjhSwJU?si=x2wwP_5OVdMxYh9q", description: "Los dos cabezazos de Zidane contra Brasil." }
    ]
  },
  {
    año: 2002,
    sede: "Corea del Sur / Japón",
    fechas: "31 May – 30 Jun",
    campeon: "Brasil", campeon_bandera: "🇧🇷",
    subcampeon: "Alemania", subcampeon_bandera: "🇩🇪",
    tercero: "Turquía", cuarto: "Corea del Sur",
    goleadores: [
      { name: "Ronaldo", flag: "🇧🇷", goals: 8 },
      { name: "Miroslav Klose", flag: "🇩🇪", goals: 5 },
      { name: "Rivaldo", flag: "🇧🇷", goals: 5 }
    ],
    records: [
      { cat: "Pentacampeón", val: "🇧🇷", desc: "Brasil consiguió su quinto título, siendo la selección más ganadora." }
    ],
    datos_curiosos: [
      "Primer mundial en realizarse en Asia y el primero organizado por dos países.",
      "Sorpresivo éxito de Corea del Sur llegando a semifinales en medio de polémicas arbitrales."
    ],
    videos: [
      { title: "Ronaldo en 2002", url: "https://youtu.be/B0YLm9oC8nw?si=l8m2yMlWAwPmki-a", description: "Los 8 goles de Ronaldo 'El Fenómeno'." }
    ]
  },
{
  año: 2006,
  sede: "Alemania",
  fechas: "9 Jun – 9 Jul",
  campeon: "Italia", campeon_bandera: "🇮🇹",
  subcampeon: "Francia", subcampeon_bandera: "🇫🇷",
  tercero: "Alemania", cuarto: "Portugal",
  goleadores: [
    { name: "Miroslav Klose", flag: "🇩🇪", goals: 5 },
    { name: "Hernán Crespo", flag: "🇦🇷", goals: 3 },
    { name: "Ronaldo", flag: "🇧🇷", goals: 3 },
    { name: "Zinedine Zidane", flag: "🇫🇷", goals: 3 }
  ],
  records: [
    { cat: "Cuarto Título", val: "🇮🇹", desc: "Italia ganó su cuarta Copa del Mundo igualando a Alemania." },
    { cat: "Máximo Goleador Histórico", val: "15 goles", desc: "Ronaldo superó a Gerd Müller como máximo goleador histórico (luego superado en 2014)." }
  ],
  datos_curiosos: [
    "La final terminó 1-1 y se definió por penales (Italia 5-3 Francia).",
    "Zidane fue expulsado en la final por un cabezazo a Materazzi.",
    "Fue el último Mundial de Zidane, que aun así ganó el Balón de Oro del torneo.",
    "Alemania, como anfitrión, logró el tercer puesto con gran rendimiento ofensivo."
  ],
  videos: [
    { title: "Final Italia vs Francia 2006", url: "https://youtu.be/a7O9cd-QMBg?si=Rwc2RvXktzOXBxot", description: "Resumen de la final y definición por penales." }
  ]
},
  {
    año: 2010,
    sede: "Sudáfrica",
    fechas: "11 Jun – 11 Jul",
    campeon: "España", campeon_bandera: "🇪🇸",
    subcampeon: "Países Bajos", subcampeon_bandera: "🇳🇱",
    tercero: "Alemania", cuarto: "Uruguay",
    goleadores: [
      { name: "Thomas Müller", flag: "🇩🇪", goals: 5 },
      { name: "David Villa", flag: "🇪🇸", goals: 5 },
      { name: "Wesley Sneijder", flag: "🇳🇱", goals: 5 },
      { name: "Diego Forlán", flag: "🇺🇾", goals: 5 }
    ],
    records: [
      { cat: "Primer Título", val: "🇪🇸", desc: "España gana su primer mundial gracias al 'Tiki-Taka'." },
      { cat: "Primer Mundial en África", val: "2010", desc: "Por primera vez se celebra en el continente africano." }
    ],
    datos_curiosos: [
      "El sonido incesante de las Vuvuzelas marcó el torneo.",
      "El Pulpo Paul se hizo famoso al predecir correctamente 8 partidos."
    ],
    videos: [
      { title: "El gol de Iniesta", url: "https://youtu.be/6-EqlQMPmDI?si=55qbiaP4MvB2zQil", description: "El histórico gol que le dio el mundial a España." }
    ]
  },
  {
    año: 2014,
    sede: "Brasil",
    fechas: "12 Jun – 13 Jul",
    campeon: "Alemania", campeon_bandera: "🇩🇪",
    subcampeon: "Argentina", subcampeon_bandera: "🇦🇷",
    tercero: "Países Bajos", cuarto: "Brasil",
    goleadores: [
      { name: "James Rodríguez", flag: "🇨🇴", goals: 6 },
      { name: "Thomas Müller", flag: "🇩🇪", goals: 5 },
      { name: "Neymar", flag: "🇧🇷", goals: 4 },
      { name: "Lionel Messi", flag: "🇦🇷", goals: 4 }
    ],
    records: [
      { cat: "Máximo Goleador Histórico", val: "16 goles", desc: "Miroslav Klose superó a Ronaldo con 16 goles en mundiales." }
    ],
    datos_curiosos: [
      "El Mineirazo: Alemania derrotó 7-1 a Brasil en semifinales, la peor derrota de la historia brasileña.",
      "Alemania fue la primera selección europea en ganar un mundial en América."
    ],
    videos: [
      { title: "El Mineirazo 7-1", url: "https://youtu.be/n2yqljP8J6s?si=ndJ7R3tcUHRtMREB", description: "Resumen de la histórica goleada." }
    ]
  },
  {
    año: 2018,
    sede: "Rusia",
    fechas: "14 Jun – 15 Jul",
    campeon: "Francia", campeon_bandera: "🇫🇷",
    subcampeon: "Croacia", subcampeon_bandera: "🇭🇷",
    tercero: "Bélgica", cuarto: "Inglaterra",
    goleadores: [
      { name: "Harry Kane", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", goals: 6 },
      { name: "Antoine Griezmann", flag: "🇫🇷", goals: 4 },
      { name: "Romelu Lukaku", flag: "🇧🇪", goals: 4 },
      { name: "Kylian Mbappé", flag: "🇫🇷", goals: 4 }
    ],
    records: [
      { cat: "Debut del VAR", val: "2018", desc: "Fue el primer mundial donde se usó la Asistencia al Árbitro por Video (VAR)." }
    ],
    datos_curiosos: [
      "Croacia, un país de 4 millones de habitantes, llegó a la final ganando tres partidos en prórroga o penales.",
      "Mbappé, con 19 años, se convirtió en el adolescente más joven en marcar en una final desde Pelé."
    ],
    videos: [
      { title: "Francia Campeón 2018", url: "https://youtu.be/hqFD2MXDaiU?si=nhUE5d2g7X1xDoj9", description: "Los mejores momentos de Francia en Rusia." }
    ]
  },
  {
    año: 2022,
    sede: "Qatar",
    fechas: "20 Nov – 18 Dic",
    campeon: "Argentina", campeon_bandera: "🇦🇷",
    subcampeon: "Francia", subcampeon_bandera: "🇫🇷",
    tercero: "Croacia", cuarto: "Marruecos",
    goleadores: [
      { name: "Kylian Mbappé", flag: "🇫🇷", goals: 8 },
      { name: "Lionel Messi", flag: "🇦🇷", goals: 7 },
      { name: "Julián Álvarez", flag: "🇦🇷", goals: 4 },
      { name: "Olivier Giroud", flag: "🇫🇷", goals: 4 }
    ],
    records: [
      { cat: "Mundial de Invierno", val: "Nov/Dic", desc: "El primer mundial en jugarse a finales de año debido al calor de Qatar." },
      { cat: "Marruecos Histórico", val: "Semifinales", desc: "Marruecos se convirtió en la primera selección africana en llegar a semifinales." }
    ],
    datos_curiosos: [
      "Messi consiguió su tan ansiado Mundial y fue elegido el MVP del torneo.",
      "La final Argentina vs Francia 3-3 es considerada por muchos la mejor final de la historia.",
      "Mbappé marcó un hat-trick en la final, algo que no pasaba desde 1966."
    ],
    videos: [
      { title: "La Final Más Épica: ARG vs FRA", url: "https://youtu.be/DDWYR9Oi_wI?si=ISCJxucPFWsxyMg8", description: "Resumen de la dramática final definida en penales." }
    ]
  }
];

async function seedHistoria() {
  console.log("⏳ Iniciando población de mundiales_historicos...");
  try {
    const { data, error } = await supabase
      .from('mundiales_historicos')
      .upsert(ediciones);

    if (error) {
      throw error;
    }

    console.log(`✅ ¡Éxito! Se insertaron ${ediciones.length} ediciones históricas del Mundial.`);
  } catch (err) {
    console.error("❌ Error durante el seeding:", err.message);
  }
}

seedHistoria();
