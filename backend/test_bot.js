require('dotenv').config();

const SYSTEM_PROMPT = `
Sos "Mundialito Bot", el asistente oficial de la web Mundialito 2026.
Tu especialidad es el fútbol, especialmente el Mundial FIFA 2026.

INFORMACIÓN CLAVE DEL MUNDIAL 2026:
- Sede: Estados Unidos, México y Canadá (primer Mundial en 3 países)
- Fechas: 11 de junio al 19 de julio de 2026
- Equipos: 48 selecciones (primer Mundial con ese formato)

REGLAS DE COMPORTAMIENTO:
1. SIEMPRE respondé en español rioplatense (usás "vos", "che", etc.)
2. Respondé preguntas de fútbol con precisión y entusiasmo
3. Sé conciso: máximo 3-4 párrafos por respuesta
4. CUANDO RECOMIENDES PRODUCTOS: - Usá SIEMPRE los productos reales que te pasamos en el contexto. - Mencioná el nombre exacto y el precio real.
5. LÍMITES: Solo respondés sobre fútbol. Si te preguntan sobre otro tema, decís amablemente que sos un especialista en fútbol y redirigís la conversación.
`;

async function llamarGemini(mensajeNuevo) {
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const contents = [
    {
      role: "user",
      parts: [{ text: `INSTRUCCIONES DE SISTEMA:\n${SYSTEM_PROMPT}` }]
    },
    {
      role: "model",
      parts: [{ text: "Entendido. Soy Mundialito Bot, listo para responder preguntas sobre el Mundial 2026. ¡Dale, preguntame lo que quieras!" }]
    },
    {
      role: "user",
      parts: [{ text: mensajeNuevo }]
    }
  ];

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: { temperature: 0.8, maxOutputTokens: 4000 }
    })
  });

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);
}

async function test() {
  const contextoWeb = `Cuándo juega Argentina vs Austria, por el Mundial 2026
El encuentro entre la "Albiceleste" y el combinado austríaco está programado para el lunes 22 de junio de 2026. Según el cronograma oficial que

Argentina vs. Austria, por el Mundial 2026: día, horario y ...
Cuándo y a qué hora juegan Argentina vs. Austria en el Mundial 2026 · Fecha: 22 de junio. · Horario: 14.00 (hora de Argentina). · Estadio: Dallas`;
  const mensaje = "cuando juega argentina con austria?";
  
  const textoContextoWeb = `\nINFORMACIÓN RECIENTE DE INTERNET:\n${contextoWeb}\nUtiliza esta información para responder la pregunta del usuario si es necesario.\n`;
  const contextoProductos = "PRODUCTOS DISPONIBLES EN NUESTRA TIENDA...\n";
  const mensajeConContexto = `${contextoProductos}${textoContextoWeb}\n\nPREGUNTA DEL USUARIO:\n${mensaje}`;
  
  console.log("Mensaje enviado a Gemini:\n", mensajeConContexto);
  
  const res = await llamarGemini(mensajeConContexto);
  console.log("\nRespuesta de Gemini:\n", res);
}

test();
