import { F1_CONSTANTS } from './constants.js';
import type { Incident, IncidentType, DriverLapState, CircuitCharacteristics, WeatherCondition, DriverPerformance } from './types.js';

export class IncidentEngine {
  checkIncidents(
    driverStates: DriverLapState[],
    performanceMap: Map<string, DriverPerformance>,
    circuit: CircuitCharacteristics,
    weather: WeatherCondition,
    lap: number,
  ): { incidents: Incident[]; updatedStates: DriverLapState[] } {
    const incidents: Incident[] = [];
    const updatedStates = [...driverStates];

    for (const driver of updatedStates) {
      if (driver.dnf) continue;
      const perf = performanceMap.get(driver.driverId);
      if (!perf) continue;

      if (driver.inPit) continue;

      const probability = this.calculateIncidentProbability(driver, perf, circuit, weather);
      if (Math.random() < probability) {
        const incident = this.generateIncident(driver, lap, weather, updatedStates);
        incidents.push(incident);

        if (incident.causedDnf) {
          driver.dnf = true;
          driver.dnfReason = incident.description;
        }
        driver.damage = Math.min(100, driver.damage + (incident.type === 'crash' ? 40 : incident.type === 'collision' ? 30 : incident.type === 'mechanical' ? 15 : 5));
      }
    }

    return { incidents, updatedStates };
  }

  private calculateIncidentProbability(
    driver: DriverLapState,
    perf: DriverPerformance,
    circuit: CircuitCharacteristics,
    weather: WeatherCondition,
  ): number {
    const baseProb = F1_CONSTANTS.INCIDENT_PROBABILITY;
    const weatherFactor = weather === 'dry' ? 1 : weather === 'light_rain' ? 1.5 : weather === 'heavy_rain' ? 2.5 : 3;
    const congestionFactor = Math.max(1, 20 - driver.position) / 20;
    const aggressionFactor = perf.aggression / 100 * 0.5;
    const complexityFactor = circuit.cornerComplexity / 100 * 0.5;
    const tyreWearFactor = driver.tyre.wear / 100;

    return baseProb * weatherFactor * congestionFactor * (1 + aggressionFactor) * (1 + complexityFactor) * (1 + tyreWearFactor);
  }

  private generateIncident(
    driver: DriverLapState,
    lap: number,
    weather: WeatherCondition,
    allDrivers: DriverLapState[],
  ): Incident {
    const roll = Math.random();
    let type: IncidentType;

    if (roll < 0.25) {
      type = 'crash';
    } else if (roll < 0.50) {
      type = 'spin';
    } else if (roll < 0.70) {
      type = 'mechanical';
    } else if (roll < 0.85) {
      type = 'collision';
    } else {
      type = 'penalty';
    }

    const weatherDesc = weather !== 'dry' ? ' in deteriorating conditions' : '';
    const descriptions: Record<IncidentType, string> = {
      crash: `${driver.driverId} crashed${weatherDesc}`,
      mechanical: `${driver.driverId} suffered a mechanical failure${weatherDesc}`,
      penalty: `${driver.driverId} received a time penalty`,
      spin: `${driver.driverId} spun${weatherDesc}`,
      collision: `${driver.driverId} was involved in a collision`,
    };

    const dnfs: IncidentType[] = ['crash', 'mechanical'];
    const causedDnf = dnfs.includes(type) && Math.random() < 0.6;

    let safetyCarDeployed = false;
    if (type === 'crash' || type === 'collision') {
      safetyCarDeployed = Math.random() < 0.5;
    }

    let involvedDrivers: string[] | undefined;
    if (type === 'collision') {
      const nearby = allDrivers
        .filter(d => d.driverId !== driver.driverId && Math.abs(d.position - driver.position) <= 1 && !d.dnf)
        .map(d => d.driverId);
      if (nearby.length > 0) {
        involvedDrivers = [nearby[0]];
      }
    }

    return {
      type,
      lap,
      driverId: driver.driverId,
      description: descriptions[type],
      causedDnf,
      involvedDrivers,
      safetyCarDeployed,
    };
  }
}
