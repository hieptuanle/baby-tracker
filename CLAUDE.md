# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
```bash
pnpm dev                 # Start development server with hot reloading (port 3000)
pnpm build              # Compile TypeScript to JavaScript in dist/
pnpm typecheck          # Type check without emitting files
```

### Production Deployment
```bash
pnpm build              # Build before deployment
pnpm pm2:start          # Start production server with PM2 (port 3112)
pnpm pm2:restart        # Restart the production server
pnpm pm2:logs           # View application logs
pnpm pm2:status         # Check PM2 process status
```

### Database Management
The application uses SQLite with better-sqlite3. Database file is `baby-tracker.db` in the project root.
- Schema initialization happens automatically on first run
- Database uses WAL mode for better performance
- Tables: users, pregnancies, sessions

## Architecture Overview

### Technology Stack
- **Framework**: Hono (lightweight web framework)
- **Database**: SQLite with better-sqlite3
- **Authentication**: Session-based with crypto tokens (not JWT)
- **Templating**: Server-side HTML generation with template literals
- **Package Manager**: pnpm@10.17.1
- **Process Manager**: PM2 for production

### Project Structure
```
src/
├── index.ts              # Main application entry, middleware pipeline
├── db/
│   ├── database.ts      # Database connection and model repositories
│   └── schema.sql       # Database schema definition
├── middleware/
│   ├── auth.ts          # Authentication middleware and session management
│   └── logging.ts       # Request logging and error handling
├── routes/
│   ├── auth.ts          # Auth endpoints (/api/auth/*)
│   └── pregnancy.ts     # Pregnancy CRUD endpoints (/api/pregnancy)
├── views/
│   ├── layout.ts        # HTML layout wrapper with PWA meta tags
│   ├── pages.ts         # Page templates (login, register, dashboard)
│   └── errors.ts        # Error page templates
└── utils/
    ├── logger.ts        # Winston logger configuration
    └── pregnancy.ts     # Gestational age calculations
```

### Key Architectural Patterns

1. **Middleware Pipeline**: Linear middleware execution order is critical:
   - Error handler → Logging → Static files → Auth → Routes → 404 handler

2. **Authentication Flow**:
   - Session tokens stored in HTTP-only cookies
   - Sessions persist in database with 7-day expiration
   - User context injected via Hono's context system

3. **Database Access**:
   - Repository pattern with typed model objects (userModel, pregnancyModel, sessionModel)
   - All queries use prepared statements
   - Single database connection instance

4. **Template System**:
   - Server-side rendering with template literals
   - Client-side JavaScript for form submissions and API calls
   - PWA manifest and mobile-optimized viewport

### Important Implementation Details

1. **Session Management**:
   - Sessions use crypto.randomBytes(32) tokens, not JWT
   - Cookie name: `session_token`
   - Automatic HTTPS detection for secure cookie flags

2. **Password Security**:
   - bcrypt with 10 salt rounds
   - Passwords never logged or exposed in responses

3. **Pregnancy Calculations**:
   - Gestational age calculated from Expected Delivery Date (EDD)
   - EDD can be calculated from Last Menstrual Period (LMP) + 280 days
   - One pregnancy record per user

4. **Error Handling**:
   - Global error boundary with environment-aware responses
   - Structured logging with Winston
   - Slow request detection (>1000ms logged as warnings)

5. **PM2 Configuration**:
   - Production runs on port 3112 in cluster mode
   - Auto-restart at 2 AM daily
   - Memory limit: 500MB

### Development Workflow

1. Database changes require updating `src/db/schema.sql` and `src/db/database.ts`
2. New routes should be added to route files and mounted in `src/index.ts`
3. HTML templates go in `src/views/` using the existing layout wrapper
4. All API endpoints should return JSON with consistent error format: `{ error: string }`
5. Client-side form handling should use the existing patterns in `src/views/pages.ts`