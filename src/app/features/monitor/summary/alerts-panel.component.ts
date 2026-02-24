import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { SensorAlert } from '../../../core/models/worker-messages.model';

@Component({
  selector: 'app-alerts-panel',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <section class="card">
      <header class="card-header">
        <h3>Alerts</h3>
      </header>
      <div class="card-body">
        <p class="empty" *ngIf="!alerts || alerts.length === 0">
          No alerts in the recent window.
        </p>

        <ul class="list" *ngIf="alerts && alerts.length">
          <li *ngFor="let a of alerts" [class.high]="a.type === 'high'" [class.low]="a.type === 'low'">
            <span class="badge">{{ labelFor(a.sensor) }}</span>
            <span class="message">{{ a.message }}</span>
          </li>
        </ul>
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
      .empty {
        font-size: 0.8rem;
        color: #9ca3af;
      }
      .list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }
      li {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.8rem;
      }
      .badge {
        padding: 0.1rem 0.4rem;
        border-radius: 999px;
        font-size: 0.7rem;
        border: 1px solid #1e293b;
        background: #020617;
      }
      .message {
        color: #e5e7eb;
      }
      li.high .badge {
        border-color: #f97316;
        color: #f97316;
      }
      li.low .badge {
        border-color: #38bdf8;
        color: #38bdf8;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertsPanelComponent {
  @Input() alerts: SensorAlert[] = [];

  labelFor(sensor: SensorAlert['sensor']): string {
    if (sensor === 'heartRate') return 'Heart Rate';
    if (sensor === 'spo2') return 'SpO2';
    if (sensor === 'temperature') return 'Temperature';
    return sensor;
  }
}