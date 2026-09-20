document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  initNavigation();
  checkInitialView();
});

// Control de Tema (Claro / Oscuro) con SVG limpio
function initTheme() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  
  // Trazado vectorial corregido y alineado para el modo oscuro (Luna)
  const moonSvg = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  const sunSvg = '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>';

  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeIcon.innerHTML = savedTheme === 'dark' ? sunSvg : moonSvg;

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.innerHTML = newTheme === 'dark' ? sunSvg : moonSvg;
  });
}

function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const pinBtn = document.getElementById('pin-sidebar-btn');
  const toggleBtn = document.getElementById('toggle-sidebar-btn');
  const overlay = document.getElementById('sidebar-overlay');

  const isPinned = localStorage.getItem('sidebar_pinned') === 'true';
  if (isPinned) sidebar.classList.add('pinned');

  pinBtn.addEventListener('click', () => {
    sidebar.classList.toggle('pinned');
    localStorage.setItem('sidebar_pinned', sidebar.classList.contains('pinned'));
  });

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('mobile-open');
      if (overlay) overlay.classList.toggle('active', sidebar.classList.contains('mobile-open'));
    } else {
      sidebar.classList.toggle('pinned');
      localStorage.setItem('sidebar_pinned', sidebar.classList.contains('pinned'));
    }
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      closeMobileSidebar();
    });
  }

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar.classList.contains('mobile-open')) {
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeMobileSidebar();
      }
    }
  });
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (overlay) overlay.classList.remove('active');
}

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
  document.querySelectorAll('.view-pane').forEach(pane => pane.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

  const activePane = document.getElementById(`view-${viewName}`);
  const activeNav = document.querySelector(`.nav-item[data-view="${viewName}"]`);

  if (activePane) activePane.classList.remove('hidden');
  if (activeNav) activeNav.classList.add('active');

  // Diccionario de títulos actualizado
  const titles = {
    dashboard: 'Dashboard',
    projects: 'Proyectos',
    agenda: 'Seguimiento',
    calendar: 'Calendario',
    reports: 'Reportes',
    settings: 'Configuración'
  };
  document.getElementById('page-title').textContent = titles[viewName] || 'Comovamos';

  if (window.innerWidth <= 768) {
    closeMobileSidebar();
  }
}

function checkInitialView() {
  const isMobile = window.innerWidth <= 768;
  const defaultView = isMobile ? 'agenda' : 'dashboard';
  switchView(defaultView);
}