# Baby Tracker

A Progressive Web Application (PWA) for tracking pregnancy journey with gestational age calculation.

## Features

- User authentication (register/login)
- Track pregnancy information (Expected Delivery Date or Last Menstrual Period)
- Calculate and display gestational age in weeks and days
- Show days remaining until delivery
- Display current trimester
- Secure session management with JWT
- PWA support with offline capabilities

## Tech Stack

- Hono (Web framework)
- TypeScript
- SQLite (Better-SQLite3)
- JWT Authentication
- PM2 (Process Manager)
- Winston (Logging)

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

The application can be deployed using PM2:

```bash
# Start production server
pnpm pm2:start

# View logs
pnpm pm2:logs

# Check status
pnpm pm2:status
```

## License

ISC