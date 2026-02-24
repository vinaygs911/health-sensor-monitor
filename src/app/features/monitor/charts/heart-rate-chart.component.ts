import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { ChartsModule } from '../../../shared/charts/charts.module';
import { ChartConfiguration, ChartType } from 'chart.js';
import { SensorReading } from '../../../core/models/sensor-reading.model';

@Component({
  selector: 'app-heart-rate-chart',
  standalone: true,
  imports: [NgIf, ChartsModule],
  template: `
    <section class="card" *ngIf="data && data.length">
      <header class="card-header">
        <h3>Heart Rate</h3>
        <span class="unit">bpm</span>
      </header>
      <div class="card-body chart-container">
        <canvas
          baseChart
          [data]="chartData"
          [options]="chartOptions"
          [type]="chartType"
        ></canvas>
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
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 0.5rem;
      }
      .card-header h3 {
        margin: 0;
        font-size: 0.95rem;
      }
      .unit {
        font-size: 0.75rem;
        color: #9ca3af;
      }
      .chart-container {
        position: relative;
        height: 160px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeartRateChartComponent {
  private _readings: SensorReading[] = [];

  @Input() set readings(value: SensorReading[]) {
    this._readings = value?.filter((r) => r.sensor === 'heartRate') ?? [];
  }

  get data(): SensorReading[] {
    return this._readings;
  }

  chartType: ChartType = 'line';

  get chartData(): ChartConfiguration['data'] {
    return {
      labels: this._readings.map((r) => r.time),
      datasets: [
        {
          label: 'Heart Rate',
          data: this._readings.map((r) => r.value),
          borderColor: 'rgba(248,113,113,1)',
          backgroundColor: 'rgba(248,113,113,0.1)',
          borderWidth: 1,
          pointRadius: 0,
        },
      ],
    };
  }

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#e5e7eb' },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: '#1f2937' },
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: '#1f2937' },
      },
    },
  };
}