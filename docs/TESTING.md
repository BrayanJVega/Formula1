# Testing Documentation

## Running Tests

### Unit Tests (Server)

```bash
# Run all unit tests
npm test

# Run tests in watch mode (development)
npm run test:watch --workspace=server

# Run specific test file
npx vitest run tests/unit/scoring-engine.test.ts

# Run with coverage
npx vitest run --coverage
```

### E2E Tests (Client)

```bash
# Install Playwright browsers first
npx playwright install

# Run E2E tests
npm run test:e2e

# Run specific E2E test file
npx playwright test tests/e2e/login.spec.ts

# Run with UI mode
npx playwright test --ui
```

### All Tests

```bash
# Run server tests
npm run test --workspace=server

# Run client E2E tests
npm run test:e2e --workspace=client
```

## Test Structure

```
tests/
├── setup.ts                  # Global vitest setup (beforeAll/afterAll)
├── unit/                     # Server unit tests
│   ├── scoring-engine.test.ts    # ScoringEngine tests
│   ├── ai-prediction.test.ts     # AIPredictionService tests
│   ├── level-service.test.ts     # LevelService tests
│   ├── weather-engine.test.ts    # WeatherEngine tests
│   ├── dynamic-pricing.test.ts   # DynamicPricingService tests
│   └── scoring-config.test.ts    # Scoring configuration tests
├── integration/              # Server integration tests
│   └── auth.test.ts              # Auth flows (register, login, refresh, etc.)
├── client/                   # Client unit tests
│   └── store.test.ts             # Zustand store tests
└── e2e/                      # Playwright E2E tests
    ├── login.spec.ts             # Login flow
    └── navigation.spec.ts        # Navigation flow
```

## Test Conventions

- **Unit tests**: Mock external dependencies (database, APIs). Test business logic in isolation.
- **Integration tests**: Test real request/response cycles through Express routes. Mock database layer.
- **Client tests**: Test Zustand stores in isolation. Mock API modules.
- **E2E tests**: Use Playwright to test full user flows in a browser.

## Adding New Tests

1. **Server unit test**: Create `tests/unit/<name>.test.ts`. Import the service class directly. Mock any database calls using `vi.mock()`.

2. **Server integration test**: Create `tests/integration/<name>.test.ts`. Create a test Express app and mount routes. Use supertest or fetch for HTTP calls.

3. **Client test**: Create `tests/client/<name>.test.ts`. Import the Zustand store. Mock the API module it depends on.

4. **E2E test**: Create `tests/e2e/<name>.spec.ts`. Use Playwright's `test` and `expect` APIs.

## Mocking

```typescript
// Mock database queries
vi.mock('../../server/src/config/database.js', () => ({
  query: vi.fn(),
  queryOne: vi.fn(),
}));

// Mock API modules (client tests)
vi.mock('../../client/src/api/auth.api', () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
  },
}));
```

## Vitest Configuration

Vitest is configured per-workspace. The server workspace uses vitest directly with TypeScript support via `tsx`. Tests use the `tests/` directory at the project root.
