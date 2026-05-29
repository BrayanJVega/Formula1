import { Card } from '../ui/Card';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { SimulatedDriverResult } from '../../types/simulation.types';

interface LapChartProps {
  results: SimulatedDriverResult[];
  totalLaps: number;
}

const DRIVER_COLORS = [
  '#e10600', '#1e41ff', '#00d2be', '#ff8700', '#98fb98',
  '#ff69b4', '#ffd700', '#a9a9a9', '#4b0082', '#00ced1',
  '#ff4500', '#32cd32', '#8a2be2', '#ff1493', '#00bfff',
  '#adff2f', '#dc143c', '#7b68ee', '#ffdead', '#2e8b57',
];

export function LapChart({ results, totalLaps }: LapChartProps) {
  const lapNumbers = Array.from({ length: totalLaps }, (_, i) => i + 1);

  const chartData = lapNumbers.map(lap => {
    const point: Record<string, number> = { lap };
    for (const driver of results) {
      if (lap <= driver.positionsByLap.length) {
        point[driver.driverId] = driver.positionsByLap[lap - 1];
      }
    }
    return point;
  });

  const topDrivers = results.slice(0, 10);

  return (
    <Card>
      <h3 className="text-lg font-bold text-white mb-4">Posiciones por Vuelta</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="lap"
            stroke="#666"
            tick={{ fill: '#999', fontSize: 12 }}
            label={{ value: 'Vuelta', position: 'insideBottom', offset: -5, fill: '#999' }}
          />
          <YAxis
            reversed
            domain={[1, results.length]}
            stroke="#666"
            tick={{ fill: '#999', fontSize: 12 }}
            label={{ value: 'Posición', angle: -90, position: 'insideLeft', fill: '#999' }}
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
              dataKey={driver.driverId}
              name={driver.driverName}
              stroke={DRIVER_COLORS[idx % DRIVER_COLORS.length]}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
