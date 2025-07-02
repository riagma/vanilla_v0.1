import { authManager } from '../servicios/authManager.js';

export class LoginLocal {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.isRegistering = false;
    this.unsubscribe = null;
    
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    
    // Suscribirse a cambios de estado
    this.unsubscribe = authManager.subscribe((state) => {
      this.updateUI(state);
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="card mx-auto" style="max-width: 400px;">
        <div class="card-header">
          <h4 class="card-title mb-0" id="loginTitle">Iniciar Sesión</h4>
        </div>
        <div class="card-body">
          <div id="errorAlert" class="alert alert-danger d-none"></div>
          
          <form id="loginForm">
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre de usuario</label>
              <input type="text" class="form-control" id="nombre" name="nombre" required>
            </div>
            
            <div class="mb-3">
              <label for="password" class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="password" name="password" required>
            </div>
            
            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-primary" id="submitBtn">
                <span id="submitText">Iniciar Sesión</span>
                <span class="spinner-border spinner-border-sm d-none" id="loadingSpinner"></span>
              </button>
              
              <button type="button" class="btn btn-link" id="toggleMode">
                ¿No tienes cuenta? Regístrate
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const form = this.container.querySelector('#loginForm');
    const toggleBtn = this.container.querySelector('#toggleMode');
    
    form.addEventListener('submit', (e) => this.handleSubmit(e));
    toggleBtn.addEventListener('click', () => this.toggleMode());
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const nombre = formData.get('nombre');
    const password = formData.get('password');
    
    const resultado = this.isRegistering 
      ? await authManager.registrarLocal(nombre, password)
      : await authManager.loginLocal(nombre, password);
    
    if (resultado.success) {
      // Limpiar formulario
      e.target.reset();
      // El resto se maneja en updateUI a través del suscriptor
    }
  }

  toggleMode() {
    this.isRegistering = !this.isRegistering;
    
    const title = this.container.querySelector('#loginTitle');
    const submitText = this.container.querySelector('#submitText');
    const toggleBtn = this.container.querySelector('#toggleMode');
    
    if (this.isRegistering) {
      title.textContent = 'Registrarse';
      submitText.textContent = 'Registrarse';
      toggleBtn.textContent = '¿Ya tienes cuenta? Inicia sesión';
    } else {
      title.textContent = 'Iniciar Sesión';
      submitText.textContent = 'Iniciar Sesión';
      toggleBtn.textContent = '¿No tienes cuenta? Regístrate';
    }
    
    // Limpiar errores
    authManager.clearError();
  }

  updateUI(state) {
    const errorAlert = this.container.querySelector('#errorAlert');
    const submitBtn = this.container.querySelector('#submitBtn');
    const loadingSpinner = this.container.querySelector('#loadingSpinner');
    const submitText = this.container.querySelector('#submitText');
    
    // Mostrar/ocultar errores
    if (state.error) {
      errorAlert.textContent = state.error;
      errorAlert.classList.remove('d-none');
    } else {
      errorAlert.classList.add('d-none');
    }
    
    // Mostrar/ocultar loading
    if (state.loading) {
      submitBtn.disabled = true;
      loadingSpinner.classList.remove('d-none');
      submitText.classList.add('d-none');
    } else {
      submitBtn.disabled = false;
      loadingSpinner.classList.add('d-none');
      submitText.classList.remove('d-none');
    }
    
    // Si está autenticado, ocultar el formulario
    if (state.isAuthenticated) {
      this.container.innerHTML = `
        <div class="alert alert-success">
          <h5>¡Bienvenido, ${state.user.nombre}!</h5>
          <p>Has iniciado sesión correctamente.</p>
          <p>Elecciones locales: ${state.eleccionesLocales.length}</p>
          <button class="btn btn-outline-danger" onclick="authManager.logout()">
            Cerrar Sesión
          </button>
        </div>
      `;
    }
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}