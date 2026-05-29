import { F1_CONSTANTS } from './constants.js';
import { WeatherEngine } from './WeatherEngine.js';
import { TyreModel } from './TyreModel.js';
import { OvertakingModel } from './OvertakingModel.js';
import { IncidentEngine } from './IncidentEngine.js';
import { SafetyCarEngine } from './SafetyCarEngine.js';
import { StrategyEngine } from './StrategyEngine.js';
import { QualifyingSimulator } from './QualifyingSimulator.js';
import type {
  DriverPerformance, CircuitCharacteristics, WeatherState,
  DriverLapState, SimulatedDriverResult, RaceSimulationResult,
  Incident, QualifyingResult, WeatherCondition,
} from './types.js';

export class RaceSimulator {
  private weatherEngine = new WeatherEngine();
  private tyreModel = new TyreModel();
  private overtakingModel = new OvertakingModel();
  private incidentEngine = new IncidentEngine();
  private safetyCarEngine = new SafetyCarEngine();
  private strategyEngine = new StrategyEngine();
  private qualifyingSimulator = new QualifyingSimulator();

  simulate(
    drivers: DriverPerformance[],
    circuit: CircuitCharacteristics,
    laps: number,
    raceId: string,
    raceName: string,
    initialWeather?: Partial<WeatherState>,
    gridOrder?: QualifyingResult[],
  ): RaceSimulationResult {
    this.weatherEngine = new WeatherEngine(initialWeather);
    this.strategyEngine = new StrategyEngine();
    this.safetyCarEngine.reset();

    const performanceMap = new Map(drivers.map(d => [d.driverId, d]));
    for (const d of drivers) {
      this.strategyEngine.assignStrategy(d.driverId, d.skill);
    }

    let qualifyingResults: QualifyingResult[] | undefined;
    if (gridOrder) {
      qualifyingResults = gridOrder;
    } else {
      qualifyingResults = this.qualifyingSimulator.simulate(drivers, circuit, this.weatherEngine.getCurrent().condition);
    }

    const driverStates = this.initializeRaceState(drivers, qualifyingResults);
    const weatherChanges: { lap: number; condition: WeatherCondition }[] = [];
    const allIncidents: Incident[] = [];
    const allLapTimes: Map<string, number[]> = new Map(drivers.map(d => [d.driverId, []]));
    const positionsByLap: Map<string, number[]> = new Map(drivers.map(d => [d.driverId, []]));

    for (let lap = 1; lap <= laps; lap++) {
      const weather = this.weatherEngine.advanceLap(lap);
      if (weatherChanges.length === 0 && weather.condition !== 'dry') {
        weatherChanges.push({ lap, condition: weather.condition });
      } else if (weatherChanges.length > 0 && weatherChanges[weatherChanges.length - 1].condition !== weather.condition) {
        weatherChanges.push({ lap, condition: weather.condition });
      }

      for (const state of driverStates) {
        if (state.dnf) continue;

        const perf = performanceMap.get(state.driverId);
        if (!perf) continue;

        state.lapNumber = lap;
        state.tyre.age += 1;

        const wear = this.tyreModel.calculateWear(state.tyre, circuit, perf.tyreManagement, weather.condition);
        state.tyre.wear = Math.min(100, state.tyre.wear + wear);

        state.tyre.temperature = this.tyreModel.calculateTemperature(
          state.tyre, lap, weather.condition, perf.aggression,
        );

        state.fuelLoad = Math.max(0, state.fuelLoad - F1_CONSTANTS.FUEL_PER_LAP);

        const strategy = this.strategyEngine.getStrategy(state.driverId);
        const pitDecision = this.strategyEngine.decidePitStop(
          state, strategy, circuit, weather.condition, laps, lap, perf,
        );

        if (pitDecision.shouldPit && !state.inPit) {
          state.inPit = true;
          state.pitStopCount++;
          state.tyre = this.tyreModel.createNewTyre(pitDecision.targetCompound);
        }

        if (state.inPit) {
          state.inPit = false;
        }
      }

      const { incidents } = this.incidentEngine.checkIncidents(
        driverStates, performanceMap, circuit, weather.condition, lap,
      );
      allIncidents.push(...incidents);

      for (const inc of incidents) {
        if (inc.safetyCarDeployed) {
          this.safetyCarEngine.evaluateDeployment(inc, lap, laps);
        }
      }

      if (this.safetyCarEngine.isActive()) {
        this.safetyCarEngine.applySafetyCarEffects(driverStates, lap);
      }

      this.overtakingModel.simulateOvertakes(
        driverStates, performanceMap, circuit, weather.condition, lap,
      );

      for (const ds of driverStates) {
        if (ds.dnf) continue;
        const perf = performanceMap.get(ds.driverId);
        if (!perf) continue;

        const lapTime = this.calculateLapTime(
          ds, perf, circuit, weather.condition, this.safetyCarEngine.isActive(), lap,
        );
        ds.lapTime = lapTime;
        ds.sector1Time = lapTime * (0.3 + Math.random() * 0.02);
        ds.sector2Time = lapTime * (0.35 + Math.random() * 0.02);
        ds.sector3Time = lapTime * (0.35 + Math.random() * 0.02);
        allLapTimes.get(ds.driverId)!.push(lapTime);
      }

      if (this.safetyCarEngine.isActive()) {
        this.safetyCarEngine.applySafetyCarEffects(driverStates, lap);
      }

      const active = driverStates.filter(d => !d.dnf);
      active.sort((a, b) => a.position - b.position);

      for (let i = 0; i < active.length; i++) {
        if (i === 0) {
          active[i].gapToFront = 0;
          active[i].gapToLeader = 0;
        } else {
          const gapToPrev = Math.max(0.3, active[i].lapTime - active[i - 1].lapTime + (Math.random() - 0.5) * 0.5);
          active[i].gapToFront = gapToPrev;
          active[i].gapToLeader = active[i - 1].gapToLeader + gapToPrev;
        }
      }

      this.overtakingModel.updateDrs(driverStates, lap, this.safetyCarEngine.isActive());

      for (const d of driverStates) {
        positionsByLap.get(d.driverId)!.push(d.position);
      }
    }

    const results = this.compileResults(driverStates, allLapTimes, positionsByLap, laps, qualifyingResults, performanceMap);

    let fastestLapDriver = '';
    let fastestLapTime = Infinity;
    let fastestLapNum = 0;
    for (const r of results) {
      if (r.lapTimes.length > 0) {
        const minLap = Math.min(...r.lapTimes);
        if (minLap < fastestLapTime) {
          fastestLapTime = minLap;
          fastestLapDriver = r.driverId;
          fastestLapNum = r.lapTimes.indexOf(minLap) + 1;
        }
      }
    }

    const finishers = results.filter(r => !r.dnfd);
    const margins = {
      winner: finishers.length > 1 ? Math.abs(finishers[0].totalTime - finishers[1].totalTime) : 0,
      podium: finishers.length > 3 ? Math.abs(finishers[0].totalTime - finishers[3].totalTime) : 0,
      points: finishers.length > 10 ? Math.abs(finishers[0].totalTime - finishers[9].totalTime) : 0,
    };

    const totalDuration = finishers.length > 0
      ? finishers[0].totalTime
      : results.reduce((s, r) => s + r.lapTimes.reduce((a: number, b: number) => a + b, 0), 0);

    const avgLapTimes = results.filter(r => r.lapTimes.length > 0).map(r => r.avgLapTime);
    const averageLapTime = avgLapTimes.length > 0
      ? avgLapTimes.reduce((a, b) => a + b, 0) / avgLapTimes.length
      : 0;

    return {
      raceId,
      raceName,
      circuit,
      weather: this.weatherEngine.getCurrent(),
      weatherChanges,
      laps,
      results,
      qualifyingResults,
      safetyCarPeriods: this.safetyCarEngine.getPeriods(),
      incidents: allIncidents,
      totalDuration,
      averageLapTime,
      fastestLap: { driverId: fastestLapDriver, time: fastestLapTime, lap: fastestLapNum },
      retirements: results.filter(r => r.dnfd).length,
      margins,
    };
  }

  private initializeRaceState(
    drivers: DriverPerformance[],
    grid: QualifyingResult[],
  ): DriverLapState[] {
    const gridMap = new Map(grid.map((g, i) => [g.driverId, i + 1]));

    return drivers.map(d => {
      const gridPos = gridMap.get(d.driverId) ?? 20;
      return {
        driverId: d.driverId,
        position: gridPos,
        lapNumber: 0,
        lapTime: 0,
        sector1Time: 0,
        sector2Time: 0,
        sector3Time: 0,
        tyre: this.tyreModel.createNewTyre('soft'),
        fuelLoad: F1_CONSTANTS.STARTING_FUEL,
        damage: 0,
        dnf: false,
        inPit: false,
        pitStopCount: 0,
        hasPenalty: false,
        drsEnabled: false,
        gapToFront: 0,
        gapToLeader: 0,
      };
    });
  }

  private calculateLapTime(
    state: DriverLapState,
    perf: DriverPerformance,
    circuit: CircuitCharacteristics,
    weather: WeatherCondition,
    safetyCarActive: boolean,
    _lap: number,
  ): number {
    if (safetyCarActive) {
      const base = F1_CONSTANTS.BASE_LAP_TIME * F1_CONSTANTS.SAFETY_CAR_LAP_TIME_MULTIPLIER;
      return base + (Math.random() - 0.5) * 2;
    }

    const baseLap = F1_CONSTANTS.BASE_LAP_TIME;
    const skillFactor = 1 - (perf.raceSkill / 100) * 0.06;
    const consistencyNoise = (1 - perf.consistency / 100) * (Math.random() - 0.5) * 0.3;
    const fuelPenalty = state.fuelLoad * F1_CONSTANTS.FUEL_TIME_PENALTY;
    const tyrePenalty = this.tyreModel.calculateLapTimePenalty(state.tyre);
    const weatherPenalty = this.tyreModel.calculateWeatherLapTimeAdjustment(weather, perf.wetSkill);
    const damagePenalty = (state.damage / 100) * 0.5;
    const formFactor = 1 - (perf.form / 100) * 0.01;
    const positionBonus = Math.max(0, (state.position - 1) * 0.01);
    const circuitFactor = circuit.lengthKm / 5.5 * 0.1;

    const lapTime = baseLap * skillFactor * formFactor
      + fuelPenalty + tyrePenalty + weatherPenalty
      + damagePenalty + positionBonus + circuitFactor
      + consistencyNoise;

    return Math.round(Math.max(55, lapTime) * 1000) / 1000;
  }

  private compileResults(
    driverStates: DriverLapState[],
    allLapTimes: Map<string, number[]>,
    positionsByLap: Map<string, number[]>,
    laps: number,
    grid: QualifyingResult[],
    performanceMap: Map<string, DriverPerformance>,
  ): SimulatedDriverResult[] {
    const gridMap = new Map(grid.map((g, i) => [g.driverId, i + 1]));

    const sorted = [...driverStates].sort((a, b) => {
      if (a.dnf && !b.dnf) return 1;
      if (!a.dnf && b.dnf) return -1;
      return a.position - b.position;
    });

    return sorted.map((s, idx) => {
      const lapTimes = allLapTimes.get(s.driverId) ?? [];
      const positions = positionsByLap.get(s.driverId) ?? [];
      const gridPos = gridMap.get(s.driverId) ?? 20;
      const perf = performanceMap.get(s.driverId);

      const totalTime = lapTimes.reduce((sum, t) => sum + t, 0);
      const avgLapTime = lapTimes.length > 0 ? totalTime / lapTimes.length : 0;

      const points = !s.dnf && idx < F1_CONSTANTS.POINTS_SYSTEM.length ? F1_CONSTANTS.POINTS_SYSTEM[idx] : 0;

      return {
        driverId: s.driverId,
        driverName: perf?.driverName ?? s.driverId,
        teamId: perf?.teamId ?? '',
        teamName: perf?.teamName ?? '',
        position: idx + 1,
        gridPosition: gridPos,
        positionsGained: gridPos - (idx + 1),
        totalTime,
        gapToWinner: idx === 0 ? 0 : totalTime - (
          sorted.find(d => !d.dnf && d.driverId === sorted[0].driverId)
            ? (allLapTimes.get(sorted[0].driverId) ?? []).reduce((a, b) => a + b, 0)
            : totalTime
        ),
        fastestLap: false,
        pitStops: s.pitStopCount,
        dnfd: s.dnf,
        dnfReason: s.dnfReason,
        dnfLap: s.dnf ? s.lapNumber : undefined,
        points,
        lapsCompleted: s.dnf ? s.lapNumber : laps,
        avgLapTime,
        strategy: this.strategyEngine.getStrategy(s.driverId),
        tyreHistory: [{ lap: 0, compound: 'soft' }],
        incidents: [],
        lapTimes,
        positionsByLap: positions,
      };
    });
  }
}
