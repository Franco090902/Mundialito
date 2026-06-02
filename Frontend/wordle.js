/* ══════════════════════════════════════════
   wordle.js — Lógica del Wordle Futbolero
   Pegar en: Frontend/wordle.js
   Requiere: wordle.css cargado antes
══════════════════════════════════════════ */

/* ── Diccionario de palabras futboleras ── */
const WL_DICT = {
  3: ["GOL", "VAR", "RED", "ROL", "PIE", "IDA", "OLA"],
  4: ["ARCO", "BOCA", "PENA", "TACO", "BOCA", "ROJA", "TIRO", "PASE", "FOUL", "LIGA", "COPA", "CLUB", "JUEZ", "MANO", "META"],
  5: ["MESSI", "BALON", "FALTA", "TIROS", "FUERA", "CAMPO", "LIBRE", "BOMBA", "LINEA", "MEDIO", "BANCO", "LARGO", "GOLES", "JUEGO", "FINAL", "SAQUE", "RIVAL", "MARCA", "TOQUE"],
  6: ["FUTBOL", "CORNER", "HINCHA", "CESPED", "CANCHA", "TROFEO", "EMPATE", "GANCHO", "REBOTE", "PELOTA", "BARRER", "EQUIPO", "JUGADA", "ATAQUE", "CAMBIO", "REMATE", "TORNEO", "CENTRO", "PIFIAR"],
  7: ["ESTADIO", "MUNDIAL", "TRIBUNA", "DEFENSA", "TARJETA", "LATERAL", "PORTERO", "MINUTOS", "SANCION", "GOLEADA", "ASISTIR", "ARBITRO", "PARTIDO", "JUGADOR", "TECNICO", "VOLANTE", "PENALTI", "OFFSIDE", "DERROTA", "VENTAJA"],
  8: ["SUPLENTE", "DELANTERO", "CAPITANES", "ARBITRAJE", "MARCADOR", "DESCENSO", "DEFENSOR", "ATACANTE", "CONTRATO", "TRASPASO", "AMARILLA", "REVANCHA", "CLASICOS"].map(w => w.slice(0, 8))
};

/* ── Constantes ── */
const WL_MAX_TRIES = 6;
const WL_MAX_DAILY = 5;
const WL_STORAGE_KEY = "wf_daily_v2";

/* ── Estado del juego ── */
let wlWord = "";
let wlWordLen = 5;
let wlRow = 0;
let wlCol = 0;
let wlGameOver = false;
let wlGrid = [];    // referencias a celdas DOM
let wlKeyState = {};    // 'correct' | 'present' | 'absent' por tecla

/* ════════════════════════════════════════
   CONTROL DE LÍMITE DIARIO (localStorage)
════════════════════════════════════════ */

function wlGetToday() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function wlLoadDaily() {
  try {
    return JSON.parse(localStorage.getItem(WL_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function wlGetGamesPlayed() {
  const s = wlLoadDaily();
  return s.date === wlGetToday() ? (s.count || 0) : 0;
}

function wlAddGamePlayed() {
  const today = wlGetToday();
  const s = wlLoadDaily();
  const count = s.date === today ? (s.count || 0) + 1 : 1;
  localStorage.setItem(WL_STORAGE_KEY, JSON.stringify({ date: today, count }));
}

/* ════════════════════════════════════════
   INICIALIZACIÓN DEL JUEGO
════════════════════════════════════════ */

function wlInit() {
  const wrapper = document.getElementById("wordle-wrapper");
  if (!wrapper) return;

  wrapper.innerHTML = `
    <div class="wl-header">
      <div class="wl-title">WORDLE <span>FUTBOLERO</span></div>
      <div class="wl-subtitle">Adiviná la palabra de fútbol en ${WL_MAX_TRIES} intentos</div>
    </div>

    <div class="wl-controls">
      <label for="wl-len-sel">LETRAS:</label>
      <select id="wl-len-sel">
        <option value="3">3 letras</option>
        <option value="4">4 letras</option>
        <option value="5" selected>5 letras</option>
        <option value="6">6 letras</option>
        <option value="7">7 letras</option>
        <option value="8">8 letras</option>
      </select>
      <button class="wl-btn-new" id="wl-btn-new">⚽ NUEVA PARTIDA</button>
    </div>

    <div class="wl-counter" id="wl-counter"></div>
    <div class="wl-msg"     id="wl-msg"></div>

    <div class="wl-limit-msg" id="wl-limit-msg">
      <span class="wl-limit-icon">⏰</span>
      <strong>Límite diario alcanzado</strong>
      <p>Ya jugaste ${WL_MAX_DAILY} partidas hoy.<br>Volvé mañana para seguir jugando.</p>
    </div>

    <div class="wl-board" id="wl-board"></div>
    <div class="wl-kbd"   id="wl-kbd"></div>

    <div class="wl-legend">
      <div class="wl-legend-item"><div class="wl-legend-dot correct"></div> En posición correcta</div>
      <div class="wl-legend-item"><div class="wl-legend-dot present"></div> Está pero mal puesta</div>
      <div class="wl-legend-item"><div class="wl-legend-dot absent"></div>  No está en la palabra</div>
    </div>
  `;

  document.getElementById("wl-btn-new").addEventListener("click", wlStartGame);
  document.getElementById("wl-len-sel").addEventListener("change", wlStartGame);
  document.addEventListener("keydown", wlHandleKeyboard);

  wlStartGame();
}

/* ════════════════════════════════════════
   ARRANCAR O REINICIAR PARTIDA
════════════════════════════════════════ */

function wlStartGame() {
  wlUpdateCounter();

  if (wlCheckLimit()) return;

  wlWordLen = parseInt(document.getElementById("wl-len-sel").value);
  wlWord = wlPickWord(wlWordLen);
  wlRow = 0;
  wlCol = 0;
  wlGameOver = false;
  wlKeyState = {};

  wlBuildBoard();
  wlBuildKeyboard();
  wlSetMsg("", "");
}

function wlPickWord(len) {
  const pool = WL_DICT[len] || WL_DICT[5];
  return pool[Math.floor(Math.random() * pool.length)];
}

/* ════════════════════════════════════════
   CONTROL DE LÍMITE DIARIO
════════════════════════════════════════ */

function wlCheckLimit() {
  const played = wlGetGamesPlayed();
  const limitEl = document.getElementById("wl-limit-msg");
  const boardEl = document.getElementById("wl-board");
  const kbdEl = document.getElementById("wl-kbd");

  if (played >= WL_MAX_DAILY) {
    if (limitEl) limitEl.style.display = "block";
    if (boardEl) boardEl.style.display = "none";
    if (kbdEl) kbdEl.style.display = "none";
    wlSetMsg("", "");
    return true;
  }

  if (limitEl) limitEl.style.display = "none";
  if (boardEl) boardEl.style.display = "flex";
  if (kbdEl) kbdEl.style.display = "flex";
  return false;
}

function wlUpdateCounter() {
  const n = wlGetGamesPlayed();
  const el = document.getElementById("wl-counter");
  if (el) el.innerHTML = `Partidas hoy: <strong>${n} / ${WL_MAX_DAILY}</strong>`;
}

/* ════════════════════════════════════════
   CONSTRUCCIÓN DEL TABLERO
════════════════════════════════════════ */

function wlBuildBoard() {
  const board = document.getElementById("wl-board");
  if (!board) return;
  board.innerHTML = "";
  wlGrid = [];

  for (let r = 0; r < WL_MAX_TRIES; r++) {
    const rowEl = document.createElement("div");
    rowEl.className = "wl-row";
    const rowArr = [];

    for (let c = 0; c < wlWordLen; c++) {
      const cell = document.createElement("div");
      cell.className = "wl-cell";
      rowEl.appendChild(cell);
      rowArr.push(cell);
    }

    board.appendChild(rowEl);
    wlGrid.push(rowArr);
  }

  wlMarkCursor();
}

/* ════════════════════════════════════════
   CONSTRUCCIÓN DEL TECLADO VIRTUAL
════════════════════════════════════════ */

function wlBuildKeyboard() {
  const kbd = document.getElementById("wl-kbd");
  if (!kbd) return;
  kbd.innerHTML = "";

  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["BORRAR", "Z", "X", "C", "V", "B", "N", "M", "ENTER"]
  ];

  rows.forEach(rowKeys => {
    const rowEl = document.createElement("div");
    rowEl.className = "wl-krow";

    rowKeys.forEach(key => {
      const btn = document.createElement("button");
      btn.className = "wl-key" + (key.length > 1 ? " wide" : "");
      btn.textContent = key;
      btn.dataset.wlKey = key;
      btn.addEventListener("click", () => wlHandleKey(key));
      rowEl.appendChild(btn);
    });

    kbd.appendChild(rowEl);
  });
}

/* ════════════════════════════════════════
   MANEJO DE INPUT
════════════════════════════════════════ */

function wlHandleKeyboard(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const key = e.key.toUpperCase();

  if (key === "BACKSPACE") wlHandleKey("BORRAR");
  else if (key === "ENTER") wlHandleKey("ENTER");
  else if (/^[A-ZÁÉÍÓÚÜÑ]$/.test(key)) wlHandleKey(key);
}

function wlHandleKey(key) {
  if (wlGameOver) return;

  if (key === "BORRAR" || key === "BACKSPACE") {
    if (wlCol > 0) {
      wlCol--;
      const cell = wlGrid[wlRow][wlCol];
      cell.textContent = "";
      cell.classList.remove("pop");
    }
  } else if (key === "ENTER") {
    wlSubmitGuess();
  } else if (/^[A-ZÁÉÍÓÚÜÑ]$/.test(key) && wlCol < wlWordLen) {
    const cell = wlGrid[wlRow][wlCol];
    cell.textContent = key;
    cell.classList.remove("pop");
    void cell.offsetWidth; // reflow para reiniciar animación
    cell.classList.add("pop");
    wlCol++;
  }

  wlMarkCursor();
}

/* ════════════════════════════════════════
   EVALUAR INTENTO
════════════════════════════════════════ */

function wlSubmitGuess() {
  if (wlCol < wlWordLen) {
    wlSetMsg("Completá la palabra", "hint");
    wlShakeRow(wlRow);
    return;
  }

  const guess = wlGrid[wlRow].map(c => c.textContent).join("");
  const result = wlEvaluate(guess, wlWord);

  /* Aplicar colores con pequeño delay escalonado */
  result.forEach((state, i) => {
    setTimeout(() => {
      const cell = wlGrid[wlRow][i];
      cell.classList.remove("cursor");
      cell.classList.add(state);
    }, i * 80);
  });

  /* Actualizar estado de teclas */
  const priority = { correct: 3, present: 2, absent: 1 };
  result.forEach((state, i) => {
    const ch = guess[i];
    if (!wlKeyState[ch] || priority[state] > priority[wlKeyState[ch]]) {
      wlKeyState[ch] = state;
    }
  });

  const totalDelay = result.length * 80 + 100;

  setTimeout(() => {
    wlUpdateKeyColors();

    if (guess === wlWord) {
      wlSetMsg("⚽  ¡Gol! Adivinaste la palabra", "win");
      wlGameOver = true;
      wlAddGamePlayed();
      wlUpdateCounter();
      setTimeout(() => wlCheckLimit(), 400);
    } else if (wlRow === WL_MAX_TRIES - 1) {
      wlSetMsg(`La palabra era: ${wlWord}`, "lose");
      wlGameOver = true;
      wlAddGamePlayed();
      wlUpdateCounter();
      setTimeout(() => wlCheckLimit(), 400);
    } else {
      wlRow++;
      wlCol = 0;
      wlMarkCursor();
    }
  }, totalDelay);
}

/* Algoritmo de evaluación tipo Wordle */
function wlEvaluate(guess, target) {
  const result = Array(guess.length).fill("absent");
  const pool = target.split("");

  /* Primero: exactos */
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === pool[i]) {
      result[i] = "correct";
      pool[i] = null;
    }
  }

  /* Segundo: presentes en otra posición */
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct") continue;
    const idx = pool.indexOf(guess[i]);
    if (idx !== -1) {
      result[i] = "present";
      pool[idx] = null;
    }
  }

  return result;
}

/* ════════════════════════════════════════
   HELPERS DE UI
════════════════════════════════════════ */

function wlMarkCursor() {
  if (wlGameOver || wlRow >= WL_MAX_TRIES) return;
  /* Limpiar cursor anterior en la fila actual */
  wlGrid[wlRow]?.forEach(cell => cell.classList.remove("cursor"));
  /* Poner cursor en la celda actual (si no superamos el largo) */
  if (wlCol < wlWordLen) {
    wlGrid[wlRow][wlCol].classList.add("cursor");
  }
}

function wlShakeRow(rowIdx) {
  const rowEl = wlGrid[rowIdx]?.[0]?.parentElement;
  if (!rowEl) return;
  rowEl.classList.remove("shake");
  void rowEl.offsetWidth;
  rowEl.classList.add("shake");
  rowEl.addEventListener("animationend", () => rowEl.classList.remove("shake"), { once: true });
}

function wlSetMsg(text, cls = "") {
  const el = document.getElementById("wl-msg");
  if (!el) return;
  el.textContent = text;
  el.className = "wl-msg" + (cls ? ` ${cls}` : "");
}

function wlUpdateKeyColors() {
  document.querySelectorAll(".wl-key[data-wl-key]").forEach(btn => {
    const key = btn.dataset.wlKey;
    const state = wlKeyState[key];
    if (state) {
      btn.className = "wl-key" + (key.length > 1 ? " wide" : "") + " " + state;
    }
  });
}

/* ════════════════════════════════════════
   PUNTO DE ENTRADA PÚBLICO
   Llamar desde el HTML:  wlInit()
   O desde app.js cuando se activa el tab
════════════════════════════════════════ */
window.wlInit = wlInit;
