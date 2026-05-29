import { F1_CONSTANTS } from './constants.js';
import type { TyreCompound, TyreState, CircuitCharacteristics, WeatherCondition } from './types.js';

const COMPOUND_PERFORMANCE: Record<TyreCompound, number> = {
  soft: 0,
  medium: 0.3,
  hard: 0.6,
  intermediate: 0.8,
  wet: 1.2,
};

const COMPOUND_DEGRADATION: Record<TyreCompound, number> = {
  soft: 1.0,
  medium: 0.7,
  hard: 0.45,
  intermediate: 0.5,
  wet: 0.4,
};

const COMPOUND_TEMP_RANGE: Record<TyreCompound, { min: number; max: number; optimal: number }> = {
  soft: { min: 65, max: 95, optimal: 80 },
  medium: { min: 60, max: 100, optimal: 75 },
  hard: { min: 55, max: 105, optimal: 70 },
  intermediate: { min: 50, max: 90, optimal: 65 },
  wet: { min: 40, max: 85, optimal: 55 },
};

export class TyreModel {
  createNewTyre(compound: TyreCompound): TyreState {
    return {
      compound,
      age: 0,
      wear: 0,
      temperature: 40,
      pressure: 22,
    };
  }

  calculateWear(
    tyre: TyreState,
    circuit: CircuitCharacteristics,
    tyreManagement: number,
    weather: WeatherCondition,
  ): number {
    if (tyre.compound === 'intermediate' && weather === 'dry') {
      return F1_CONSTANTS.TYRE_DEGRADATION_BASE * 1.5;
    }
    if (tyre.compound === 'wet' && weather === 'dry') {
      return F1_CONSTANTS.TYRE_DEGRADATION_BASE * 2.5;
    }
    if ((tyre.compound === 'intermediate' || tyre.compound === 'wet') && (weather === 'light_rain' || weather === 'heavy_rain' || weather === 'wet')) {
      return F1_CONSTANTS.TYRE_DEGRADATION_BASE * 0.4;
    }

    const baseWear = F1_CONSTANTS.TYRE_DEGRADATION_BASE * COMPOUND_DEGRADATION[tyre.compound];
    const circuitFactor = 1 + (circuit.tyreDegradation - 50) / 100;
    const managementFactor = 1 - (tyreManagement / 100) * 0.4;
    const tempFactor = tyre.temperature > 90 ? 1 + (tyre.temperature - 90) / 50 : 1;

    return baseWear * circuitFactor * managementFactor * tempFactor;
  }

  calculateTemperature(tyre: TyreState, _lapNumber: number, weather: WeatherCondition, aggression: number): number {
    const range = COMPOUND_TEMP_RANGE[tyre.compound];
    const weatherPenalty: Record<WeatherCondition, number> = {
      dry: 0,
      light_rain: -5,
      heavy_rain: -10,
      wet: -15,
    };

    if (tyre.age < F1_CONSTANTS.TYRE_WARMUP_LAPS) {
      const warmupProgress = (tyre.age + 1) / F1_CONSTANTS.TYRE_WARMUP_LAPS;
      return 40 + (range.optimal - 40) * warmupProgress + (Math.random() - 0.5) * 5;
    }

    const aggressionHeat = (aggression / 100) * 8;
    const wearHeat = (tyre.wear / 100) * 6;
    const baseTemp = range.optimal + aggressionHeat + wearHeat + weatherPenalty[weather];

    return Math.max(range.min, Math.min(range.max, baseTemp + (Math.random() - 0.5) * 4));
  }

  calculateLapTimePenalty(tyre: TyreState): number {
    const compoundPenalty = COMPOUND_PERFORMANCE[tyre.compound];
    const wearPenalty = (tyre.wear / 100) * 0.5;
    const tempPenalty = tyre.temperature > 90 ? (tyre.temperature - 90) * 0.01 :
      tyre.temperature < 60 ? (60 - tyre.temperature) * 0.015 : 0;

    return compoundPenalty + wearPenalty + tempPenalty;
  }

  calculateWeatherLapTimeAdjustment(weather: WeatherCondition, wetSkill: number): number {
    if (weather === 'dry') return 0;
    const skillFactor = 1 - wetSkill / 100;
    if (weather === 'light_rain') return 1.5 * skillFactor;
    if (weather === 'heavy_rain') return 3.5 * skillFactor;
    return 5.0 * skillFactor;
  }

  getCompoundForWeather(weather: WeatherCondition): TyreCompound {
    if (weather === 'dry' || weather === 'light_rain') {
      const r = Math.random();
      if (r < 0.4) return 'soft';
      if (r < 0.7) return 'medium';
      return 'hard';
    }
    if (weather === 'heavy_rain') {
      return Math.random() < 0.7 ? 'intermediate' : 'wet';
    }
    return 'wet';
  }
}
