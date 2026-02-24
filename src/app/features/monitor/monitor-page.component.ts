import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    signal,
    inject,
  } from '@angular/core';
  import { NgIf } from '@angular/common';
  import { SensorGeneratorService } from '../../core/services/sensor-generator.service';
  import { SensorWorkerService } from '../../core/services/sensor-worker.service';
  import { SensorReading } from '../../core/models/sensor-reading.model';
  import { WorkerOutput } from '../../core/models/worker-messages.model';
  import { HeartRateChartComponent } from './charts/heart-rate-chart.component';
  import { Spo2ChartComponent } from './charts/spo2-chart.component';
  import { TemperatureChartComponent } from './charts/temperature-chart.component';
  import { SensorSummaryComponent } from './summary/sensor-summary.component';
  import { AlertsPanelComponent } from './summary/alerts-panel.component';
  
  @Component({
    selector: 'app-monitor-page',
    standalone: true,
    imports: [
      NgIf,
      HeartRateChartComponent,
      Spo2ChartComponent,
      TemperatureChartComponent,
      SensorSummaryComponent,
      AlertsPanelComponent,
    ],
    template: `
      <section class="page">
        <header class="page-header">
          <div>
            <h2>Health Sensor Monitor</h2>
            <p class="subtitle">
              Simulated vital signals with worker-based analytics (demo only)
            </p>
          </div>
        </header>
  
        <section class="layout" *ngIf="readings().length">
          <div class="charts">
            <app-heart-rate-chart [readings]="readings()"></app-heart-rate-chart>
            <app-spo2-chart [readings]="readings()"></app-spo2-chart>
            <app-temperature-chart [readings]="readings()"></app-temperature-chart>
          </div>
  
          <div class="sidebar">
            <app-sensor-summary [stats]="workerResult()?.stats || []"
                                [durationMs]="workerResult()?.durationMs ?? 0">
            </app-sensor-summary>
  
            <app-alerts-panel [alerts]="workerResult()?.alerts || []">
            </app-alerts-panel>
          </div>
        </section>
      </section>
    `,
    styles: [
      `
        .page {
          max-width: 1200px;
          margin: 0 auto;
        }
        .page-header {
          margin-bottom: 1rem;
        }
        .subtitle {
          margin-top: 0.25rem;
          color: #9ca3af;
          font-size: 0.9rem;
        }
        .layout {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
          gap: 1rem;
        }
        .charts {
          display: grid;
          grid-template-rows: repeat(3, 1fr);
          gap: 1rem;
        }
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (max-width: 900px) {
          .layout {
            grid-template-columns: 1fr;
          }
          .charts {
            grid-template-rows: repeat(3, auto);
          }
        }
      `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class MonitorPageComponent implements OnDestroy {
    private gen = inject(SensorGeneratorService);
    private worker = inject(SensorWorkerService);
  
    readings = signal<SensorReading[]>([]);
    workerResult = signal<WorkerOutput | null>(null);
  
    private index = 0;
    private timerId: any;
  
    constructor() {
      this.startSimulation();
    }
  
    async startSimulation(): Promise<void> {
      this.timerId = setInterval(async () => {
        const batch = this.gen.generateBatch(5, this.index);
        this.index += 5;
        this.readings.update((current) => {
          const next = [...current, ...batch];
          // keep last N points (e.g., 200)
          const maxPointsPerSensor = 200;
          const maxTotal = maxPointsPerSensor * 3;
          return next.slice(Math.max(0, next.length - maxTotal));
        });
  
        const result = await this.worker.compute(this.readings());
        this.workerResult.set(result);
      }, 1000);
    }
  
    ngOnDestroy(): void {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.worker.terminate();
    }
  }