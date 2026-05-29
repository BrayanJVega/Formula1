import type { WeatherState, WeatherCondition } from './types.js';

export class WeatherEngine {
  private current: WeatherState;
  private changes: { lap: number; condition: WeatherCondition }[] = [];

  constructor(initial: Partial<WeatherState> = {}) {
    this.current = {
      condition: initial.condition ?? 'dry',
      temperature: initial.temperature ?? 22,
      humidity: initial.humidity ?? 50,
      windSpeed: initial.windSpeed ?? 10,
      trackTemperature: initial.trackTemperature ?? 28,
      rainIntensity: initial.rainIntensity ?? 0,
      changeProbability: initial.changeProbability ?? 0.05,
    };
  }

  getCurrent(): WeatherState {
    return { ...this.current };
  }

  getChanges(): { lap: number; condition: WeatherCondition }[] {
    return [...this.changes];
  }

  advanceLap(lap: number): WeatherState {
    const roll = Math.random();
    if (roll < this.current.changeProbability) {
      this.transitionWeather();
      this.changes.push({ lap, condition: this.current.condition });
    }

    this.updateTrackTemperature();
    return this.getCurrent();
  }

  private transitionWeather(): void {
    const r = Math.random();
    const current = this.current.condition;

    if (current === 'dry') {
      if (r < 0.5) {
        this.current.condition = 'light_rain';
        this.current.rainIntensity = 20 + Math.random() * 20;
      } else {
        this.current.condition = 'heavy_rain';
        this.current.rainIntensity = 60 + Math.random() * 40;
      }
    } else if (current === 'light_rain') {
      if (r < 0.4) {
        this.current.condition = 'dry';
        this.current.rainIntensity = 0;
      } else if (r < 0.8) {
        this.current.condition = 'heavy_rain';
        this.current.rainIntensity = 60 + Math.random() * 40;
      } else {
        this.current.condition = 'wet';
        this.current.rainIntensity = 80 + Math.random() * 20;
      }
    } else if (current === 'heavy_rain') {
      if (r < 0.3) {
        this.current.condition = 'light_rain';
        this.current.rainIntensity = 20 + Math.random() * 20;
      } else if (r < 0.5) {
        this.current.condition = 'wet';
        this.current.rainIntensity = 80 + Math.random() * 20;
      } else {
        this.current.condition = 'dry';
        this.current.rainIntensity = 0;
      }
    } else if (current === 'wet') {
      if (r < 0.3) {
        this.current.condition = 'heavy_rain';
        this.current.rainIntensity = 60 + Math.random() * 40;
      } else {
        this.current.condition = 'light_rain';
        this.current.rainIntensity = 20 + Math.random() * 20;
      }
    }
  }

  private updateTrackTemperature(): void {
    const baseTrackTemp = this.current.temperature + 6;
    const weatherOffset: Record<WeatherCondition, number> = {
      dry: 0,
      light_rain: -4,
      heavy_rain: -8,
      wet: -10,
    };
    this.current.trackTemperature = baseTrackTemp + (weatherOffset[this.current.condition] ?? 0) + (Math.random() - 0.5) * 3;
  }

  setCondition(condition: WeatherCondition): void {
    this.current.condition = condition;
    if (condition === 'dry') this.current.rainIntensity = 0;
    else if (condition === 'light_rain') this.current.rainIntensity = 30;
    else if (condition === 'heavy_rain') this.current.rainIntensity = 70;
    else if (condition === 'wet') this.current.rainIntensity = 90;
    this.updateTrackTemperature();
  }

  forceChange(condition: WeatherCondition, lap: number): void {
    this.setCondition(condition);
    this.changes.push({ lap, condition });
  }
}
