document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});

let currentUser = null;

function initAuth() {
  const loginBtn = document.getElementById('google-login-btn');
  const logoutBtn = document.getElementById('logout-btn');

  // Verificar si ya existe una sesión guardada en el navegador
  checkExistingSession();

  // Escuchar evento de Login
  loginBtn.addEventListener('click', handleGoogleLogin);

  // Escuchar evento de Logout
  logoutBtn.addEventListener('click', handleLogout);
}

// Handler de Inicio de Sesión
function handleGoogleLogin() {
  const errorDiv = document.getElementById('login-error');
  errorDiv.classList.add('hidden');

  // Si tenemos configurado el Client ID oficial de Google
  if (window.google && CONFIG.GOOGLE_CLIENT_ID && !CONFIG.GOOGLE_CLIENT_ID.includes('TU_GOOGLE_CLIENT_ID')) {
    google.accounts.id.initialize({
      client_id: CONFIG.GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse
    });
    google.accounts.id.prompt(); // Muestra el pop-up nativo de Google
  } else {
    // Modo de desarrollo/fallback interactivo si aún no has configurado Google Cloud Console
    const userEmail = prompt("Ingresa tu correo electrónico para ingresar a Comovamos:");
    if (!userEmail) return;

    verifyUserWithBackend({
      email: userEmail.trim().toLowerCase(),
      name: userEmail.split('@')[0].replace('.', ' '),
      picture: ''
    });
  }
}

// Procesar credencial decodificada de Google GIS
function handleCredentialResponse(response) {
  try {
    const payload = parseJwt(response.credential);
    verifyUserWithBackend({
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    });
  } catch (error) {
    showLoginError("Error al procesar las credenciales de Google.");
  }
}

// Validar usuario contra la base de datos en Google Sheets (Apps Script)
async function verifyUserWithBackend(googleUser) {
  const loginBtn = document.getElementById('google-login-btn');
  loginBtn.disabled = true;
  loginBtn.querySelector('span').textContent = 'Verificando acceso...';

  try {
    // Si la API_URL aún no está configurada, permitimos acceso temporal para desarrollo
    if (CONFIG.API_URL.includes('TU_SCRIPT_ID')) {
      console.warn("API_URL no configurada. Iniciando sesión en modo desarrollo.");
      const mockUser = {
        id: 'usr_dev',
        email: googleUser.email,
        name: googleUser.name || 'Usuario Dev',
        role: googleUser.email.includes('admin') ? CONFIG.ROLES.SUPER_ADMIN : CONFIG.ROLES.COLLABORATOR,
        avatar_url: googleUser.picture || ''
      };
      completeLogin(mockUser);
      return;
    }

    // Petición al backend en GAS
    const response = await fetch(`${CONFIG.API_URL}?action=getUsers`);
    const result = await response.json();

    if (result.status === 'success') {
      const usersList = result.data;
      // Buscar si el correo está registrado en la hoja Users
      const authorizedUser = usersList.find(u => u.email.toLowerCase() === googleUser.email.toLowerCase());

      if (authorizedUser) {
        completeLogin({
          id: authorizedUser.id,
          email: authorizedUser.email,
          name: authorizedUser.name,
          role: authorizedUser.role,
          avatar_url: googleUser.picture || authorizedUser.avatar_url
        });
      } else {
        showLoginError(`El correo ${googleUser.email} no está autorizado. Contacta al Administrador de Comovamos.`);
      }
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    showLoginError("Error de conexión con el servidor. Revisa tu URL de Apps Script.");
    console.error("Auth Error:", error);
  } finally {
    loginBtn.disabled = false;
    loginBtn.querySelector('span').textContent = 'Iniciar sesión con Google';
  }
}

// Finalizar Login y transición de pantalla
function completeLogin(userData) {
  currentUser = userData;
  localStorage.setItem('comovamos_session', JSON.stringify(userData));

  // Inyectar datos en el Navbar
  document.getElementById('user-name').textContent = userData.name;
  document.getElementById('user-role').textContent = userData.role;
  
  const avatarImg = document.getElementById('user-avatar');
  if (userData.avatar_url) {
    avatarImg.src = userData.avatar_url;
    avatarImg.classList.remove('hidden');
  } else {
    avatarImg.classList.add('hidden');
  }

  // Transición visual: Ocultar Login, Mostrar Dashboard App
  document.getElementById('login-screen').classList.remove('active');
  document.getElementById('login-screen').classList.add('hidden');
  
  document.getElementById('app-screen').classList.remove('hidden');
  document.getElementById('app-screen').classList.add('active');

  // Disparar evento para cargar datos del dashboard
  if (window.onUserLoggedIn) {
    window.onUserLoggedIn(currentUser);
  }
}

// Cierre de Sesión
function handleLogout() {
  localStorage.removeItem('comovamos_session');
  currentUser = null;

  document.getElementById('app-screen').classList.remove('active');
  document.getElementById('app-screen').classList.add('hidden');

  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-screen').classList.add('active');
}

// Verificar si hay sesión activa guardada
function checkExistingSession() {
  const savedSession = localStorage.getItem('comovamos_session');
  if (savedSession) {
    try {
      const userData = JSON.parse(savedSession);
      completeLogin(userData);
    } catch (e) {
      localStorage.removeItem('comovamos_session');
    }
  }
}

function showLoginError(msg) {
  const errorDiv = document.getElementById('login-error');
  errorDiv.textContent = msg;
  errorDiv.classList.remove('hidden');
}

// Utilidad para decodificar JWT Tokens de Google
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}