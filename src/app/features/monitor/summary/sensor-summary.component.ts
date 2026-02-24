import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor, DecimalPipe } from '@angular/common';
import { SensorStats } from '../../../core/models/worker-messages.model';

@Component({
  selector: 'app-sensor-summary',
  standalone: true,
  imports: [NgFor, DecimalPipe],
  template: `
    <section class="card">
      <header class="card-header">
        <h3>Summary</h3>
      </header>
      <div class="card-body">
        <div class="row" *ngFor="let s of stats">
          <div class="sensor">{{ labelFor(s.sensor) }}</div>
          <div class="values">
            <div>Min: {{ s.min | number: '1.1-1' }}</div>
            <div>Max: {{ s.max | number: '1.1-1' }}</div>
            <div>Mean: {{ s.mean | number: '1.1-1' }}</div>
          </div>
        </div>

        <div class="worker-time" *ngIf="durationMs">
          Worker time:
          <strong>{{ durationMs | number: '1.0-0' }} ms</strong>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .card {
        background: #020617;
        border-radius: 0.75rem;
        border: 1px solid #1e293b;
        padding: 0.75rem;
      }
      .card-header h3 {
        margin: 0 0 0.5rem;
      }
      .row {
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
        padding: 0.4rem 0;
        border-bottom: 1px solid #1e293b;
      }
      .row:last-child {
        border-bottom: none;
      }
      .sensor {
        font-size: 0.85rem;
        font-weight: 600;
      }
      .values {
        font-size: 0.8rem;
        color: #9ca3af;
        text-align: right;
      }
      .worker-time {
        margin-top: 0.75rem;
        font-size: 0.8rem;
        color: #9ca3af;
      }
      .worker-time strong {
        color: #e5e7eb;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SensorSummaryComponent {
  @Input() stats: SensorStats[] = [];
  @Input() durationMs = 0;

  labelFor(sensor: SensorStats['sensor']): string {
    if (sensor === 'heartRate') return 'Heart Rate';
    if (sensor === 'spo2') return 'SpO2';
    if (sensor === 'temperature') return 'Temperature';
    return sensor;
  }
}