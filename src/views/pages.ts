import { html } from 'hono/html';
import { layout } from './layout';
import { GestationalAge } from '../utils/pregnancy';

export const loginPage = (error?: string) => {
  const content = html`
    <div class="card">
      <h2>Login</h2>
      ${error ? `<div class="alert alert-error">${error}</div>` : ''}
      <form action="/api/auth/login" method="POST" onsubmit="return handleLogin(event)">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">Login</button>
      </form>
      <p style="margin-top: 1rem;">Don't have an account? <a href="/register">Register here</a></p>
    </div>
    <script>
      async function handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        console.log('Attempting login...');

        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'same-origin'
          });

          const result = await response.json();
          console.log('Login response:', response.status, result);

          if (response.ok && result.success) {
            console.log('Login successful, redirecting to dashboard...');
            // Use replace to avoid back button issues
            window.location.replace('/dashboard');
          } else {
            console.error('Login failed:', result);
            alert(result.error || 'Login failed');
          }
        } catch (error) {
          console.error('Login error:', error);
          alert('Login failed: ' + error.message);
        }
        return false;
      }
    </script>
  `;
  return layout('Login', content);
};

export const registerPage = (error?: string) => {
  const content = html`
    <div class="card">
      <h2>Register</h2>
      ${error ? `<div class="alert alert-error">${error}</div>` : ''}
      <form action="/api/auth/register" method="POST" onsubmit="return handleRegister(event)">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required minlength="6">
        </div>
        <button type="submit">Register</button>
      </form>
      <p style="margin-top: 1rem;">Already have an account? <a href="/login">Login here</a></p>
    </div>
    <script>
      async function handleRegister(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        console.log('Attempting registration...');

        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'same-origin'
          });

          const result = await response.json();
          console.log('Registration response:', response.status, result);

          if (response.ok && result.success) {
            console.log('Registration successful, redirecting to dashboard...');
            window.location.replace('/dashboard');
          } else {
            console.error('Registration failed:', result);
            alert(result.error || 'Registration failed');
          }
        } catch (error) {
          console.error('Registration error:', error);
          alert('Registration failed: ' + error.message);
        }
        return false;
      }
    </script>
  `;
  return layout('Register', content);
};

export const dashboardPage = (user: { username: string }, pregnancy?: any) => {
  const age = pregnancy && pregnancy.gestationalAge as GestationalAge;
  const edd = pregnancy && new Date(pregnancy.expected_delivery_date);
  const daysRemaining = pregnancy && Math.floor((edd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const content = html`
  ${pregnancy && pregnancy.gestationalAge ? html`
      <div class="gestational-info">
        <h2>${age.weeks} weeks, ${age.days} days</h2>
        <p>Current Gestational Age</p>
        <div class="info-grid">
          <div class="info-item">
            <h3>Expected Delivery</h3>
            <p>${edd.toLocaleDateString()}</p>
          </div>
          <div class="info-item">
            <h3>Days Remaining</h3>
            <p>${daysRemaining}</p>
          </div>
          <div class="info-item">
            <h3>Trimester</h3>
            <p>${age.weeks < 13 ? 'First' : age.weeks < 27 ? 'Second' : 'Third'}</p>
          </div>
        </div>
      </div>
    ` : html`
      <div class="card" style="background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%); text-align: center; padding: 2rem;">
        <h2 style="color: #2d3436; margin-bottom: 1rem;">👶 Welcome to Baby Tracker!</h2>
        <p style="color: #636e72; font-size: 1.1rem;">Enter your pregnancy information below to start tracking your journey.</p>
      </div>
    `}
    <div class="card">
      <h2>${pregnancy ? 'Update' : 'Enter'} Pregnancy Information</h2>
      <form onsubmit="return handlePregnancySubmit(event)">
        <div class="form-group">
          <label for="edd">Expected Delivery Date</label>
          <input type="date" id="edd" name="expectedDeliveryDate"
            ${pregnancy ? `value="${pregnancy.expected_delivery_date.split('T')[0]}"` : ''}>
        </div>
        <p style="text-align: center; margin: 1rem 0;">OR</p>
        <div class="form-group">
          <label for="lmp">Last Menstrual Period (First Day)</label>
          <input type="date" id="lmp" name="lastMenstrualPeriod"
            ${pregnancy?.last_menstrual_period ? `value="${pregnancy.last_menstrual_period.split('T')[0]}"` : ''}>
        </div>
        <button type="submit">${pregnancy ? 'Update' : 'Save'} Information</button>
      </form>
    </div>

    <script>
      async function handlePregnancySubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Remove empty values
        Object.keys(data).forEach(key => {
          if (!data[key]) delete data[key];
        });

        if (!data.expectedDeliveryDate && !data.lastMenstrualPeriod) {
          alert('Please enter either Expected Delivery Date or Last Menstrual Period');
          return false;
        }

        try {
          const response = await fetch('/api/pregnancy', {
            method: '${pregnancy ? 'PUT' : 'POST'}',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });

          const result = await response.json();
          if (response.ok) {
            window.location.reload();
          } else {
            alert(result.error || 'Failed to save pregnancy information');
          }
        } catch (error) {
          alert('Failed to save: ' + error.message);
        }
        return false;
      }

      async function handleLogout() {
        try {
          const response = await fetch('/api/auth/logout', { method: 'POST' });
          if (response.ok) {
            window.location.href = '/login';
          }
        } catch (error) {
          console.error('Logout failed:', error);
        }
      }
    </script>
  `;

  return layout('Dashboard', html`${content}`, user);
};

export const homePage = () => {
  const content = html`
    <div class="card" style="text-align: center;">
      <h1 style="font-size: 3rem; margin-bottom: 1rem;">🍼 Baby Tracker</h1>
      <p style="font-size: 1.2rem; margin-bottom: 2rem;">Track your pregnancy journey with ease</p>
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <a href="/login" style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 2rem;
          text-decoration: none;
          border-radius: 5px;
        ">Login</a>
        <a href="/register" style="
          background: white;
          color: #667eea;
          padding: 1rem 2rem;
          text-decoration: none;
          border-radius: 5px;
          border: 2px solid #667eea;
        ">Register</a>
      </div>
    </div>
  `;
  return layout('Baby Tracker', content);
};