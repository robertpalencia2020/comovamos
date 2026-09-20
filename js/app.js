// js/app.js

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  initNavigation();
  checkInitialView();
  preventMobileZoom();
  initTasksModule();
});

// Control de Tema (Claro / Oscuro) con SVG limpio
function initTheme() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  
  const moonSvg = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  const sunSvg = '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>';

  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (themeIcon) themeIcon.innerHTML = savedTheme === 'dark' ? sunSvg : moonSvg;

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      if (themeIcon) themeIcon.innerHTML = newTheme === 'dark' ? sunSvg : moonSvg;
    });
  }
}

// Control del Sidebar (Overlay vs Fixed)
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const pinBtn = document.getElementById('pin-sidebar-btn');
  const toggleBtn = document.getElementById('toggle-sidebar-btn');
  const overlay = document.getElementById('sidebar-overlay');

  const isPinned = localStorage.getItem('sidebar_pinned') === 'true';
  if (isPinned && sidebar) sidebar.classList.add('pinned');

  if (pinBtn) {
    pinBtn.addEventListener('click', () => {
      sidebar.classList.toggle('pinned');
      localStorage.setItem('sidebar_pinned', sidebar.classList.contains('pinned'));
    });
  }

  if (toggleBtn) {
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
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      closeMobileSidebar();
    });
  }

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('mobile-open')) {
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

// Bloquear pinch-to-zoom en móvil
function preventMobileZoom() {
  document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });

  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
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
  document.querySelectorAll('.view-pane').forEach(pane => pane.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

  const activePane = document.getElementById(`view-${viewName}`);
  const activeNav = document.querySelector(`.nav-item[data-view="${viewName}"]`);

  if (activePane) activePane.classList.remove('hidden');
  if (activeNav) activeNav.classList.add('active');

  const titles = {
    dashboard: 'Dashboard',
    projects: 'Proyectos',
    agenda: 'Seguimiento',
    calendar: 'Calendario',
    reports: 'Reportes',
    settings: 'Configuración'
  };
  const titleEl = document.getElementById('page-title');
  if (titleEl) titleEl.textContent = titles[viewName] || 'Comovamos';

  if (window.innerWidth <= 768) {
    closeMobileSidebar();
  }
}

function checkInitialView() {
  const isMobile = window.innerWidth <= 768;
  const defaultView = isMobile ? 'agenda' : 'dashboard';
  switchView(defaultView);
}

// =========================================================================
// MÓDULO DE SEGUIMIENTO / AGENDA DIARIA
// =========================================================================

function initTasksModule() {
  renderDashboardKPIs();
  renderDailyAgenda('todas');
  setupTaskEvents();
}

function renderDashboardKPIs() {
  const tasks = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS) || '[]');
  const projects = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.PROJECTS) || '[]');

  const activeProjects = projects.filter(p => p.status === 'en_curso').length;
  const pendingTasks = tasks.filter(t => t.status !== 'completado').length;
  const overdueTasks = tasks.filter(t => t.overdue && t.status !== 'completado').length;

  const kpiActive = document.getElementById('kpi-active-projects');
  const kpiPending = document.getElementById('kpi-pending-tasks');
  const kpiOverdue = document.getElementById('kpi-overdue-tasks');

  if (kpiActive) kpiActive.textContent = activeProjects;
  if (kpiPending) kpiPending.textContent = pendingTasks;
  if (kpiOverdue) kpiOverdue.textContent = overdueTasks;
}

function renderDailyAgenda(filter = 'todas') {
  const container = document.getElementById('daily-tasks-list');
  const dateLabel = document.getElementById('current-date-label');

  if (!container) return;

  if (dateLabel) {
    const today = new Date();
    dateLabel.textContent = today.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  let tasks = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS) || '[]');

  if (filter === 'pendientes') {
    tasks = tasks.filter(t => t.status !== 'completado');
  } else if (filter === 'completadas') {
    tasks = tasks.filter(t => t.status === 'completado');
  }

  if (tasks.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 2rem;">
        <p>No hay tareas registradas en esta vista.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = tasks.map(task => `
    <div class="task-card ${task.overdue ? 'overdue' : ''}" data-id="${task.id}">
      <div class="task-checkbox ${task.status === 'completado' ? 'checked' : ''}" onclick="toggleTaskStatus('${task.id}')">
        ${task.status === 'completado' ? '✓' : ''}
      </div>
      <div class="task-details">
        <span class="task-title ${task.status === 'completado' ? 'completed' : ''}">${task.title}</span>
        <div class="task-meta">
          <span class="task-badge priority-${task.priority}">Prioridad ${task.priority}</span>
          ${task.overdue ? '<span class="task-badge overdue-badge">Vencida</span>' : ''}
        </div>
      </div>
      <button class="task-delete-btn" onclick="deleteTask('${task.id}')" title="Eliminar tarea">✕</button>
    </div>
  `).join('');
}

function toggleTaskStatus(taskId) {
  let tasks = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS) || '[]');
  tasks = tasks.map(task => {
    if (task.id === taskId) {
      task.status = task.status === 'completado' ? 'pendiente' : 'completado';
    }
    return task;
  });

  localStorage.setItem(CONFIG.STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  renderDashboardKPIs();
  renderDailyAgenda();
}

function addNewTask(title, priority, projectId = 'proj-1') {
  if (!title.trim()) return;

  const tasks = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS) || '[]');
  const newTask = {
    id: 'task-' + Date.now(),
    projectId: projectId,
    title: title.trim(),
    date: new Date().toISOString().split('T')[0],
    status: 'pendiente',
    priority: priority || 'media',
    overdue: false
  };

  tasks.unshift(newTask);
  localStorage.setItem(CONFIG.STORAGE_KEYS.TASKS, JSON.stringify(tasks));

  renderDashboardKPIs();
  renderDailyAgenda();
}

function deleteTask(taskId) {
  let tasks = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS) || '[]');
  tasks = tasks.filter(t => t.id !== taskId);

  localStorage.setItem(CONFIG.STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  renderDashboardKPIs();
  renderDailyAgenda();
}

function setupTaskEvents() {
  const taskForm = document.getElementById('add-task-form');
  if (taskForm) {
    // Evitar acumulaciones de event listener
    taskForm.onsubmit = (e) => {
      e.preventDefault();
      const input = document.getElementById('task-input-title');
      const prioritySelect = document.getElementById('task-input-priority');
      if (input && input.value) {
        addNewTask(input.value, prioritySelect ? prioritySelect.value : 'media');
        input.value = '';
      }
    };
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.onclick = (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const filter = e.target.getAttribute('data-filter') || 'todas';
      renderDailyAgenda(filter);
    };
  });
}