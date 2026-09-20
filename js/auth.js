// js/auth.js

document.addEventListener('DOMContentLoaded', () => {
  initGoogleAuth();
  checkAuthSession();
  setupLogout();
});

// Inicializar Google Sign-In SDK
function initGoogleAuth() {
  const googleBtn = document.getElementById('google-login-btn');
  
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: CONFIG.GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false
    });

    if (googleBtn) {
      googleBtn.addEventListener('click', () => {
        if (CONFIG.GOOGLE_CLIENT_ID.includes('TU_GOOGLE_CLIENT_ID')) {
          simulateDevLogin();
        } else {
          google.accounts.id.prompt();
        }
      });
    }
  } else if (googleBtn) {
    googleBtn.addEventListener('click', simulateDevLogin);
  }
}

// Procesar credencial devuelta por Google
function handleCredentialResponse(response) {
  try {
    const payload = parseJwt(response.credential);
    const userSession = {
      name: payload.name || payload.email.split('@')[0],
      email: payload.email,
      picture: payload.picture || '',
      role: CONFIG.ROLES.SUPER_ADMIN
    };

    saveUserSession(userSession);
  } catch (err) {
    showLoginError('Error al autenticar con Google. Intente nuevamente.');
  }
}

// Login simulado para entorno local o desarrollo
function simulateDevLogin() {
  const devUser = {
    name: 'Robert Palencia',
    email: 'robertpalencia2020@gmail.com',
    picture: 'https://lh3.googleusercontent.com/a/default-user',
    role: CONFIG.ROLES.SUPER_ADMIN
  };
  saveUserSession(devUser);
}

// Decodificar Token JWT
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

// Guardar sesión y actualizar UI
function saveUserSession(user) {
  localStorage.setItem(CONFIG.STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
  applyUserSession(user);
}

// Verificar si existe sesión guardada
function checkAuthSession() {
  const savedUser = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_SESSION);
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      applyUserSession(user);
    } catch (e) {
      localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_SESSION);
      showLoginScreen();
    }
  } else {
    showLoginScreen();
  }
}

// Mostrar interfaz principal y cargar datos del usuario
function applyUserSession(user) {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');

  const nameEl = document.getElementById('user-name');
  const roleEl = document.getElementById('user-role');
  const avatarEl = document.getElementById('user-avatar');

  if (nameEl) nameEl.textContent = user.name;
  if (roleEl) roleEl.textContent = user.role || CONFIG.ROLES.COLLABORATOR;

  if (avatarEl) {
    if (user.picture && !user.picture.includes('default-user')) {
      avatarEl.src = user.picture;
      avatarEl.classList.remove('hidden');
    } else {
      avatarEl.classList.add('hidden');
    }
  }

  // Notificar a app.js para refrescar datos
  if (typeof initTasksModule === 'function') {
    initTasksModule();
  }
}

function showLoginScreen() {
  document.getElementById('app-screen').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
}

// Configurar cierre de sesión
function setupLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_SESSION);
      showLoginScreen();
    });
  }
}

function showLoginError(msg) {
  const errorEl = document.getElementById('login-error');
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
  }
}