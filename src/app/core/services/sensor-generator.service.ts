import { Injectable } from '@angular/core';
import { SensorReading, SensorType } from '../models/sensor-reading.model';

@Injectable({ providedIn: 'root' })
export class SensorGeneratorService {
  generateBatch(
    count: number,
    startIndex: number,
    lastValues?: Partial<Record<SensorType, number>>
  ): SensorReading[] {
    const readings: SensorReading[] = [];
    let hr = lastValues?.heartRate ?? 75;
    let spo2 = lastValues?.spo2 ?? 97;
    let temp = lastValues?.temperature ?? 36.7;

    for (let i = 0; i < count; i++) {
      const index = startIndex + i;

      hr = this.nextValue(hr, 60, 100, 2);
      spo2 = this.nextValue(spo2, 92, 100, 0.4);
      temp = this.nextValue(temp, 36.0, 38.0, 0.05);

      readings.push({ sensor: 'heartRate', time: index, value: hr });
      readings.push({ sensor: 'spo2', time: index, value: spo2 });
      readings.push({ sensor: 'temperature', time: index, value: temp });
    }

    return readings;
  }

  private nextValue(
    current: number,
    min: number,
    max: number,
    maxDelta: number
  ): number {
    const delta = (Math.random() - 0.5) * 2 * maxDelta;
    const next = current + delta;
    return Math.min(max, Math.max(min, next));
  }
}