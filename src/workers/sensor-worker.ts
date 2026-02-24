/// <reference lib="webworker" />

import { SensorReading, SensorType } from '../app/core/models/sensor-reading.model';
import {
  WorkerInput,
  WorkerOutput,
  SensorStats,
  SensorAlert,
} from '../app/core/models/worker-messages.model';

addEventListener('message', ({ data }) => {
  const input = data as WorkerInput;
  const t0 = performance.now();

  const bySensor = groupBySensor(input.readings);
  const stats: SensorStats[] = [];
  const alerts: SensorAlert[] = [];

  for (const sensor of Object.keys(bySensor) as SensorType[]) {
    const values = bySensor[sensor].map((r) => r.value);
    if (values.length === 0) continue;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    const variance =
      values.reduce((s, v) => s + (v - mean) * (v - mean), 0) / values.length;
    const stddev = Math.sqrt(variance);

    stats.push({ sensor, min, max, mean, stddev });

    // Simple threshold-based “needs review” style alerts (not medical advice)
    const sensorAlerts = evaluateAlerts(sensor, min, max);
    alerts.push(...sensorAlerts);
  }

  const t1 = performance.now();

  const result: WorkerOutput = {
    stats,
    alerts,
    durationMs: t1 - t0,
  };

  postMessage(result);
});

function groupBySensor(
  readings: SensorReading[]
): Record<SensorType, SensorReading[]> {
  const map: Record<SensorType, SensorReading[]> = {
    heartRate: [],
    spo2: [],
    temperature: [],
  };
  for (const r of readings) {
    map[r.sensor].push(r);
  }
  return map;
}

function evaluateAlerts(sensor: SensorType, min: number, max: number): SensorAlert[] {
  const alerts: SensorAlert[] = [];
  if (sensor === 'heartRate') {
    if (max > 120) {
      alerts.push({
        sensor,
        type: 'high',
        message: 'Heart rate above nominal range detected in recent data.',
      });
    }
    if (min < 50) {
      alerts.push({
        sensor,
        type: 'low',
        message: 'Heart rate below nominal range detected in recent data.',
      });
    }
  }
  if (sensor === 'spo2') {
    if (min < 94) {
      alerts.push({
        sensor,
        type: 'low',
        message: 'SpO2 below nominal range detected in recent data.',
      });
    }
  }
  if (sensor === 'temperature') {
    if (max > 38.0) {
      alerts.push({
        sensor,
        type: 'high',
        message: 'Temperature above nominal range detected in recent data.',
      });
    }
  }
  return alerts;
}