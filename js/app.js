// js/app.js

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  initNavigation();
  checkInitialView();
  preventMobileZoom();
  initDashboardKPIEvents();
  initTasksModule();
  initProjectsModule();
  initCalendarModule();
  initReportsModule();
  initBaselineAuthModalEvents();
  initCustomModals();
  initSearchClearButtons();
});

// MODALES DE ALERTA Y CONFIRMACIÓN
let confirmCallback = null;

function initCustomModals() {
  const alertModal = document.getElementById('custom-alert-modal');
  const closeAlertBtn = document.getElementById('close-custom-alert-btn');
  const okAlertBtn = document.getElementById('ok-custom-alert-btn');

  const confirmModal = document.getElementById('confirm-delete-modal');
  const closeConfirmBtn = document.getElementById('close-confirm-delete-btn');
  const cancelConfirmBtn = document.getElementById('cancel-confirm-delete-btn');
  const acceptConfirmBtn = document.getElementById('accept-confirm-delete-btn');

  const closeAlert = () => alertModal.classList.add('hidden');
  if (closeAlertBtn) closeAlertBtn.onclick = closeAlert;
  if (okAlertBtn) okAlertBtn.onclick = closeAlert;

  const closeConfirm = () => {
    confirmModal.classList.add('hidden');
    confirmCallback = null;
  };
  if (closeConfirmBtn) closeConfirmBtn.onclick = closeConfirm;
  if (cancelConfirmBtn) cancelConfirmBtn.onclick = closeConfirm;

  if (acceptConfirmBtn) {
    acceptConfirmBtn.onclick = () => {
      if (confirmCallback) confirmCallback();
      closeConfirm();
    };
  }
}

function showCustomAlert(message, title = '⚠️ Atención') {
  const alertModal = document.getElementById('custom-alert-modal');
  document.getElementById('custom-alert-title').textContent = title;
  document.getElementById('custom-alert-message').textContent = message;
  alertModal.classList.remove('hidden');
}

function showConfirmDeleteModal(itemTitle, onConfirm) {
  const confirmModal = document.getElementById('confirm-delete-modal');
  document.getElementById('confirm-delete-message').innerHTML = `¿Está seguro de que desea eliminar <strong>"${itemTitle}"</strong>? Esta acción no se puede deshacer.`;
  confirmCallback = onConfirm;
  confirmModal.classList.remove('hidden');
}

// BÚSQUEDA CON BOTÓN "X" PARA LIMPIAR
function initSearchClearButtons() {
  const searchInput = document.getElementById('project-search-input');
  const clearBtn = document.getElementById('clear-project-search-btn');

  if (searchInput && clearBtn) {
    searchInput.addEventListener('input', () => {
      if (searchInput.value.trim().length > 0) clearBtn.classList.remove('hidden');
      else clearBtn.classList.add('hidden');
    });

    clearBtn.onclick = () => {
      searchInput.value = '';
      clearBtn.classList.add('hidden');
      const activeFilter = document.querySelector('[data-proj-filter].active')?.getAttribute('data-proj-filter') || 'todos';
      renderProjectsList(activeFilter, '');
    };
  }
}

// NAVEGACIÓN LIMPIA Y DIRECCIONADA DESDE EL DASHBOARD
function initDashboardKPIEvents() {
  const kpiProjects = document.getElementById('kpi-card-projects');
  const kpiPending = document.getElementById('kpi-card-pending');
  const kpiOverdue = document.getElementById('kpi-card-overdue');

  if (kpiProjects) {
    kpiProjects.onclick = () => switchView('projects');
  }

  if (kpiPending) {
    kpiPending.onclick = () => {
      switchView('agenda');
      setAgendaFilter('pendientes');
    };
  }

  if (kpiOverdue) {
    kpiOverdue.onclick = () => {
      switchView('agenda');
      setAgendaFilter('vencidas');
    };
  }
}

function setAgendaFilter(filterType) {
  const buttons = document.querySelectorAll('.task-filters .filter-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-filter') === filterType) btn.classList.add('active');
    else btn.classList.remove('active');
  });
  renderDailyAgenda(filterType);
}

// CONTROL DE TEMA Y SIDEBAR
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

  if (overlay) overlay.addEventListener('click', closeMobileSidebar);
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (overlay) overlay.classList.remove('active');
}

function preventMobileZoom() {
  document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
}

function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item[data-view]');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      switchView(item.getAttribute('data-view'));
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

  if (viewName === 'agenda') {
    const activeFilter = document.querySelector('.task-filters .filter-btn.active')?.getAttribute('data-filter') || 'todas';
    renderDailyAgenda(activeFilter);
  }
  if (viewName === 'reports') renderReportsView();
  if (viewName === 'calendar') renderCalendarView();

  if (window.innerWidth <= 768) closeMobileSidebar();
}

function checkInitialView() {
  const isMobile = window.innerWidth <= 768;
  switchView(isMobile ? 'agenda' : 'dashboard');
}

// =========================================================================
// MÓDULO DE SEGUIMIENTO Y GESTIÓN DE TAREAS Y DURACIÓN
// =========================================================================

function initTasksModule() {
  const todayStr = new Date().toISOString().split('T')[0];
  const desdeInput = document.getElementById('agenda-filter-desde');
  const hastaInput = document.getElementById('agenda-filter-hasta');

  if (desdeInput) desdeInput.value = todayStr;
  if (hastaInput) hastaInput.value = todayStr;

  if (desdeInput) desdeInput.onchange = () => triggerAgendaFilter();
  if (hastaInput) hastaInput.onchange = () => triggerAgendaFilter();

  bindDurationCalculationEvents('agenda-task-start-date', 'agenda-task-end-date', 'agenda-task-duration');
  bindDurationCalculationEvents('proj-task-start-date', 'proj-task-end-date', 'proj-task-duration');

  renderDashboardKPIs();
  renderDailyAgenda('todas');
  setupAgendaTaskEvents();
}

// BINDING BIDIRECCIONAL: FECHAS <-> DURACIÓN EN DÍAS
function bindDurationCalculationEvents(startId, endId, durationId) {
  const startEl = document.getElementById(startId);
  const endEl = document.getElementById(endId);
  const durEl = document.getElementById(durationId);

  if (!startEl || !endEl || !durEl) return;

  const updateFromDates = () => {
    if (startEl.value && endEl.value) {
      const days = calculateTaskDurationInDays(startEl.value, endEl.value);
      durEl.value = days;
    }
  };

  const updateFromDuration = () => {
    if (startEl.value && durEl.value) {
      endEl.value = addDaysToIsoDate(startEl.value, durEl.value);
    }
  };

  startEl.addEventListener('change', updateFromDates);
  endEl.addEventListener('change', updateFromDates);
  durEl.addEventListener('input', updateFromDuration);
}

function triggerAgendaFilter() {
  const activeFilter = document.querySelector('.task-filters .filter-btn.active')?.getAttribute('data-filter') || 'todas';
  renderDailyAgenda(activeFilter);
}

function renderDashboardKPIs() {
  const tasks = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS) || '[]');
  const projects = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.PROJECTS) || '[]');
  const todayStr = new Date().toISOString().split('T')[0];

  const activeProjects = projects.filter(p => p.status === 'en_curso').length;
  const pendingTasks = tasks.filter(t => t.status !== 'completado').length;
  const overdueTasks = tasks.filter(t => (t.overdue || t.endDate < todayStr) && t.status !== 'completado').length;

  document.getElementById('kpi-active-projects').textContent = activeProjects;
  document.getElementById('kpi-pending-tasks').textContent = pendingTasks;
  document.getElementById('kpi-overdue-tasks').textContent = overdueTasks;
}

function renderDailyAgenda(filter = 'todas') {
  const container = document.getElementById('daily-tasks-list');
  const dateLabel = document.getElementById('current-date-label');
  if (!container) return;

  if (dateLabel) {
    dateLabel.textContent = new Date().toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  let tasks = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS) || '[]');
  const projects = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.PROJECTS) || '[]');
  const todayStr = new Date().toISOString().split('T')[0];

  const desdeVal = document.getElementById('agenda-filter-desde')?.value;
  const hastaVal = document.getElementById('agenda-filter-hasta')?.value;

  if (filter === 'pendientes') {
    tasks = tasks.filter(t => t.status !== 'completado');
  } else if (filter === 'completadas') {
    tasks = tasks.filter(t => t.status === 'completado');
  } else if (filter === 'vencidas') {
    tasks = tasks.filter(t => (t.overdue || t.endDate < todayStr) && t.status !== 'completado');
  }

  if (desdeVal && hastaVal) {
    tasks = tasks.filter(t => {
      const taskStart = t.startDate || t.date;
      const taskEnd = t.endDate || t.date;
      return taskStart <= hastaVal && taskEnd >= desdeVal;
    });
  }

  // ORDENAR SIEMPRE POR FECHA DE INICIO ASCENDENTE
  tasks.sort((a, b) => (a.startDate || a.date).localeCompare(b.startDate || b.date));

  if (tasks.length === 0) {
    container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 2rem;"><p>No hay tareas que coincidan con los filtros seleccionados.</p></div>';
    return;
  }

  container.innerHTML = tasks.map(task => {
    let projName = '👤 Tarea Personal';
    if (task.projectId && task.projectId !== 'personal') {
      const foundProj = projects.find(p => p.id === task.projectId);
      if (foundProj) projName = foundProj.name;
    }

    const isOverdue = (task.overdue || task.endDate < todayStr) && task.status !== 'completado';
    const formattedRange = `${formatDateDisplay(task.startDate)} al ${formatDateDisplay(task.endDate)}`;
    const durationDays = task.durationDays || calculateTaskDurationInDays(task.startDate, task.endDate);

    return `
      <div class="task-card ${isOverdue ? 'overdue' : ''}" onclick="openAgendaTaskModal('${task.id}')">
        <div class="task-checkbox ${task.status === 'completado' ? 'checked' : ''}" onclick="event.stopPropagation(); toggleTaskStatus('${task.id}');">
          ${task.status === 'completado' ? '✓' : ''}
        </div>
        
        <div class="task-details">
          <div>
            <span class="task-title ${task.status === 'completado' ? 'completed' : ''}">${task.title}</span>
            <span class="task-project-tag"> &nbsp;|&nbsp; ${projName}</span>
          </div>
          ${task.description ? `<p class="task-desc-text">${task.description}</p>` : ''}
          <div class="task-meta">
            <span class="task-badge priority-${task.priority}">Prioridad ${task.priority}</span>
            <span class="task-badge duration-badge">⏱️ ${durationDays} d</span>
            ${isOverdue ? '<span class="task-badge status-vencida blink">⚠️ VENCIDA</span>' : ''}
            <span class="date-label">${formattedRange}</span>
            ${task.attachmentName ? `<span class="attachment-badge">📎 ${task.attachmentName}</span>` : ''}
          </div>
        </div>

        <div class="task-actions" onclick="event.stopPropagation();">
          <button class="action-icon-btn" title="Compartir por Email" onclick="shareTaskEmail('${task.id}')">
            <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </button>
          
          <button class="action-icon-btn whatsapp" title="Compartir por WhatsApp" onclick="shareTaskWhatsApp('${task.id}')">
            <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.8 14.28c-.25.69-1.46 1.32-2.02 1.39-.52.07-1.19.1-1.92-.13-.44-.14-1.02-.33-1.78-.66-3.13-1.36-5.17-4.54-5.33-4.75-.16-.21-1.28-1.7-1.28-3.24 0-1.54.81-2.3 1.1-2.6.29-.3.63-.38.84-.38.21 0 .42 0 .61.01.2.01.47-.08.73.55.27.65.91 2.22.99 2.38.08.16.13.35.03.56-.1.21-.16.34-.31.52-.16.18-.33.4-.47.53-.15.15-.3.32-.13.62.18.3.78 1.28 1.67 2.07 1.15 1.02 2.11 1.34 2.41 1.49.3.15.48.13.66-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.71-.15.29.11 1.86.88 2.18 1.04.32.16.53.24.61.38.08.14.08.82-.17 1.51z"/>
            </svg>
          </button>

          <button class="action-icon-btn delete" title="Eliminar tarea" onclick="requestDeleteTask('${task.id}')">✕</button>
        </div>
      </div>
    `;
  }).join('');
}

function shareTaskEmail(taskId) {
  const tasks = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS) || '[]');
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  const subject = encodeURIComponent(`Tarea: ${task.title}`);
  const body = encodeURIComponent(`Hola,\n\nTe comparto los detalles de la tarea:\n\n📌 Tarea: ${task.title}\n📝 Descripción: ${task.description || 'Sin descripción'}\n📅 Fechas: ${formatDateDisplay(task.startDate)} al ${formatDateDisplay(task.endDate)} (${task.durationDays || 1} días)\n⚡ Prioridad: ${task.priority}\n\nEnviado desde Comovamos.`);
  window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
}

function shareTaskWhatsApp(taskId) {
  const tasks = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS) || '[]');
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  const text = encodeURIComponent(`📌 *Tarea:* ${task.title}\n📝 *Descripción:* ${task.description || 'Sin descripción'}\n📅 *Fechas:* ${formatDateDisplay(task.startDate)} al ${formatDateDisplay(task.endDate)} (${task.durationDays || 1} días)\n⚡ *Prioridad:* ${task.priority.toUpperCase()}\n\n_Gestor de Proyectos Comovamos_`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

function requestDeleteTask(taskId) {
  const tasks = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS) || '[]');
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  showConfirmDeleteModal(`Tarea: ${task.title}`, () => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    localStorage.setItem(CONFIG.STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
    
    if (task.projectId && task.projectId !== 'personal') {
      recalculateProjectMetrics(task.projectId);
      renderProjectDetailTasks(task.projectId);
    }
    renderDashboardKPIs();
    triggerAgendaFilter();
  });
}

function toggleTaskStatus(taskId) {
  let tasks = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS) || '[]');
  let affectedProjId = null;

  tasks = tasks.map(t => {
    if (t.id === taskId) {
      t.status = t.status === 'completado' ? 'pendiente' : 'completado';
      affectedProjId = t.projectId;
    }
    return t;
  });

  localStorage.setItem(CONFIG.STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  if (affectedProjId && affectedProjId !== 'personal') {
    recalculateProjectMetrics(affectedProjId);
    renderProjectDetailTasks(affectedProjId);
  }

  renderDashboardKPIs();
  triggerAgendaFilter();
}

// MODAL DE MODIFICACIÓN DE TAREA CON ELIMINACIÓN DE ARCHIVO
let pendingRemoveAttachment = false;

function openAgendaTaskModal(taskId = null) {
  const modal = document.getElementById('agenda-task-modal');
  const projectSelect = document.getElementById('agenda-task-project');
  const titleEl = document.getElementById('agenda-task-modal-title');
  const currentFileDiv = document.getElementById('agenda-task-current-file');
  const todayStr = new Date().toISOString().split('T')[0];

  pendingRemoveAttachment = false;

  const projects = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.PROJECTS) || '[]');
  projectSelect.innerHTML = '<option value="personal">👤 Tarea personal / Suelta (Calendario personal)</option>' +
    projects.map(p => `<option value="${p.id}">📁 ${p.name}</option>`).join('');

  document.getElementById('agenda-task-file').value = '';

  if (taskId) {
    const tasks = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS) || '[]');
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    titleEl.textContent = 'Modificar tarea';
    document.getElementById('agenda-task-id').value = task.id;
    document.getElementById('agenda-task-title').value = task.title;
    document.getElementById('agenda-task-desc').value = task.description || '';
    document.getElementById('agenda-task-project').value = task.projectId || 'personal';
    document.getElementById('agenda-task-priority').value = task.priority || 'media';
    document.getElementById('agenda-task-status').value = task.status || 'pendiente';
    document.getElementById('agenda-task-start-date').value = task.startDate || todayStr;
    document.getElementById('agenda-task-end-date').value = task.endDate || todayStr;
    document.getElementById('agenda-task-duration').value = task.durationDays || calculateTaskDurationInDays(task.startDate, task.endDate);

    if (currentFileDiv) {
      if (task.attachmentName) {
        currentFileDiv.innerHTML = `
          <span>📎 ${task.attachmentName}</span>
          <button type="button" class="btn-remove-attachment" onclick="flagRemoveTaskAttachment()">✕ Eliminar</button>
        `;
      } else {
        currentFileDiv.innerHTML = '<span class="text-muted">Sin adjunto previo.</span>';
      }
    }
  } else {
    titleEl.textContent = 'Agregar tarea';
    document.getElementById('agenda-task-form').reset();
    document.getElementById('agenda-task-id').value = '';
    document.getElementById('agenda-task-start-date').value = todayStr;
    document.getElementById('agenda-task-end-date').value = todayStr;
    document.getElementById('agenda-task-duration').value = 1;
    if (currentFileDiv) currentFileDiv.innerHTML = '';
  }

  modal.classList.remove('hidden');
}

function flagRemoveTaskAttachment() {
  pendingRemoveAttachment = true;
  const currentFileDiv = document.getElementById('agenda-task-current-file');
  if (currentFileDiv) {
    currentFileDiv.innerHTML = '<span style="color: var(--color-danger); font-weight: 600;">Archivo marcado para eliminación. Guarde los cambios.</span>';
  }
}

function setupAgendaTaskEvents() {
  const openBtn = document.getElementById('open-agenda-task-modal-btn');
  const closeBtn = document.getElementById('close-agenda-task-modal-btn');
  const cancelBtn = document.getElementById('cancel-agenda-task-modal-btn');
  const modal = document.getElementById('agenda-task-modal');
  const form = document.getElementById('agenda-task-form');

  if (openBtn) openBtn.onclick = () => openAgendaTaskModal();

  const closeModal = () => {
    if (modal) modal.classList.add('hidden');
    if (form) form.reset();
  };

  if (closeBtn) closeBtn.onclick = closeModal;
  if (cancelBtn) cancelBtn.onclick = closeModal;

  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const taskId = document.getElementById('agenda-task-id').value;
      const title = document.getElementById('agenda-task-title').value.trim();
      const description = document.getElementById('agenda-task-desc').value.trim();
      const projectId = document.getElementById('agenda-task-project').value;
      const priority = document.getElementById('agenda-task-priority').value;
      const status = document.getElementById('agenda-task-status').value;
      const startDate = document.getElementById('agenda-task-start-date').value;
      const endDate = document.getElementById('agenda-task-end-date').value;
      const durationDays = parseInt(document.getElementById('agenda-task-duration').value, 10) || 1;
      const fileInput = document.getElementById('agenda-task-file');

      if (new Date(startDate) > new Date(endDate)) {
        showCustomAlert('La fecha de fin no puede ser menor a la fecha de inicio de la tarea.', 'Validación de Fechas');
        return;
      }

      let tasks = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS) || '[]');
      const todayStr = new Date().toISOString().split('T')[0];
      const isOverdue = endDate < todayStr && status !== 'completado';

      if (taskId) {
        tasks = tasks.map(t => {
          if (t.id === taskId) {
            t.title = title;
            t.description = description;
            t.projectId = projectId;
            t.priority = priority;
            t.status = status;
            t.startDate = startDate;
            t.endDate = endDate;
            t.durationDays = durationDays;
            t.date = endDate;
            t.overdue = isOverdue;

            if (pendingRemoveAttachment) {
              t.attachmentName = null;
            } else if (fileInput.files[0]) {
              t.attachmentName = fileInput.files[0].name;
            }
          }
          return t;
        });
      } else {
        tasks.unshift({
          id: 'task-' + Date.now(),
          projectId: projectId,
          title: title,
          description: description,
          startDate: startDate,
          endDate: endDate,
          durationDays: durationDays,
          date: endDate,
          status: status,
          priority: priority,
          overdue: isOverdue,
          attachmentName: fileInput.files[0] ? fileInput.files[0].name : null
        });
      }

      localStorage.setItem(CONFIG.STORAGE_KEYS.TASKS, JSON.stringify(tasks));

      if (projectId && projectId !== 'personal') {
        recalculateProjectMetrics(projectId);
        renderProjectDetailTasks(projectId);
      }

      renderDashboardKPIs();
      triggerAgendaFilter();
      closeModal();
    };
  }

  document.querySelectorAll('.task-filters .filter-btn').forEach(btn => {
    btn.onclick = (e) => {
      document.querySelectorAll('.task-filters .filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderDailyAgenda(e.target.getAttribute('data-filter'));
    };
  });
}

// =========================================================================
// PROYECTOS Y RECALCULO DE AVANCE REACTIVO EN TIEMPO REAL
// =========================================================================

let projectViewMode = localStorage.getItem(CONFIG.STORAGE_KEYS.PROJECT_VIEW_MODE) || 'grid';
let activeDetailProjectId = null;

function initProjectsModule() {
  renderProjectsList();
  setupProjectsEvents();
  populateProjectFormSelects();
  setupProjectDetailModalEvents();
}

function populateProjectFormSelects() {
  const categorySelects = [document.getElementById('proj-category'), document.getElementById('detail-proj-category')];
  const ownerSelects = [document.getElementById('proj-owner'), document.getElementById('detail-proj-owner')];

  const categories = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.CATEGORIES) || '[]');
  categorySelects.forEach(s => {
    if (s) {
      s.innerHTML = '<option value="" disabled selected>Seleccione una categoría</option>' +
        categories.map(c => `<option value="${c}">${c}</option>`).join('');
    }
  });

  const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS) || '[]');
  ownerSelects.forEach(s => {
    if (s) {
      s.innerHTML = '<option value="" disabled selected>Seleccione un líder responsable</option>' +
        users.map(u => `<option value="${u.name}">${u.name} (${u.role})</option>`).join('');
    }
  });
}

function recalculateProjectMetrics(projectId) {
  let projects = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.PROJECTS) || '[]');
  const tasks = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS) || '[]').filter(t => t.projectId === projectId);

  projects = projects.map(p => {
    if (p.id === projectId) {
      if (tasks.length === 0) {
        p.progress = 0;
        p.endDate = p.baselineEndDate || p.endDate;
      } else {
        let totalWeightInDays = 0;
        let completedWeightInDays = 0;

        tasks.forEach(t => {
          const taskWeight = t.durationDays || calculateTaskDurationInDays(t.startDate, t.endDate);
          totalWeightInDays += taskWeight;
          if (t.status === 'completado') {
            completedWeightInDays += taskWeight;
          }
        });

        p.progress = totalWeightInDays > 0 ? Math.round((completedWeightInDays / totalWeightInDays) * 100) : 0;

        const endDates = tasks.map(t => t.endDate).filter(Boolean).sort();
        if (endDates.length > 0) {
          p.endDate = endDates[endDates.length - 1];
        }
      }
    }
    return p;
  });

  localStorage.setItem(CONFIG.STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  renderProjectsList();

  const currentProj = projects.find(p => p.id === projectId);
  if (currentProj && activeDetailProjectId === projectId) {
    const badge = document.getElementById('detail-proj-progress-badge');
    const endDateInput = document.getElementById('detail-proj-end-date');

    if (badge) badge.textContent = `${currentProj.progress}%`;
    if (endDateInput) endDateInput.value = currentProj.endDate;
  }
}

function renderProjectsList(filter = 'todos', searchTerm = '') {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.classList.toggle('list-view', projectViewMode === 'list');
  let projects = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.PROJECTS) || '[]');

  if (filter !== 'todos') projects = projects.filter(p => p.status === filter);
  if (searchTerm.trim() !== '') {
    const term = searchTerm.toLowerCase();
    projects = projects.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
  }

  if (projects.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;"><p>No hay proyectos registrados.</p></div>';
    return;
  }

  const todayStr = new Date().toISOString().split('T')[0];

  grid.innerHTML = projects.map(proj => {
    const statusLabel = proj.status === 'en_curso' ? 'En curso' : (proj.status === 'completado' ? 'Completado' : 'Pausado');
    const isNew = proj.createdAt === todayStr;

    return `
      <div class="project-card" onclick="openProjectDetailModal('${proj.id}')">
        <div>
          <div class="project-card-header">
            <h4 class="project-title">${proj.name}</h4>
            <div class="badges-container">
              <span class="status-badge status-${proj.status}">${statusLabel}</span>
              ${isNew ? '<span class="status-badge status-nuevo">Nuevo</span>' : ''}
            </div>
          </div>
          <span class="project-category">${proj.category} • Líder: <strong>${proj.owner || 'N/A'}</strong></span>
        </div>

        <div class="project-progress-wrapper">
          <div class="progress-header">
            <span>Avance (Ponderado)</span>
            <span>${proj.progress}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${proj.progress}%;"></div>
          </div>
        </div>

        <div class="project-footer">
          <span>Estimado fin: <strong>${formatDateDisplay(proj.endDate)}</strong></span>
          <button class="action-icon-btn delete" onclick="event.stopPropagation(); deleteProject('${proj.id}')">✕</button>
        </div>
      </div>
    `;
  }).join('');
}

function deleteProject(projId) {
  let projects = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.PROJECTS) || '[]');
  const proj = projects.find(p => p.id === projId);
  
  showConfirmDeleteModal(`Proyecto: ${proj ? proj.name : 'Seleccionado'}`, () => {
    projects = projects.filter(p => p.id !== projId);
    localStorage.setItem(CONFIG.STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    renderProjectsList();
    renderDashboardKPIs();
  });
}

function openProjectDetailModal(projectId) {
  const modal = document.getElementById('project-detail-modal');
  const projects = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.PROJECTS) || '[]');
  const proj = projects.find(p => p.id === projectId);
  if (!proj || !modal) return;

  activeDetailProjectId = projectId;

  document.getElementById('detail-proj-id').value = proj.id;
  document.getElementById('detail-proj-title').textContent = proj.name;
  document.getElementById('detail-proj-subtitle').textContent = `${proj.category} • Líder: ${proj.owner || 'N/A'}`;
  document.getElementById('detail-proj-name').value = proj.name;
  document.getElementById('detail-proj-category').value = proj.category;
  document.getElementById('detail-proj-owner').value = proj.owner || '';
  document.getElementById('detail-proj-status').value = proj.status || 'en_curso';
  document.getElementById('detail-proj-progress-badge').textContent = `${proj.progress || 0}%`;
  
  document.getElementById('detail-proj-start-date').value = proj.baselineStartDate || proj.startDate || '';
  document.getElementById('detail-proj-baseline-end-date').value = proj.baselineEndDate || proj.endDate || '';
  document.getElementById('detail-proj-end-date').value = proj.endDate || '';
  
  document.getElementById('detail-proj-desc').value = proj.description || '';

  const todayStr = new Date().toISOString().split('T')[0];
  document.getElementById('proj-task-start-date').value = todayStr;
  document.getElementById('proj-task-end-date').value = todayStr;
  document.getElementById('proj-task-duration').value = 1;

  recalculateProjectMetrics(projectId);
  renderProjectDetailTasks(projectId);
  renderProjectAttachments(proj);

  modal.classList.remove('hidden');
}

// ACTUALIZACIÓN REACTIVA E INMEDIATA EN PESTAÑA TAREAS DEL PROYECTO
function renderProjectDetailTasks(projectId) {
  const container = document.getElementById('proj-detail-tasks-list');
  const countEl = document.getElementById('detail-tasks-count');
  if (!container) return;

  let tasks = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS) || '[]').filter(t => t.projectId === projectId);
  
  // ORDENAR SIEMPRE POR FECHA DE INICIO ASCENDENTE
  tasks.sort((a, b) => (a.startDate || a.date).localeCompare(b.startDate || b.date));

  if (countEl) countEl.textContent = tasks.length;

  if (tasks.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1.5rem;">No hay tareas asociadas a este proyecto.</p>';
    return;
  }

  container.innerHTML = tasks.map(t => {
    const formattedRange = `${formatDateDisplay(t.startDate)} al ${formatDateDisplay(t.endDate)}`;
    const durationDays = t.durationDays || calculateTaskDurationInDays(t.startDate, t.endDate);

    return `
      <div class="task-card" onclick="openAgendaTaskModal('${t.id}')">
        <div class="task-checkbox ${t.status === 'completado' ? 'checked' : ''}" onclick="event.stopPropagation(); toggleTaskStatus('${t.id}'); renderProjectDetailTasks('${projectId}');">
          ${t.status === 'completado' ? '✓' : ''}
        </div>
        <div class="task-details">
          <span class="task-title ${t.status === 'completado' ? 'completed' : ''}">${t.title}</span>
          ${t.description ? `<p class="task-desc-text">${t.description}</p>` : ''}
          <div class="task-meta">
            <span class="task-badge priority-${t.priority}">Prioridad ${t.priority}</span>
            <span class="task-badge duration-badge">⏱️ ${durationDays} d</span>
            <span class="date-label">${formattedRange}</span>
            ${t.attachmentName ? `<span class="attachment-badge">📎 ${t.attachmentName}</span>` : ''}
          </div>
        </div>
        <button class="action-icon-btn delete" onclick="event.stopPropagation(); requestDeleteTask('${t.id}'); renderProjectDetailTasks('${projectId}');">✕</button>
      </div>
    `;
  }).join('');
}

function renderProjectAttachments(proj) {
  const container = document.getElementById('proj-attachments-list');
  const countEl = document.getElementById('detail-attachments-count');
  if (!container) return;

  const attachments = proj.attachments || [];
  if (countEl) countEl.textContent = attachments.length;

  if (attachments.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1.5rem;">No hay archivos adjuntos en este proyecto.</p>';
    return;
  }

  container.innerHTML = attachments.map(att => `
    <div class="attachment-item">
      <div>📄 <strong>${att.name}</strong> <span class="text-muted">(${att.size})</span></div>
      <button class="action-icon-btn delete" onclick="deleteAttachment('${proj.id}', '${att.id}')">✕</button>
    </div>
  `).join('');
}

function deleteAttachment(projectId, attachmentId) {
  let projects = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.PROJECTS) || '[]');
  projects = projects.map(p => {
    if (p.id === projectId) p.attachments = (p.attachments || []).filter(a => a.id !== attachmentId);
    return p;
  });

  localStorage.setItem(CONFIG.STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  const currentProj = projects.find(p => p.id === projectId);
  if (currentProj) renderProjectAttachments(currentProj);
}

function setupProjectDetailModalEvents() {
  const modal = document.getElementById('project-detail-modal');
  const closeBtn = document.getElementById('close-project-detail-modal-btn');
  const tabs = document.querySelectorAll('.detail-tab-btn');
  const detailsForm = document.getElementById('edit-project-details-form');
  const addTaskForm = document.getElementById('add-proj-task-form');

  tabs.forEach(tab => {
    tab.onclick = () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.detail-tab-content .tab-pane').forEach(p => p.classList.add('hidden'));

      tab.classList.add('active');
      const pane = document.getElementById(tab.getAttribute('data-tab'));
      if (pane) pane.classList.remove('hidden');
    };
  });

  if (closeBtn && modal) closeBtn.onclick = () => modal.classList.add('hidden');

  if (detailsForm) {
    detailsForm.onsubmit = (e) => {
      e.preventDefault();
      const projId = document.getElementById('detail-proj-id').value;
      let projects = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.PROJECTS) || '[]');

      projects = projects.map(p => {
        if (p.id === projId) {
          p.name = document.getElementById('detail-proj-name').value;
          p.category = document.getElementById('detail-proj-category').value;
          p.owner = document.getElementById('detail-proj-owner').value;
          p.status = document.getElementById('detail-proj-status').value;
          p.description = document.getElementById('detail-proj-desc').value;
        }
        return p;
      });

      localStorage.setItem(CONFIG.STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      renderProjectsList();
      renderDashboardKPIs();
      modal.classList.add('hidden');
    };
  }

  if (addTaskForm) {
    addTaskForm.onsubmit = (e) => {
      e.preventDefault();
      const title = document.getElementById('proj-task-title').value;
      const description = document.getElementById('proj-task-desc').value;
      const priority = document.getElementById('proj-task-priority').value;
      const startDate = document.getElementById('proj-task-start-date').value;
      const endDate = document.getElementById('proj-task-end-date').value;
      const durationDays = parseInt(document.getElementById('proj-task-duration').value, 10) || 1;
      const fileInput = document.getElementById('proj-task-file');

      if (!title || !activeDetailProjectId) return;

      if (new Date(startDate) > new Date(endDate)) {
        showCustomAlert('La fecha de fin de la tarea no puede ser menor a la fecha de inicio.', 'Validación de Fechas');
        return;
      }

      const tasks = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS) || '[]');
      const newTask = {
        id: 'task-' + Date.now(),
        projectId: activeDetailProjectId,
        title: title.trim(),
        description: description.trim(),
        startDate: startDate,
        endDate: endDate,
        durationDays: durationDays,
        date: endDate,
        status: 'pendiente',
        priority: priority,
        overdue: false,
        attachmentName: fileInput.files[0] ? fileInput.files[0].name : null
      };

      tasks.unshift(newTask);
      localStorage.setItem(CONFIG.STORAGE_KEYS.TASKS, JSON.stringify(tasks));

      document.getElementById('proj-task-title').value = '';
      document.getElementById('proj-task-desc').value = '';
      fileInput.value = '';

      recalculateProjectMetrics(activeDetailProjectId);
      renderProjectDetailTasks(activeDetailProjectId);
      renderDashboardKPIs();
      triggerAgendaFilter();
    };
  }

  const uploadBtn = document.getElementById('trigger-file-upload-btn');
  const fileInput = document.getElementById('proj-attachment-file');

  if (uploadBtn && fileInput) {
    uploadBtn.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file || !activeDetailProjectId) return;

      let projects = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.PROJECTS) || '[]');
      projects = projects.map(p => {
        if (p.id === activeDetailProjectId) {
          if (!p.attachments) p.attachments = [];
          p.attachments.push({ id: 'att-' + Date.now(), name: file.name, size: (file.size / (1024 * 1024)).toFixed(1) + ' MB' });
        }
        return p;
      });

      localStorage.setItem(CONFIG.STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      const currentProj = projects.find(p => p.id === activeDetailProjectId);
      if (currentProj) renderProjectAttachments(currentProj);
      fileInput.value = '';
    };
  }
}

function setupProjectsEvents() {
  const openModalBtn = document.getElementById('open-project-modal-btn');
  const closeModalBtn = document.getElementById('close-project-modal-btn');
  const cancelModalBtn = document.getElementById('cancel-project-modal-btn');
  const modal = document.getElementById('project-modal');
  const form = document.getElementById('create-project-form');
  const searchInput = document.getElementById('project-search-input');
  const filterBtns = document.querySelectorAll('[data-proj-filter]');

  const gridBtn = document.getElementById('view-grid-btn');
  const listBtn = document.getElementById('view-list-btn');

  if (gridBtn && listBtn) {
    if (projectViewMode === 'list') {
      gridBtn.classList.remove('active');
      listBtn.classList.add('active');
    }

    gridBtn.onclick = () => {
      projectViewMode = 'grid';
      localStorage.setItem(CONFIG.STORAGE_KEYS.PROJECT_VIEW_MODE, 'grid');
      gridBtn.classList.add('active');
      listBtn.classList.remove('active');
      renderProjectsList();
    };

    listBtn.onclick = () => {
      projectViewMode = 'list';
      localStorage.setItem(CONFIG.STORAGE_KEYS.PROJECT_VIEW_MODE, 'list');
      listBtn.classList.add('active');
      gridBtn.classList.remove('active');
      renderProjectsList();
    };
  }

  if (openModalBtn && modal) {
    openModalBtn.onclick = () => {
      populateProjectFormSelects();
      modal.classList.remove('hidden');
    };
  }

  const closeModal = () => {
    if (modal) modal.classList.add('hidden');
    if (form) form.reset();
  };

  if (closeModalBtn) closeModalBtn.onclick = closeModal;
  if (cancelModalBtn) cancelModalBtn.onclick = closeModal;

  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const startDate = document.getElementById('proj-start-date').value;
      const endDate = document.getElementById('proj-end-date').value;

      if (new Date(startDate) > new Date(endDate)) {
        showCustomAlert('La fecha fin estimada no puede ser menor a la fecha de inicio.', 'Validación de Fechas');
        return;
      }

      const newProjId = 'proj-' + Date.now();
      const projects = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.PROJECTS) || '[]');

      projects.unshift({
        id: newProjId,
        name: document.getElementById('proj-name').value,
        category: document.getElementById('proj-category').value,
        status: 'en_curso',
        progress: 0,
        baselineStartDate: startDate,
        baselineEndDate: endDate,
        startDate: startDate,
        endDate: endDate,
        owner: document.getElementById('proj-owner').value,
        createdAt: new Date().toISOString().split('T')[0],
        description: '',
        attachments: []
      });

      localStorage.setItem(CONFIG.STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      renderProjectsList();
      renderDashboardKPIs();
      closeModal();

      openProjectDetailModal(newProjId);
    };
  }

  if (searchInput) {
    searchInput.oninput = (e) => {
      const activeFilter = document.querySelector('[data-proj-filter].active')?.getAttribute('data-proj-filter') || 'todos';
      renderProjectsList(activeFilter, e.target.value);
    };
  }

  filterBtns.forEach(btn => {
    btn.onclick = (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderProjectsList(e.target.getAttribute('data-proj-filter'), searchInput ? searchInput.value : '');
    };
  });
}

// CALENDARIO Y REPORTES
let currentCalDate = new Date();

function initCalendarModule() {
  const prevBtn = document.getElementById('cal-prev-btn');
  const nextBtn = document.getElementById('cal-next-btn');

  if (prevBtn) prevBtn.onclick = () => { currentCalDate.setMonth(currentCalDate.getMonth() - 1); renderCalendarView(); };
  if (nextBtn) nextBtn.onclick = () => { currentCalDate.setMonth(currentCalDate.getMonth() + 1); renderCalendarView(); };
}

function renderCalendarView() {
  const monthLabel = document.getElementById('calendar-month-label');
  const daysGrid = document.getElementById('calendar-days-grid');
  if (!daysGrid) return;

  const year = currentCalDate.getFullYear();
  const month = currentCalDate.getMonth();
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  if (monthLabel) monthLabel.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let startingDay = firstDay.getDay() - 1;
  if (startingDay === -1) startingDay = 6;

  const totalDays = lastDay.getDate();
  const tasks = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS) || '[]');
  daysGrid.innerHTML = '';

  for (let i = 0; i < startingDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'cal-day-cell other-month';
    daysGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayCell = document.createElement('div');
    dayCell.className = 'cal-day-cell';
    dayCell.textContent = day;

    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (tasks.some(t => t.startDate <= formattedDate && t.endDate >= formattedDate)) {
      const dot = document.createElement('span');
      dot.className = 'cal-dot';
      dayCell.appendChild(dot);
    }

    daysGrid.appendChild(dayCell);
  }
}

function initReportsModule() {}

function renderReportsView() {
  const tasks = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS) || '[]');
  const projects = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.PROJECTS) || '[]');

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completado').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalProgress = projects.reduce((acc, curr) => acc + (curr.progress || 0), 0);
  const avgProgress = projects.length > 0 ? Math.round(totalProgress / projects.length) : 0;

  document.getElementById('rep-completion-rate').textContent = `${completionRate}%`;
  document.getElementById('rep-avg-progress').textContent = `${avgProgress}%`;

  const listEl = document.getElementById('reports-projects-list');
  if (listEl) {
    if (projects.length === 0) {
      listEl.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1.5rem;">No hay proyectos para mostrar en el reporte.</p>';
      return;
    }

    listEl.innerHTML = projects.map(p => `
      <div class="report-project-item" onclick="openProjectDetailModal('${p.id}')">
        <div class="report-project-info">
          <span>📁 ${p.name} <span class="text-muted">(${p.category})</span></span>
          <span>${p.progress}% Avance</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width: ${p.progress}%;"></div></div>
      </div>
    `).join('');
  }
}

function initBaselineAuthModalEvents() {
  const reqBtn = document.getElementById('request-baseline-auth-btn');
  const authModal = document.getElementById('baseline-auth-modal');
  const closeBtn = document.getElementById('close-baseline-auth-btn');
  const cancelBtn = document.getElementById('cancel-baseline-auth-btn');
  const authForm = document.getElementById('baseline-auth-form');

  if (reqBtn && authModal) {
    reqBtn.onclick = () => authModal.classList.remove('hidden');
  }

  const closeAuth = () => {
    if (authModal) authModal.classList.add('hidden');
    if (authForm) authForm.reset();
  };

  if (closeBtn) closeBtn.onclick = closeAuth;
  if (cancelBtn) cancelBtn.onclick = closeAuth;

  if (authForm) {
    authForm.onsubmit = (e) => {
      e.preventDefault();
      const code = document.getElementById('auth-code').value;

      if (!code) {
        showCustomAlert('Debe ingresar un código de autorización.', 'Campo Requerido');
        return;
      }

      const startInput = document.getElementById('detail-proj-start-date');
      const endInput = document.getElementById('detail-proj-baseline-end-date');

      if (startInput) {
        startInput.removeAttribute('readonly');
        startInput.removeAttribute('disabled');
        startInput.classList.remove('input-locked');
      }
      if (endInput) {
        endInput.removeAttribute('readonly');
        endInput.removeAttribute('disabled');
        endInput.classList.remove('input-locked');
      }

      showCustomAlert('Línea Base desbloqueada para modificación.', 'Éxito');
      closeAuth();
    };
  }
}