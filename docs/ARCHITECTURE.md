# Architecture Documentation

## Clean Architecture Layers

### Core Layer

The core contains pure business logic with zero external dependencies:

```
core/
├── entities/         # Domain objects (User, Driver, Race, Prediction, etc.)
├── repositories/     # Interface contracts for data access
└── useCases/         # Business operations (RegisterUseCase, SimulateRaceUseCase, etc.)
```

**Entities** are plain TypeScript classes with validation in constructors. They use `crypto.randomUUID()` for ID generation.

**Use Cases** follow the Command pattern — each has a single `execute()` method. They depend on repository interfaces (injected via constructor), never on concrete implementations.

### Infrastructure Layer

Implements interfaces defined in the core layer:

```
infrastructure/
├── persistence/      # PostgreSQL implementations of repositories
├── auth/             # JWT, Bcrypt, Email providers
└── services/         # External service integrations (Weather, Notifications)
```

### Presentation Layer

Express-based HTTP API:

```
presentation/
├── controllers/      # Request handlers
├── routes/           # Route definitions + DI wiring
├── middleware/       # Auth, validation, error handling, sanitization
├── validators/       # Zod schemas for request validation
└── dtos/             # Data Transfer Objects (API contracts)
```

## Data Flow

```
HTTP Request
  → Middleware (auth, rate-limit, sanitize)
  → Controller (parse + validate + format)
  → Use Case (business logic + orchestration)
  → Repository (data access interface)
  → PostgreSQL
  → Response flows back through layers
```

## Dependency Injection

Dependencies are wired manually at the route level (no DI framework needed for this scale):

```typescript
const userRepo = new UserRepository();
const bcrypt = new BcryptProvider();
const jwt = new JwtProvider();
const useCase = new RegisterUseCase(userRepo, bcrypt, jwt);
const controller = new AuthController(useCase, ...);
```

## Database Design

The database uses:
- **UUID** primary keys (via `uuid-ossp` extension)
- **JSONB** for flexible data (weather forecasts, achievement criteria, simulation parameters)
- **Array columns** for top 3/10 predictions (UUID[])
- **RLS policies** for multi-tenant data isolation
- **Composite indexes** on frequent query patterns
- **Triggers** for automatic `updated_at` column updates

## Simulation Engine Architecture

```
SimulationEngine
├── QualifyingSimulator    → Q1, Q2, Q3 elimination
├── RaceSimulator          → Lap-by-lap loop
├── WeatherEngine          → Dynamic weather changes
├── TyreModel              → Degradation, compounds
├── IncidentEngine         → Crashes, mechanical failures
├── SafetyCarEngine        → SC/VSC deployment
├── StrategyEngine         → Pit windows, undercut/overcut
└── OvertakingModel        → DRS, positioning
```

## Frontend State Management

Zustand stores are organized by domain:

```typescript
auth.store.ts      → User auth state
race.store.ts      → Current race data
prediction.store.ts → Prediction submissions
fantasy.store.ts   → Fantasy team management
simulation.store.ts → Simulation state
ui.store.ts         → UI preferences
notification.store.ts → Toast/notification queue
```
