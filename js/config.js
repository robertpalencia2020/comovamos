// js/config.js

const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbxc7s4p7UlX1tBYRJ_IWwNeh81fWDfXJyrR5vjCs3ZyrsOtBvidq2x69b19HwWesVG0Vg/exec',
  GOOGLE_CLIENT_ID: 'TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  
  ROLES: {
    SUPER_ADMIN: 'SuperAdmin',
    ADMIN: 'Admin',
    PM: 'PM',
    COLLABORATOR: 'Collaborator'
  },

  STORAGE_KEYS: {
    USER_SESSION: 'comovamos_user',
    PROJECTS: 'comovamos_projects',
    TASKS: 'comovamos_tasks',
    USERS: 'comovamos_users',
    CATEGORIES: 'comovamos_categories',
    THEME: 'theme',
    SIDEBAR_PINNED: 'sidebar_pinned',
    PROJECT_VIEW_MODE: 'comovamos_project_view_mode'
  }
};

const MOCK_DATA = {
  users: [
    { id: 'usr_001', email: 'robertpalencia2020@gmail.com', name: 'Robert Palencia', role: 'SuperAdmin' },
    { id: 'usr_002', email: 'maria.gomez@bancoplaza.com', name: 'María Gómez', role: 'PM' },
    { id: 'usr_003', email: 'carlos.rodriguez@bancoplaza.com', name: 'Carlos Rodríguez', role: 'Admin' }
  ],
  categories: [
    'Canales Electrónicos',
    'Experiencia Digital',
    'Innovación',
    'Infraestructura Tecnológica'
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Implementación Bot Banca Móvil',
      category: 'Canales Electrónicos',
      status: 'en_curso',
      progress: 50,
      baselineStartDate: '2026-08-15',
      baselineEndDate: '2026-10-15',
      startDate: '2026-08-15',
      endDate: '2026-10-30',
      owner: 'Robert Palencia',
      createdAt: '2026-09-01',
      description: 'Implementación de Bot automatizado con IA para consultas de saldo y transferencias rápidas.',
      attachments: [
        { id: 'att-1', name: 'Especificaciones_Tecnicas.pdf', size: '2.4 MB' }
      ]
    },
    {
      id: 'proj-2',
      name: 'Rediseño Portal de Pagos',
      category: 'Experiencia Digital',
      status: 'en_curso',
      progress: 0,
      baselineStartDate: '2026-09-01',
      baselineEndDate: '2026-11-15',
      startDate: '2026-09-01',
      endDate: '2026-11-15',
      owner: 'María Gómez',
      createdAt: '2026-09-05',
      description: 'Actualización de interfaz UX/UI para la pasarela corporativa de pagos.',
      attachments: []
    }
  ],
  tasks: [
    {
      id: 'task-1',
      projectId: 'proj-1',
      title: 'Validación de flujos de autenticación biométrica',
      description: 'Verificar compatibilidad con sensores FaceID y Huella en Android/iOS.',
      startDate: '2026-08-15',
      endDate: '2026-09-15',
      date: '2026-09-15',
      status: 'completado',
      priority: 'alta',
      overdue: false,
      attachmentName: 'Flujo_Biometria.pdf'
    },
    {
      id: 'task-2',
      projectId: 'proj-1',
      title: 'Integración Backend de Servicios API',
      description: 'Conectar endpoints del core bancario para transacciones en tiempo real.',
      startDate: '2026-09-16',
      endDate: '2026-10-30',
      date: '2026-10-30',
      status: 'pendiente',
      priority: 'alta',
      overdue: false,
      attachmentName: null
    },
    {
      id: 'task-3',
      projectId: 'personal',
      title: 'Revisión de metas trimestrales personales',
      description: 'Ajustar OKRs del equipo de desarrollo.',
      startDate: '2026-09-01',
      endDate: '2026-09-10',
      date: '2026-09-10',
      status: 'pendiente',
      priority: 'media',
      overdue: true,
      attachmentName: null
    }
  ]
};

function initDatabase() {
  if (!localStorage.getItem(CONFIG.STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.PROJECTS, JSON.stringify(MOCK_DATA.projects));
  }
  if (!localStorage.getItem(CONFIG.STORAGE_KEYS.TASKS)) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.TASKS, JSON.stringify(MOCK_DATA.tasks));
  }
  if (!localStorage.getItem(CONFIG.STORAGE_KEYS.USERS)) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(MOCK_DATA.users));
  }
  if (!localStorage.getItem(CONFIG.STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.CATEGORIES, JSON.stringify(MOCK_DATA.categories));
  }
}

initDatabase();