import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { sessionModel, userModel } from '../db/database';

export interface AuthContext {
  user?: {
    id: number;
    username: string;
  };
}

export async function authMiddleware(c: Context<{ Variables: AuthContext }>, next: Next) {
  const token = getCookie(c, 'session_token');

  if (token) {
    const session = sessionModel.findByToken(token);
    if (session) {
      const user = userModel.findById(session.user_id);
      if (user) {
        c.set('user', {
          id: user.id,
          username: user.username
        });
      }
    }
  }

  await next();
}

export async function requireAuth(c: Context<{ Variables: AuthContext }>, next: Next) {
  const user = c.get('user');

  if (!user) {
    return c.redirect('/login');
  }

  await next();
}