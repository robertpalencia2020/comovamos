document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  initNavigation();
  checkInitialView();
});

// Control de Tema (Claro / Oscuro)
function initTheme() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeIcon.textContent = savedTheme === 'dark' ? 'light_mode' : 'dark_mode';

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
  });
}

// Control del Sidebar (Overlay vs Fixed)
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const pinBtn = document.getElementById('pin-sidebar-btn');
  const toggleBtn = document.getElementById('toggle-sidebar-btn');

  // Cargar estado de fijado
  const isPinned = localStorage.getItem('sidebar_pinned') === 'true';
  if (isPinned) sidebar.classList.add('pinned');

  pinBtn.addEventListener('click', () => {
    sidebar.classList.toggle('pinned');
    localStorage.setItem('sidebar_pinned', sidebar.classList.contains('pinned'));
  });

  toggleBtn.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('mobile-open');
    } else {
      sidebar.classList.toggle('pinned');
      localStorage.setItem('sidebar_pinned', sidebar.classList.contains('pinned'));
    }
  });
}

// Enrutador de Vistas (SPA)
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item[data-view]');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-view');
      switchView(targetView);
    });
  });
}

function switchView(viewName) {
  // Ocultar todas las vistas
  document.querySelectorAll('.view-pane').forEach(pane => pane.classList.add('hidden'));
  
  // Desactivar items del menú
  document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

  // Mostrar vista seleccionada
  const activePane = document.getElementById(`view-${viewName}`);
  const activeNav = document.querySelector(`.nav-item[data-view="${viewName}"]`);

  if (activePane) activePane.classList.remove('hidden');
  if (activeNav) activeNav.classList.add('active');

  // Actualizar título de navbar con capitalización correcta
  const titles = {
    dashboard: 'Dashboard',
    projects: 'Proyectos',
    agenda: 'Seguimiento',
    calendar: 'Calendario de actividades',
    reports: 'Reportes',
    settings: 'Configuración del sistema'
  };
  document.getElementById('page-title').textContent = titles[viewName] || 'Comovamos';

  // Si está en móvil, cerrar menú al seleccionar
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('mobile-open');
  }
}

// Determina la vista de inicio según el tipo de dispositivo
function checkInitialView() {
  const isMobile = window.innerWidth <= 768;
  const defaultView = isMobile ? 'agenda' : 'dashboard';
  switchView(defaultView);
}