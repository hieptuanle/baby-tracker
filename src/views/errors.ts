export const notFoundPage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Page Not Found</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 20px;
    }
    .error-container {
      background: white;
      border-radius: 10px;
      padding: 2rem;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    .error-code {
      font-size: 6rem;
      font-weight: bold;
      color: #667eea;
      margin: 0;
      line-height: 1;
    }
    .error-message {
      font-size: 1.5rem;
      color: #333;
      margin: 1rem 0;
    }
    .error-description {
      color: #666;
      margin: 1rem 0;
    }
    .back-link {
      display: inline-block;
      margin-top: 1.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 5px;
      transition: transform 0.2s;
    }
    .back-link:hover {
      transform: translateY(-2px);
    }
    .baby-icon {
      font-size: 3rem;
      margin: 1rem 0;
    }
  </style>
</head>
<body>
  <div class="error-container">
    <div class="baby-icon">👶</div>
    <h1 class="error-code">404</h1>
    <p class="error-message">Page Not Found</p>
    <p class="error-description">The page you're looking for seems to have wandered off.</p>
    <a href="/" class="back-link">Go Home</a>
  </div>
</body>
</html>
`;

export const unauthorizedPage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>401 - Unauthorized</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 20px;
    }
    .error-container {
      background: white;
      border-radius: 10px;
      padding: 2rem;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    .error-code {
      font-size: 6rem;
      font-weight: bold;
      color: #667eea;
      margin: 0;
      line-height: 1;
    }
    .error-message {
      font-size: 1.5rem;
      color: #333;
      margin: 1rem 0;
    }
    .error-description {
      color: #666;
      margin: 1rem 0;
    }
    .back-link {
      display: inline-block;
      margin: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 5px;
      transition: transform 0.2s;
    }
    .back-link:hover {
      transform: translateY(-2px);
    }
    .lock-icon {
      font-size: 3rem;
      margin: 1rem 0;
    }
  </style>
</head>
<body>
  <div class="error-container">
    <div class="lock-icon">🔒</div>
    <h1 class="error-code">401</h1>
    <p class="error-message">Unauthorized</p>
    <p class="error-description">You need to be logged in to access this page.</p>
    <a href="/login" class="back-link">Login</a>
    <a href="/register" class="back-link">Register</a>
  </div>
</body>
</html>
`;