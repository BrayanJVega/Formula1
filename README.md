# F1 Predictor & Race Simulator

A modern web platform for Formula 1 predictions, race simulation, fantasy leagues, and competitive rankings.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, Zustand |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL 16 |
| Auth | JWT + Refresh Tokens |
| Charts | Recharts, Chart.js |
| Testing | Vitest, Playwright |

## Architecture

**Clean Architecture** with SOLID principles:
- **Core**: Entities, Use Cases, Repository interfaces
- **Infrastructure**: PostgreSQL, JWT, Bcrypt implementations
- **Presentation**: Express controllers, middleware, routes

## Project Structure

```
f1-predictor/
├── client/          # React frontend
│   ├── src/
│   │   ├── api/     # HTTP client & API services
│   │   ├── components/  # UI & feature components
│   │   ├── hooks/   # Custom React hooks
│   │   ├── store/   # Zustand state management
│   │   ├── pages/   # Route pages
│   │   ├── router/  # React Router configuration
│   │   └── types/   # TypeScript type definitions
├── server/          # Express backend
│   ├── src/
│   │   ├── core/    # Business logic (entities, use cases, repositories)
│   │   ├── infrastructure/  # External implementations
│   │   ├── presentation/    # API layer (controllers, routes, middleware)
│   │   └── shared/  # Cross-cutting utilities
├── database/        # SQL schema, migrations, seeds
├── docs/            # Documentation
├── tests/           # Test suites
└── scripts/         # Automation scripts
```

## Features

### Core
- Authentication (register, login, JWT refresh, roles)
- Driver & team profiles with full statistics
- Circuit database with historical data
- Race calendar with timezone support

### Predictions
- Qualifying predictions (pole, top 3, top 10)
- Race predictions (winner, podium, top 10, fastest lap)
- Safety car & red flag predictions
- Configurable scoring system

### Simulation Engine
- Lap-by-lap race simulation
- Weather dynamics (rain, temperature changes)
- Tire degradation and pit strategy
- Safety car and incident modeling
- Full season simulation with what-if scenarios

### Fantasy League
- Budget management (100M cap)
- Driver selection & transfers
- Dynamic driver pricing
- Private leagues with friends

### Gamification
- 13-level progression system
- 15+ achievements
- Streak tracking
- XP and rewards

### Rankings
- Global, weekly, country, and league rankings
- Position change tracking
- Historical performance

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- npm

### Development

```bash
# 1. Clone and install
npm install

# 2. Start database
docker-compose up -d postgres

# 3. Seed database
npm run db:migrate
npm run db:seed

# 4. Start dev servers
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

## API Documentation

See [docs/API.md](docs/API.md) for complete API reference.

## Testing

```bash
# Unit & Integration tests
npm test

# E2E tests
npm run test:e2e
```

## License

MIT
