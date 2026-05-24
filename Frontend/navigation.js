export function initSPANavigation() {
  const navButtons = document.querySelectorAll('.spa-nav-btn');
  const sections = document.querySelectorAll('.spa-section');

  if (!navButtons.length || !sections.length) {
    console.warn('SPA Navigation: No se encontraron botones o secciones.');
    return;
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = e.currentTarget.getAttribute('data-target');
      
      // 1. Actualizar estado visual de los botones
      navButtons.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');

      // 2. Mostrar la sección seleccionada y ocultar las demás
      sections.forEach(section => {
        if (section.id === targetId) {
          section.classList.remove('hidden');
          section.classList.add('active');
        } else {
          section.classList.add('hidden');
          section.classList.remove('active');
        }
      });

      // (Opcional) Hacer scroll suave hacia arriba al cambiar de pestaña
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
}
