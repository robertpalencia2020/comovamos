// js/config.js

const CONFIG = {
  // Tu URL oficial de Google Apps Script
  API_URL: 'https://script.google.com/macros/s/AKfycbxc7s4p7UlX1tBYRJ_IWwNeh81fWDfXJyrR5vjCs3ZyrsOtBvidq2x69b19HwWesVG0Vg/exec',
  
  // ID de cliente de Google Cloud Console
  GOOGLE_CLIENT_ID: 'TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  
  // Roles de la aplicación
  ROLES: {
    SUPER_ADMIN: 'SuperAdmin',
    ADMIN: 'Admin',
    PM: 'PM',
    COLLABORATOR: 'Collaborator'
  },

  // Claves de almacenamiento local
  STORAGE_KEYS: {
    USER_SESSION: 'comovamos_user',
    PROJECTS: 'comovamos_projects',
    TASKS: 'comovamos_tasks',
    THEME: 'theme',
    SIDEBAR_PINNED: 'sidebar_pinned'
  }
};

// Datos iniciales de demostración
const MOCK_DATA = {
  projects: [
    {
      id: 'proj-1',
      name: 'Implementación Bot Banca Móvil',
      category: 'Canales Electrónicos',
      status: 'en_curso',
      progress: 65,
      startDate: '2026-08-15',
      endDate: '2026-10-30',
      owner: 'Robert H.'
    },
    {
      id: 'proj-2',
      name: 'Rediseño Portal de Pagos',
      category: 'Experiencia Digital',
      status: 'en_curso',
      progress: 40,
      startDate: '2026-09-01',
      endDate: '2026-11-15',
      owner: 'Robert H.'
    }
  ],
  tasks: [
    {
      id: 'task-1',
      projectId: 'proj-1',
      title: 'Validación de flujos de autenticación biométrica',
      date: '2026-09-20',
      status: 'pendiente',
      priority: 'alta',
      overdue: false
    },
    {
      id: 'task-2',
      projectId: 'proj-2',
      title: 'Aprobación de maqueta UI con equipo de Riesgo',
      date: '2026-09-18',
      status: 'pendiente',
      priority: 'alta',
      overdue: true
    }
  ]
};

// Inicializar base de datos local
function initDatabase() {
  if (!localStorage.getItem(CONFIG.STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.PROJECTS, JSON.stringify(MOCK_DATA.projects));
  }
  if (!localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS)) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.TASKS, JSON.stringify(MOCK_DATA.tasks));
  }
}

initDatabase();