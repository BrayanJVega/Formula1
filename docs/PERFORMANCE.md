# Performance Optimization Guide

## Database Index Optimization

### Current Indexes

Key indexes are defined in `database/schema.sql`:

```sql
-- Composite indexes for frequent query patterns
CREATE INDEX idx_race_results_driver_season ON race_results(driver_id, race_id);
CREATE INDEX idx_predictions_user_race ON predictions(user_id, race_id);
CREATE INDEX idx_rankings_season_points ON rankings(season_id, total_score DESC);
```

### Recommended Additional Indexes

```sql
-- For leaderboard queries
CREATE INDEX idx_rankings_season_score ON rankings(season_id, total_score DESC, updated_at);

-- For prediction scoring
CREATE INDEX idx_race_results_race_driver ON race_results(race_id, driver_id, finish_position);

-- For user activity feeds
CREATE INDEX idx_xp_transactions_user ON xp_transactions(user_id, created_at DESC);

-- For fantasy market queries
CREATE INDEX idx_driver_market_values_season ON driver_market_values(season_id, current_value DESC);

-- For circuit-based race history
CREATE INDEX idx_races_circuit_status ON races(circuit_id, status, race_date);
```

### Query Analysis

```bash
# Use EXPLAIN ANALYZE to identify slow queries
docker exec -it f1-postgres psql -U f1_app -d f1_predictor -c "EXPLAIN ANALYZE SELECT ..."
```

## API Response Pagination

All list endpoints support pagination with `page` and `limit` query parameters:

```typescript
// Request
GET /api/drivers?page=1&limit=20

// Response
{
  "drivers": [...],
  "total": 156,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

### Pagination Best Practices

- Default page size: 20
- Max page size: 100 (enforced server-side)
- Use cursor-based pagination for real-time feeds
- Always return total count for UI pagination display

## Client-Side Caching Strategies

### API Response Caching

```typescript
// Simple in-memory cache pattern
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}
```

### React Query / SWR (Recommended)

For server state management, consider adding React Query:

```typescript
// Example with TanStack Query
const { data, isLoading } = useQuery({
  queryKey: ['drivers', filters],
  queryFn: () => driversApi.getDrivers(filters),
  staleTime: 5 * 60 * 1000,
  keepPreviousData: true,
});
```

### Local Storage Caching

Cache reference data (drivers, circuits, teams) in localStorage with versioning:

```typescript
const CACHE_VERSION = '1';
const cached = localStorage.getItem(`drivers_${CACHE_VERSION}`);
if (cached) return JSON.parse(cached);
```

## Bundle Size Optimization

### Current Setup

- Vite with code splitting via React Router lazy loading
- Tree-shaking enabled via ES modules
- CSS purging via Tailwind CSS

### Optimization Techniques

1. **Lazy load routes** (already done in `router/`):
```typescript
const DriversPage = lazy(() => import('@/pages/DriversPage'));
```

2. **Dynamic imports for heavy libraries**:
```typescript
const Chart = lazy(() => import('recharts'));
```

3. **Analyze bundle**:
```bash
npx vite build --analyze
# or
npx vite-bundle-visualizer
```

4. **Remove unused dependencies** - audit with `npm audit` and `depcheck`

5. **Image optimization** - use WebP format, lazy load below-fold images

## Lazy Loading Strategies

### Route-Based Splitting

```typescript
// router/index.tsx
const routes = [
  { path: '/drivers', component: lazy(() => import('./pages/Drivers')) },
  { path: '/teams', component: lazy(() => import('./pages/Teams')) },
  { path: '/rankings', component: lazy(() => import('./pages/Rankings')) },
];
```

### Component-Based Splitting

```typescript
const HeavyChart = lazy(() => import('./components/RaceChart'));
const SimulationViewer = lazy(() => import('./components/SimulationViewer'));
```

### Intersection Observer for Below-Fold Content

```typescript
function LazySection({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{visible ? children : <Skeleton />}</div>;
}
```

## Performance Monitoring

### Lighthouse Scores

Target:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 95

### Real User Monitoring

Consider adding:
- Web Vitals tracking (LCP, FID, CLS)
- Error tracking (Sentry)
- API latency monitoring
