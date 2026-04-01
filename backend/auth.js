// ══════════════════════════════════════════════════════════════════
// auth.js — Módulo de Autenticación
// Vanilla JS puro. Sin frameworks.
// Stack: Supabase JS SDK cargado desde CDN como módulo ESM.
//
// CÓMO INCLUIR EN index.html:
//   <script type="module" src="js/auth.js"></script>
//
// SUPABASE URL: https://iplsamlkpkuzurthdzdh.supabase.co
// ══════════════════════════════════════════════════════════════════

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ──────────────────────────────────────────────────────────────────
// CONFIGURACIÓN
// La ANON KEY es segura para el frontend. Las RLS hacen el resto.
// NUNCA pongas la Service Role Key aquí.
// ──────────────────────────────────────────────────────────────────
const SUPABASE_URL  = 'https://iplsamlkpkuzurthdzdh.supabase.co';
const SUPABASE_ANON = 'TU_ANON_KEY_AQUI'; // Supabase Dashboard → Settings → API → anon public

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    // Supabase guarda la sesión en localStorage automáticamente.
    // No necesitás manejar el token a mano.
    persistSession:    true,
    autoRefreshToken:  true,
    detectSessionInUrl: true, // Necesario para el callback de Google OAuth
  },
});


// ──────────────────────────────────────────────────────────────────
// ESTADO GLOBAL DEL USUARIO (módulo singleton)
// Importalo desde cualquier otro archivo:
//   import { currentUser } from './auth.js';
// ──────────────────────────────────────────────────────────────────
export let currentUser    = null; // Objeto del usuario de auth.users
export let currentProfile = null; // Objeto de la tabla profiles (username, avatar, puntos)


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN 1: Registrar con Email y Password
// ══════════════════════════════════════════════════════════════════
/**
 * Registra un nuevo usuario.
 * El trigger `handle_new_user` de la BD crea el perfil automáticamente.
 * @param {string} email
 * @param {string} password
 * @param {string} username — Se pasa como metadata para el trigger
 * @returns {{ user, error }}
 */
export async function registrarse(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Este objeto llega al trigger como NEW.raw_user_meta_data
      data: { username },
    },
  });

  if (error) {
    console.error('Error al registrarse:', error.message);
    return { user: null, error };
  }

  // Supabase envía un email de confirmación.
  // El usuario no puede logearse hasta confirmar (configurable en Auth settings).
  return { user: data.user, error: null };
}


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN 2: Iniciar sesión con Email y Password
// ══════════════════════════════════════════════════════════════════
/**
 * @param {string} email
 * @param {string} password
 * @returns {{ session, error }}
 */
export async function iniciarSesionEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Error al iniciar sesión:', error.message);
    return { session: null, error };
  }

  return { session: data.session, error: null };
}


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN 3: Iniciar sesión con Google OAuth
// ══════════════════════════════════════════════════════════════════
/**
 * Redirige al usuario a Google para autenticar.
 * Supabase maneja el callback automáticamente y redirige de vuelta.
 * El trigger crea el perfil con el avatar de Google.
 *
 * CONFIGURACIÓN PREVIA EN SUPABASE:
 *   1. Supabase Dashboard → Authentication → Providers → Google → Enable
 *   2. Crear credenciales en Google Cloud Console (OAuth 2.0)
 *   3. Agregar como Redirect URI: https://iplsamlkpkuzurthdzdh.supabase.co/auth/v1/callback
 */
export async function iniciarSesionGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Redirigir a la app después del login
      redirectTo: window.location.origin,
      // Pedir solo los scopes necesarios
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) console.error('Error con Google OAuth:', error.message);
}


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN 4: Cerrar sesión
// ══════════════════════════════════════════════════════════════════
export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Error al cerrar sesión:', error.message);
  // onAuthStateChange se encarga de limpiar la UI automáticamente
}


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN 5: Obtener el perfil completo del usuario
// ══════════════════════════════════════════════════════════════════
/**
 * Carga la fila de `profiles` para el usuario dado.
 * Guarda en currentProfile para no repetir la consulta.
 * @param {string} userId
 */
async function cargarPerfil(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error cargando perfil:', error.message);
    return null;
  }

  currentProfile = data;
  return data;
}


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN 6: Actualizar perfil (username, avatar_url)
// ══════════════════════════════════════════════════════════════════
export async function actualizarPerfil({ username, avatar_url }) {
  if (!currentUser) return { error: 'No hay sesión activa' };

  const { data, error } = await supabase
    .from('profiles')
    .update({ username, avatar_url, updated_at: new Date().toISOString() })
    .eq('id', currentUser.id)
    .select()
    .single();

  if (!error) currentProfile = data;
  return { data, error };
}


// ══════════════════════════════════════════════════════════════════
// FUNCIÓN 7: Subir avatar del usuario a Supabase Storage
// ══════════════════════════════════════════════════════════════════
/**
 * @param {File} file — El archivo de imagen del input
 * @returns {string|null} URL pública del avatar
 *
 * CONFIGURACIÓN PREVIA:
 *   Supabase Dashboard → Storage → Create bucket "avatars" → Public
 */
export async function subirAvatar(file) {
  if (!currentUser) return null;

  const extension = file.name.split('.').pop();
  const fileName  = `${currentUser.id}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true }); // upsert: reemplaza si ya existe

  if (uploadError) {
    console.error('Error subiendo avatar:', uploadError.message);
    return null;
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
  return data.publicUrl;
}


// ══════════════════════════════════════════════════════════════════
// EL NÚCLEO: onAuthStateChange
// Este listener es el "cerebro" de la autenticación en el frontend.
// Se ejecuta automáticamente cuando:
//   - La página carga y hay una sesión guardada en localStorage
//   - El usuario se loguea
//   - El usuario cierra sesión
//   - El token se refresca automáticamente
// ══════════════════════════════════════════════════════════════════
supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('🔐 Auth event:', event);

  if (session?.user) {
    // ── HAY SESIÓN ACTIVA ─────────────────────────────────────────
    currentUser = session.user;
    await cargarPerfil(session.user.id);
    actualizarUILogueado(currentProfile);

  } else {
    // ── NO HAY SESIÓN ─────────────────────────────────────────────
    currentUser    = null;
    currentProfile = null;
    actualizarUIDeslogueado();
  }
});


// ══════════════════════════════════════════════════════════════════
// FUNCIONES DE UI
// Estas funciones modifican el DOM según el estado de auth.
// Adaptarlas a los IDs/clases de tu HTML.
// ══════════════════════════════════════════════════════════════════

/**
 * Actualiza la interfaz cuando el usuario ESTÁ logueado.
 * @param {object} profile — Fila de la tabla profiles
 */
function actualizarUILogueado(profile) {
  // ── Ocultar elementos de "invitado" ──────────────────────────────
  document.querySelectorAll('[data-auth="guest"]').forEach(el => {
    el.style.display = 'none';
  });

  // ── Mostrar elementos de "usuario logueado" ───────────────────────
  document.querySelectorAll('[data-auth="user"]').forEach(el => {
    el.style.display = '';
  });

  // ── Actualizar avatar ────────────────────────────────────────────
  const avatarImg = document.getElementById('user-avatar');
  if (avatarImg && profile?.avatar_url) {
    avatarImg.src = profile.avatar_url;
    avatarImg.alt = profile.username;
  }

  // ── Actualizar nombre de usuario ─────────────────────────────────
  const usernameEl = document.getElementById('user-username');
  if (usernameEl && profile?.username) {
    usernameEl.textContent = profile.username;
  }

  // ── Actualizar puntos del prode ───────────────────────────────────
  const puntosEl = document.getElementById('user-puntos-prode');
  if (puntosEl && profile) {
    puntosEl.textContent = profile.puntos_prode;
  }

  // ── Habilitar inputs de chat y formularios de prode ──────────────
  document.querySelectorAll('[data-requires-auth]').forEach(el => {
    el.disabled    = false;
    el.placeholder = el.dataset.placeholder || el.placeholder;
  });

  // ── Cerrar el modal de login si estaba abierto ───────────────────
  const modalAuth = document.getElementById('modal-auth');
  if (modalAuth) modalAuth.classList.remove('active');
}

/**
 * Actualiza la interfaz cuando el usuario NO está logueado.
 */
function actualizarUIDeslogueado() {
  // ── Mostrar elementos de "invitado" ─────────────────────────────
  document.querySelectorAll('[data-auth="guest"]').forEach(el => {
    el.style.display = '';
  });

  // ── Ocultar elementos de "usuario logueado" ──────────────────────
  document.querySelectorAll('[data-auth="user"]').forEach(el => {
    el.style.display = 'none';
  });

  // ── Deshabilitar inputs de chat y prode ──────────────────────────
  document.querySelectorAll('[data-requires-auth]').forEach(el => {
    el.disabled    = true;
    el.placeholder = 'Iniciá sesión para participar';
  });
}


// ══════════════════════════════════════════════════════════════════
// BIND DE EVENTOS DEL FORMULARIO DE AUTH
// Conectar con los elementos HTML del modal de login/registro.
//
// HTML esperado (simplificado):
//   <div id="modal-auth">
//     <!-- Tabs: login / register -->
//     <button id="tab-login">Ingresar</button>
//     <button id="tab-register">Registrarse</button>
//
//     <!-- Formulario Login -->
//     <div id="form-login">
//       <input id="login-email" type="email">
//       <input id="login-password" type="password">
//       <button id="btn-login-email">Ingresar</button>
//       <button id="btn-login-google">Continuar con Google</button>
//     </div>
//
//     <!-- Formulario Registro -->
//     <div id="form-register">
//       <input id="reg-username" type="text">
//       <input id="reg-email" type="email">
//       <input id="reg-password" type="password">
//       <button id="btn-register">Crear cuenta</button>
//     </div>
//   </div>
//
//   <button id="btn-logout">Cerrar sesión</button>
// ══════════════════════════════════════════════════════════════════
function initAuthEvents() {

  // ── Login con Email ──────────────────────────────────────────────
  document.getElementById('btn-login-email')?.addEventListener('click', async () => {
    const email    = document.getElementById('login-email')?.value?.trim();
    const password = document.getElementById('login-password')?.value;
    const btnEl    = document.getElementById('btn-login-email');

    if (!email || !password) return mostrarError('Completá todos los campos.');

    btnEl.disabled    = true;
    btnEl.textContent = 'Ingresando...';

    const { error } = await iniciarSesionEmail(email, password);

    if (error) {
      mostrarError(traducirErrorAuth(error.message));
      btnEl.disabled    = false;
      btnEl.textContent = 'Ingresar';
    }
    // Si no hay error, onAuthStateChange maneja todo lo demás
  });

  // ── Login con Google ─────────────────────────────────────────────
  document.getElementById('btn-login-google')?.addEventListener('click', () => {
    iniciarSesionGoogle();
    // La página se redirige, no hay nada más que hacer aquí
  });

  // ── Registro con Email ───────────────────────────────────────────
  document.getElementById('btn-register')?.addEventListener('click', async () => {
    const username = document.getElementById('reg-username')?.value?.trim();
    const email    = document.getElementById('reg-email')?.value?.trim();
    const password = document.getElementById('reg-password')?.value;
    const btnEl    = document.getElementById('btn-register');

    if (!username || !email || !password) return mostrarError('Completá todos los campos.');
    if (password.length < 6) return mostrarError('La contraseña debe tener al menos 6 caracteres.');

    btnEl.disabled    = true;
    btnEl.textContent = 'Creando cuenta...';

    const { error } = await registrarse(email, password, username);

    if (error) {
      mostrarError(traducirErrorAuth(error.message));
      btnEl.disabled    = false;
      btnEl.textContent = 'Crear cuenta';
    } else {
      mostrarMensaje('¡Cuenta creada! Revisá tu email para confirmar.', 'success');
    }
  });

  // ── Cerrar sesión ────────────────────────────────────────────────
  document.getElementById('btn-logout')?.addEventListener('click', cerrarSesion);

  // ── Abrir modal de auth desde otros elementos ────────────────────
  // Cualquier elemento con data-open-auth="true" abre el modal de login
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-open-auth]')) {
      document.getElementById('modal-auth')?.classList.add('active');
    }
  });

  // ── Cerrar modal con click fuera o en la X ───────────────────────
  document.getElementById('modal-auth')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-auth' || e.target.closest('[data-close-modal]')) {
      document.getElementById('modal-auth')?.classList.remove('active');
    }
  });

  // ── Tabs del modal: login / register ────────────────────────────
  document.getElementById('tab-login')?.addEventListener('click', () => {
    document.getElementById('form-login')?.classList.add('active');
    document.getElementById('form-register')?.classList.remove('active');
    document.getElementById('tab-login')?.classList.add('active');
    document.getElementById('tab-register')?.classList.remove('active');
  });

  document.getElementById('tab-register')?.addEventListener('click', () => {
    document.getElementById('form-register')?.classList.add('active');
    document.getElementById('form-login')?.classList.remove('active');
    document.getElementById('tab-register')?.classList.add('active');
    document.getElementById('tab-login')?.classList.remove('active');
  });
}


// ──────────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────────

/**
 * Traduce los errores en inglés de Supabase a mensajes en español.
 * @param {string} errorMsg — Mensaje original de Supabase
 */
function traducirErrorAuth(errorMsg) {
  const traducciones = {
    'Invalid login credentials':      'Email o contraseña incorrectos.',
    'Email not confirmed':            'Confirmá tu email antes de ingresar.',
    'User already registered':        'Ya existe una cuenta con ese email.',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
    'Unable to validate email address': 'El email no es válido.',
    'Email rate limit exceeded':      'Demasiados intentos. Esperá unos minutos.',
  };
  return traducciones[errorMsg] || `Error: ${errorMsg}`;
}

/**
 * Muestra un mensaje de error en el formulario de auth.
 * Busca el elemento #auth-error-msg en el DOM.
 */
function mostrarError(mensaje) {
  const el = document.getElementById('auth-error-msg');
  if (!el) { alert(mensaje); return; }
  el.textContent = mensaje;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}

function mostrarMensaje(mensaje, tipo = 'info') {
  const el = document.getElementById('auth-success-msg');
  if (!el) { alert(mensaje); return; }
  el.textContent = mensaje;
  el.className   = `auth-msg auth-msg--${tipo}`;
  el.style.display = 'block';
}


// ──────────────────────────────────────────────────────────────────
// INICIALIZACIÓN
// Se ejecuta cuando el DOM está listo.
// ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initAuthEvents();
  // onAuthStateChange ya se disparará automáticamente si hay sesión en localStorage.
  // No necesitás llamar a nada más.
});
