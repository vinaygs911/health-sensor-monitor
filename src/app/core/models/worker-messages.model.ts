import { SensorType, SensorReading } from './sensor-reading.model';

export interface WorkerInput {
  readings: SensorReading[];
}

export interface SensorStats {
  sensor: SensorType;
  min: number;
  max: number;
  mean: number;
  stddev: number;
}

export interface SensorAlert {
  sensor: SensorType;
  type: 'high' | 'low';
  message: string;
}

export interface WorkerOutput {
  stats: SensorStats[];
  alerts: SensorAlert[];
  durationMs: number;
}