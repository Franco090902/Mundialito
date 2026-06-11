// ══════════════════════════════════════════════════════════════════
// navigation.js — Navegación SPA (Single Page Application)
//
// Propósito:
//   Controla qué "sección" (panel) se muestra en pantalla sin
//   recargar la página. Funciona como un router SPA mínimo.
//
// Cómo usarlo en el HTML:
//   <!-- Botones de navegación: data-target debe coincidir con el id
//        de la sección que se quiere mostrar -->
//   <button class="spa-nav-btn" data-target="panel-live">En Vivo</button>
//   <button class="spa-nav-btn" data-target="panel-groups">Grupos</button>
//
//   <!-- Secciones: cada una tiene un id único -->
//   <section class="spa-section" id="panel-live">...</section>
//   <section class="spa-section" id="panel-groups">...</section>
//
// Llamar en el script principal:
//   import { initSPANavigation } from './navigation.js';
//   initSPANavigation();
// ══════════════════════════════════════════════════════════════════

/**
 * Inicializa el sistema de navegación SPA.
 * Busca todos los botones con clase `.spa-nav-btn` y las secciones
 * con clase `.spa-section`, y conecta los clicks para mostrar/ocultar
 * el panel correspondiente.
 */
export function initSPANavigation() {
  // Seleccionar todos los botones de navegación y las secciones de contenido
  const navButtons = document.querySelectorAll('.spa-nav-btn');
  const sections = document.querySelectorAll('.spa-section');

  // Guardia: si no hay botones o secciones en el DOM, no hay nada que hacer
  if (!navButtons.length || !sections.length) {
    console.warn('SPA Navigation: No se encontraron botones o secciones.');
    return;
  }

  // Agregar el listener de click a cada botón de navegación
  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Leer el id de la sección destino desde el atributo data-target del botón
      const targetId = e.currentTarget.getAttribute('data-target');
      
      // 1. Actualizar estado visual de los botones:
      //    Quitar 'active' a todos, luego agregarlo solo al que se clickeó
      navButtons.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');

      // 2. Mostrar la sección seleccionada y ocultar las demás:
      //    Recorre todas las secciones y compara su id con el targetId
      sections.forEach(section => {
        if (section.id === targetId) {
          // Esta sección es la seleccionada: mostrarla
          section.classList.remove('hidden');
          section.classList.add('active');
        } else {
          // Cualquier otra sección: ocultarla
          section.classList.add('hidden');
          section.classList.remove('active');
        }
      });

      // 3. Scroll suave hacia arriba al cambiar de sección
      //    para que el usuario siempre vea el inicio del nuevo panel
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
}
