export type SensorType = 'heartRate' | 'spo2' | 'temperature';

export interface SensorReading {
  sensor: SensorType;
  time: number;   // timestamp or index
  value: number;
}