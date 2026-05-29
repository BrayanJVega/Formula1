import { Card } from '../ui/Card';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { SimulatedDriverResult } from '../../types/simulation.types';

interface LapTimesChartProps {
  results: SimulatedDriverResult[];
  totalLaps: number;
}

const DRIVER_COLORS = [
  '#e10600', '#1e41ff', '#00d2be', '#ff8700', '#98fb98',
  '#ff69b4', '#ffd700', '#a9a9a9', '#4b0082', '#00ced1',
  '#ff4500', '#32cd32', '#8a2be2', '#ff1493', '#00bfff',
  '#adff2f', '#dc143c', '#7b68ee', '#ffdead', '#2e8b57',
];

export function LapTimesChart({ results, totalLaps }: LapTimesChartProps) {
  const lapNumbers = Array.from({ length: totalLaps }, (_, i) => i + 1);

  const chartData = lapNumbers.map(lap => {
    const point: Record<string, number | string> = { lap: `L${lap}` };
    for (const driver of results) {
      if (lap <= driver.lapTimes.length) {
        point[driver.driverName] = Number(driver.lapTimes[lap - 1].toFixed(3));
      }
    }
    return point;
  });

  const topDrivers = results.slice(0, 5);

  return (
    <Card>
      <h3 className="text-lg font-bold text-white mb-4">Progresión de Tiempos por Vuelta</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="lap"
            stroke="#666"
            tick={{ fill: '#999', fontSize: 10 }}
            interval={Math.floor(totalLaps / 10)}
          />
          <YAxis
            reversed
            stroke="#666"
            tick={{ fill: '#999', fontSize: 11 }}
            tickFormatter={(v: number) => v.toFixed(1)}
            domain={['dataMin - 1', 'dataMax + 2']}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: '8px' }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend />
          {topDrivers.map((driver, idx) => (
            <Line
              key={driver.driverId}
              type="monotone"
              dataKey={driver.driverName}
              name={driver.driverName}
              stroke={DRIVER_COLORS[idx % DRIVER_COLORS.length]}
              strokeWidth={1.5}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
