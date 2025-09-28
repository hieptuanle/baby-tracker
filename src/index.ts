import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { authMiddleware, AuthContext } from './middleware/auth';
import { loggingMiddleware, errorHandler } from './middleware/logging';
import authRoutes from './routes/auth';
import pregnancyRoutes from './routes/pregnancy';
import { loginPage, registerPage, dashboardPage, homePage } from './views/pages';
import { notFoundPage, unauthorizedPage } from './views/errors';
import { pregnancyModel } from './db/database';
import { calculateGestationalAge } from './utils/pregnancy';
import logger from './utils/logger';

const app = new Hono<{ Variables: AuthContext }>();

// Error handler
app.onError(errorHandler);

// Logging middleware (must be first)
app.use('*', loggingMiddleware);

// Serve static files
app.use('/static/*', serveStatic({ root: './' }));
app.use('/manifest.json', serveStatic({ path: './public/manifest.json' }));
// Service worker disabled due to caching issues
// app.use('/service-worker.js', serveStatic({ path: './public/service-worker.js' }));
app.use('/icons/*', serveStatic({ root: './public' }));

// Apply auth middleware globally
app.use('*', authMiddleware);

// API routes
app.route('/api/auth', authRoutes);
app.route('/api', pregnancyRoutes);

// Page routes
app.get('/', (c) => {
  const user = c.get('user');
  if (user) {
    return c.redirect('/dashboard');
  }
  return c.html(homePage());
});

app.get('/login', (c) => {
  const user = c.get('user');
  if (user) {
    return c.redirect('/dashboard');
  }
  return c.html(loginPage());
});

app.get('/register', (c) => {
  const user = c.get('user');
  if (user) {
    return c.redirect('/dashboard');
  }
  return c.html(registerPage());
});

app.get('/dashboard', (c) => {
  const user = c.get('user');
  if (!user) {
    return c.html(unauthorizedPage(), 401);
  }

  const pregnancy = pregnancyModel.findByUserId(user.id);
  let pregnancyWithAge = null;

  if (pregnancy) {
    const gestationalAge = calculateGestationalAge(pregnancy.expected_delivery_date);
    pregnancyWithAge = {
      ...pregnancy,
      gestationalAge
    };
  }

  return c.html(dashboardPage(user, pregnancyWithAge));
});

// 404 handler (must be last)
app.notFound((c) => {
  logger.warn(`404 Not Found: ${c.req.url}`);
  return c.html(notFoundPage(), 404);
});

const port = parseInt(process.env.PORT || '3000');
logger.info(`Starting server on port ${port}`);

serve({
  fetch: app.fetch,
  port
});