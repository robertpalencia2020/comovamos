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

// FORMATEADOR GLOBAL DD/MM/AAAA
function formatDateDisplay(isoDateStr) {
  if (!isoDateStr) return '';
  const parts = isoDateStr.split('-');
  if (parts.length !== 3) return isoDateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// CÁLCULO DE DURACIÓN EN DÍAS (INCLUSIVO)
function calculateTaskDurationInDays(startIso, endIso) {
  if (!startIso || !endIso) return 1;
  const s = new Date(startIso);
  const e = new Date(endIso);
  const diffTime = e - s;
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return days > 0 ? days : 1;
}

// CÁLCULO DE FECHA FIN SEGÚN DURACIÓN EN DÍAS
function addDaysToIsoDate(startIso, days) {
  if (!startIso) return '';
  const date = new Date(startIso);
  const count = parseInt(days, 10) || 1;
  date.setDate(date.getDate() + (count - 1));
  return date.toISOString().split('T')[0];
}

// MOCK DATA: 5 PROYECTOS SIMULADOS PARA PRUEBAS COMPLETAS
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
      attachments: [{ id: 'att-1', name: 'Especificaciones_Tecnicas_Bot.pdf', size: '2.4 MB' }]
    },
    {
      id: 'proj-2',
      name: 'Rediseño UX/UI App Móvil Recetium',
      category: 'Experiencia Digital',
      status: 'en_curso',
      progress: 35,
      baselineStartDate: '2026-08-15',
      baselineEndDate: '2026-10-15',
      startDate: '2026-08-15',
      endDate: '2026-10-15',
      owner: 'María Gómez',
      createdAt: '2026-08-20',
      description: 'Actualización total de flujos de interacción para usuarios y proveedores de Recetium.',
      attachments: [{ id: 'att-2', name: 'Wireframes_v2.fig', size: '14.1 MB' }]
    },
    {
      id: 'proj-3',
      name: 'Migración e Infraestructura Cloud AWS',
      category: 'Infraestructura Tecnológica',
      status: 'en_curso',
      progress: 60,
      baselineStartDate: '2026-09-01',
      baselineEndDate: '2026-12-01',
      startDate: '2026-09-01',
      endDate: '2026-12-10',
      owner: 'Carlos Rodríguez',
      createdAt: '2026-09-01',
      description: 'Aprovisionamiento de clústeres EKS, migración de bases de datos PostgreSQL y políticas de seguridad.',
      attachments: []
    },
    {
      id: 'proj-4',
      name: 'Estrategia de Marketing Farmacéutico UCV',
      category: 'Innovación',
      status: 'en_curso',
      progress: 0,
      baselineStartDate: '2026-10-01',
      baselineEndDate: '2026-12-15',
      startDate: '2026-10-01',
      endDate: '2026-12-15',
      owner: 'Robert Palencia',
      createdAt: '2026-09-10',
      description: 'Diseño de la campaña para el Diplomado en Marketing Estratégico Facultad de Farmacia.',
      attachments: []
    },
    {
      id: 'proj-5',
      name: 'Evaluación Agrícola Sanare Lara',
      category: 'Innovación',
      status: 'completado',
      progress: 100,
      baselineStartDate: '2026-05-01',
      baselineEndDate: '2026-06-30',
      startDate: '2026-05-01',
      endDate: '2026-06-30',
      owner: 'Robert Palencia',
      createdAt: '2026-05-01',
      description: 'Estudio de factibilidad y análisis topográfico de tierras de cultivo.',
      attachments: [{ id: 'att-3', name: 'Informe_Final_Sanare.pdf', size: '5.8 MB' }]
    }
  ],
  tasks: [
    {
      id: 'task-101',
      projectId: 'proj-1',
      title: 'Validación de flujos de autenticación biométrica',
      description: 'Verificar compatibilidad con sensores FaceID y Huella en Android/iOS.',
      startDate: '2026-08-15',
      endDate: '2026-09-15',
      durationDays: 32,
      date: '2026-09-15',
      status: 'completado',
      priority: 'alta',
      overdue: false,
      attachmentName: 'Flujo_Biometria.pdf'
    },
    {
      id: 'task-102',
      projectId: 'proj-1',
      title: 'Integración Backend de Servicios API',
      description: 'Conectar endpoints del core bancario para transacciones en tiempo real.',
      startDate: '2026-09-16',
      endDate: '2026-10-30',
      durationDays: 45,
      date: '2026-10-30',
      status: 'pendiente',
      priority: 'alta',
      overdue: false,
      attachmentName: null
    },
    {
      id: 'task-201',
      projectId: 'proj-2',
      title: 'Auditoría de Usabilidad y Wireframes',
      description: 'Evaluación heurística de la versión actual.',
      startDate: '2026-08-15',
      endDate: '2026-08-30',
      durationDays: 16,
      date: '2026-08-30',
      status: 'completado',
      priority: 'media',
      overdue: false,
      attachmentName: 'Reporte_UX.pdf'
    },
    {
      id: 'task-202',
      projectId: 'proj-2',
      title: 'Prototipado de Flujo de Checkout',
      description: 'Creación de pantallas en Figma para pasarela de pagos.',
      startDate: '2026-09-01',
      endDate: '2026-09-15',
      durationDays: 15,
      date: '2026-09-15',
      status: 'pendiente',
      priority: 'alta',
      overdue: true,
      attachmentName: null
    },
    {
      id: 'task-301',
      projectId: 'proj-3',
      title: 'Aprovisionamiento de Clústeres EKS',
      description: 'Despliegue con scripts de Terraform en AWS us-east-1.',
      startDate: '2026-09-01',
      endDate: '2026-09-12',
      durationDays: 12,
      date: '2026-09-12',
      status: 'completado',
      priority: 'alta',
      overdue: false,
      attachmentName: 'Terraform_Output.log'
    },
    {
      id: 'task-302',
      projectId: 'proj-3',
      title: 'Migración de Base de Datos PostgreSQL',
      description: 'Sincronización inicial y prueba de réplicas en RDS.',
      startDate: '2026-09-13',
      endDate: '2026-10-10',
      durationDays: 28,
      date: '2026-10-10',
      status: 'pendiente',
      priority: 'alta',
      overdue: false,
      attachmentName: null
    },
    {
      id: 'task-401',
      projectId: 'proj-4',
      title: 'Análisis de Mercado y Benchmarking',
      description: 'Revisión de programas académicos similares.',
      startDate: '2026-10-01',
      endDate: '2026-10-15',
      durationDays: 15,
      date: '2026-10-15',
      status: 'pendiente',
      priority: 'baja',
      overdue: false,
      attachmentName: null
    },
    {
      id: 'task-501',
      projectId: 'proj-5',
      title: 'Muestreo de Suelos y Topografía',
      description: 'Mediciones de campo y pruebas de calidad.',
      startDate: '2026-05-01',
      endDate: '2026-06-30',
      durationDays: 61,
      date: '2026-06-30',
      status: 'completado',
      priority: 'media',
      overdue: false,
      attachmentName: 'Muestras_Sanare.xlsx'
    },
    {
      id: 'task-999',
      projectId: 'personal',
      title: 'Revisión trimestral de metas individuales',
      description: 'Alineación de objetivos de desempeño.',
      startDate: '2026-09-01',
      endDate: '2026-09-10',
      durationDays: 10,
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