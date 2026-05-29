import type { StrategyType, DriverLapState, CircuitCharacteristics, WeatherCondition, DriverPerformance, PitTyreChoice } from './types.js';

interface PitDecision {
  shouldPit: boolean;
  preferredLap: number;
  targetCompound: PitTyreChoice;
}

export class StrategyEngine {
  private strategyMapping: Map<string, StrategyType> = new Map();

  assignStrategy(driverId: string, baseSkill: number): StrategyType {
    if (this.strategyMapping.has(driverId)) {
      return this.strategyMapping.get(driverId)!;
    }

    const r = Math.random();
    let strategy: StrategyType;
    if (baseSkill > 80) {
      strategy = r < 0.5 ? 'aggressive' : r < 0.85 ? 'balanced' : 'conservative';
    } else if (baseSkill > 60) {
      strategy = r < 0.3 ? 'aggressive' : r < 0.7 ? 'balanced' : r < 0.9 ? 'conservative' : 'underdog';
    } else {
      strategy = r < 0.2 ? 'aggressive' : r < 0.5 ? 'balanced' : r < 0.8 ? 'conservative' : 'underdog';
    }

    this.strategyMapping.set(driverId, strategy);
    return strategy;
  }

  getStrategy(driverId: string): StrategyType {
    return this.strategyMapping.get(driverId) ?? 'balanced';
  }

  decidePitStop(
    driver: DriverLapState,
    strategy: StrategyType,
    _circuit: CircuitCharacteristics,
    weather: WeatherCondition,
    totalLaps: number,
    lap: number,
    _performance: DriverPerformance,
  ): PitDecision {
    const tyreAge = driver.tyre.age;
    const tyreWear = driver.tyre.wear;

    const wearThresholds: Record<StrategyType, number> = {
      aggressive: 60,
      balanced: 75,
      conservative: 85,
      underdog: 70,
    };

    const weatherCompound = this.getWeatherCompound(weather);
    const pitCount = this.getPitCount(strategy);
    const currentStint = driver.pitStopCount + 1;

    if (currentStint > pitCount) {
      return { shouldPit: false, preferredLap: 999, targetCompound: weatherCompound };
    }

    const stintLength = Math.floor(totalLaps / (pitCount + 1));
    const preferredLap = stintLength * currentStint;
    const lapWindow = Math.floor(stintLength * 0.3);

    const inWindow = lap >= (preferredLap - lapWindow) && lap <= (preferredLap + lapWindow);
    const wearExceeded = tyreWear >= wearThresholds[strategy];

    if ((inWindow && wearExceeded) || tyreWear >= 90 || (tyreAge >= stintLength + 2)) {
      return { shouldPit: true, preferredLap, targetCompound: weatherCompound };
    }

    return { shouldPit: false, preferredLap, targetCompound: weatherCompound };
  }

  private getPitCount(strategy: StrategyType): number {
    switch (strategy) {
      case 'aggressive': return 2;
      case 'balanced': return 1;
      case 'conservative': return 1;
      case 'underdog': return Math.random() < 0.5 ? 2 : 0;
    }
  }

  private getWeatherCompound(weather: WeatherCondition): PitTyreChoice {
    if (weather === 'dry' || weather === 'light_rain') {
      const r = Math.random();
      if (r < 0.4) return 'soft';
      if (r < 0.7) return 'medium';
      return 'hard';
    }
    if (weather === 'heavy_rain') return 'intermediate';
    return 'wet';
  }
}
