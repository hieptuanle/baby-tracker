import { Hono } from 'hono';
import bcrypt from 'bcrypt';
import { setCookie, deleteCookie } from 'hono/cookie';
import { userModel, sessionModel } from '../db/database';
import { AuthContext } from '../middleware/auth';
import logger from '../utils/logger';

const authRoutes = new Hono<{ Variables: AuthContext }>();

authRoutes.post('/register', async (c) => {
  const { username, password } = await c.req.json<{ username: string; password: string }>();

  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400);
  }

  if (password.length < 6) {
    return c.json({ error: 'Password must be at least 6 characters' }, 400);
  }

  const existingUser = userModel.findByUsername(username);
  if (existingUser) {
    return c.json({ error: 'Username already exists' }, 409);
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = userModel.create(username, passwordHash);
    const token = sessionModel.create(userId);

    const isHttps = c.req.header('x-forwarded-proto') === 'https' || c.req.url.startsWith('https');

    setCookie(c, 'session_token', token, {
      httpOnly: true,
      secure: isHttps, // Auto-detect HTTPS
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      domain: undefined // Let browser handle domain
    });

    logger.info(`New user registered: ${username} (ID: ${userId})`);
    return c.json({ success: true, userId });
  } catch (error) {
    logger.error('Registration error:', error);
    return c.json({ error: 'Failed to register user' }, 500);
  }
});

authRoutes.post('/login', async (c) => {
  const { username, password } = await c.req.json<{ username: string; password: string }>();

  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400);
  }

  const user = userModel.findByUsername(username);
  if (!user) {
    logger.warn(`Failed login attempt for username: ${username}`);
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    logger.warn(`Invalid password for user: ${username}`);
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const token = sessionModel.create(user.id);

  const isHttps = c.req.header('x-forwarded-proto') === 'https' || c.req.url.startsWith('https');

  setCookie(c, 'session_token', token, {
    httpOnly: true,
    secure: isHttps, // Auto-detect HTTPS
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    domain: undefined // Let browser handle domain
  });

  logger.info(`User logged in: ${username} (ID: ${user.id}), HTTPS: ${isHttps}, Proto: ${c.req.header('x-forwarded-proto')}`);
  return c.json({ success: true, userId: user.id });
});

authRoutes.post('/logout', async (c) => {
  const token = c.req.header('Cookie')?.match(/session_token=([^;]*)/)?.[1];

  if (token) {
    sessionModel.delete(token);
    logger.info(`User logged out (token: ${token.substring(0, 8)}...)`);
  }

  deleteCookie(c, 'session_token');
  return c.json({ success: true });
});

authRoutes.get('/me', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
  }

  return c.json({ user });
});

export default authRoutes;