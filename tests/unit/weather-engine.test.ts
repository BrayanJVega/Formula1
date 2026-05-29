import { describe, it, expect } from 'vitest';
import { WeatherEngine } from '../../server/src/core/simulation/WeatherEngine.js';

describe('WeatherEngine', () => {
  describe('initial weather state', () => {
    it('should default to dry condition with default values', () => {
      const engine = new WeatherEngine();
      const state = engine.getCurrent();
      expect(state.condition).toBe('dry');
      expect(state.temperature).toBe(22);
      expect(state.humidity).toBe(50);
      expect(state.windSpeed).toBe(10);
      expect(state.trackTemperature).toBe(28);
      expect(state.rainIntensity).toBe(0);
      expect(state.changeProbability).toBe(0.05);
    });

    it('should accept partial initial state overrides', () => {
      const engine = new WeatherEngine({ temperature: 30, humidity: 80 });
      const state = engine.getCurrent();
      expect(state.temperature).toBe(30);
      expect(state.humidity).toBe(80);
      expect(state.condition).toBe('dry');
    });
  });

  describe('weather transitions', () => {
    it('should transition from dry to a rain condition via forceChange', () => {
      const engine = new WeatherEngine({ changeProbability: 1 });
      engine.forceChange('light_rain', 5);
      const state = engine.getCurrent();
      expect(state.condition).toBe('light_rain');
      expect(state.rainIntensity).toBeGreaterThan(0);
    });

    it('should record weather changes', () => {
      const engine = new WeatherEngine();
      engine.forceChange('heavy_rain', 10);
      const changes = engine.getChanges();
      expect(changes.length).toBe(1);
      expect(changes[0].lap).toBe(10);
      expect(changes[0].condition).toBe('heavy_rain');
    });

    it('should set rain intensity based on condition via setCondition', () => {
      const engine = new WeatherEngine();
      engine.setCondition('wet');
      expect(engine.getCurrent().condition).toBe('wet');
      expect(engine.getCurrent().rainIntensity).toBe(90);
    });

    it('should set rain intensity to 0 for dry via setCondition', () => {
      const engine = new WeatherEngine({ condition: 'wet', rainIntensity: 90 });
      engine.setCondition('dry');
      expect(engine.getCurrent().condition).toBe('dry');
      expect(engine.getCurrent().rainIntensity).toBe(0);
    });
  });

  describe('track temperature adjustment', () => {
    it('should adjust track temperature down for rain conditions', () => {
      const engine = new WeatherEngine({ temperature: 25 });
      const dryTrackTemp = engine.getCurrent().trackTemperature;

      engine.forceChange('light_rain', 1);
      const rainTrackTemp = engine.getCurrent().trackTemperature;
      expect(rainTrackTemp).toBeLessThan(dryTrackTemp);
    });

    it('should lower track temperature more for heavier rain', () => {
      const engine = new WeatherEngine({ temperature: 25 });
      engine.forceChange('light_rain', 1);
      const lightRainTemp = engine.getCurrent().trackTemperature;

      const engine2 = new WeatherEngine({ temperature: 25 });
      engine2.forceChange('heavy_rain', 1);
      const heavyRainTemp = engine2.getCurrent().trackTemperature;
      expect(heavyRainTemp).toBeLessThanOrEqual(lightRainTemp);
    });

    it('should have track temperature approximately temperature + 6 in dry', () => {
      const engine = new WeatherEngine({ temperature: 30 });
      const state = engine.getCurrent();
      expect(state.trackTemperature).toBeGreaterThanOrEqual(33);
      expect(state.trackTemperature).toBeLessThanOrEqual(39);
    });
  });
});
