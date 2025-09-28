export const layout = (title: string, content: string, user?: { username: string }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="Baby Tracker">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#667eea">
  <link rel="manifest" href="/manifest.json">
  <link rel="apple-touch-icon" href="/icons/icon-152x152.svg">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background: rgba(255, 255, 255, 0.95);
      padding: 1rem 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
    nav h1 {
      color: #667eea;
      font-size: 1.5rem;
    }
    nav .nav-links {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    nav a, nav button {
      color: #333;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      transition: background-color 0.3s;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 1rem;
    }
    nav a:hover, nav button:hover {
      background-color: rgba(102, 126, 234, 0.1);
    }
    .container {
      flex: 1;
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 2rem;
      width: 100%;
    }
    .card {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
    }
    input[type="text"],
    input[type="password"],
    input[type="date"] {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 5px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }
    input:focus {
      outline: none;
      border-color: #667eea;
    }
    button[type="submit"] {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
      transition: transform 0.2s;
    }
    button[type="submit"]:hover {
      transform: translateY(-2px);
    }
    .alert {
      padding: 1rem;
      border-radius: 5px;
      margin-bottom: 1rem;
    }
    .alert-error {
      background-color: #fee;
      color: #c33;
      border: 1px solid #fcc;
    }
    .alert-success {
      background-color: #efe;
      color: #3c3;
      border: 1px solid #cfc;
    }
    .gestational-info {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 10px;
      text-align: center;
      margin-bottom: 1.5rem;
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
    }
    .gestational-info h2 {
      font-size: clamp(2rem, 5vw, 3rem);
      margin-bottom: 0.5rem;
      font-weight: 700;
    }
    .gestational-info p {
      font-size: clamp(1rem, 3vw, 1.2rem);
      opacity: 0.9;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr));
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .info-item {
      background: rgba(255, 255, 255, 0.15);
      padding: 0.75rem;
      border-radius: 5px;
      backdrop-filter: blur(10px);
    }
    .info-item h3 {
      font-size: clamp(0.75rem, 2vw, 0.9rem);
      opacity: 0.9;
      margin-bottom: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-item p {
      font-size: clamp(1.25rem, 3.5vw, 1.5rem);
      font-weight: bold;
    }
    @media (max-width: 600px) {
      .card {
        padding: 1.5rem;
      }
      .container {
        padding: 0 1rem;
        margin: 1rem auto;
      }
      nav {
        flex-direction: column;
        gap: 0.5rem;
      }
      nav h1 {
        font-size: 1.25rem;
      }
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <header>
    <nav>
      <h1>🍼 Baby Tracker</h1>
      <div class="nav-links">
        ${user ? `
          <span>Welcome, ${user.username}!</span>
          <a href="/dashboard">Dashboard</a>
          <form action="/api/auth/logout" method="POST" style="display: inline;">
            <button type="submit">Logout</button>
          </form>
        ` : `
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        `}
      </div>
    </nav>
  </header>
  <main class="container">
    ${content}
  </main>
  <script>
    // Unregister all service workers and clear cache
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister();
          console.log('ServiceWorker unregistered');
        }
      });

      // Clear all caches
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
            console.log('Cache cleared:', name);
          });
        });
      }
    }
  </script>
</body>
</html>
`;