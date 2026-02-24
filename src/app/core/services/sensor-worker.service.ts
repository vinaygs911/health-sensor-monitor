import { Injectable } from '@angular/core';
import { SensorReading } from '../models/sensor-reading.model';
import { WorkerInput, WorkerOutput } from '../models/worker-messages.model';

@Injectable({ providedIn: 'root' })
export class SensorWorkerService {
  private worker: Worker | null = null;

  private ensureWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(
        new URL('../../../workers/sensor-worker.ts', import.meta.url),
        { type: 'module' }
      );
    }
    return this.worker;
  }

  compute(readings: SensorReading[]): Promise<WorkerOutput> {
    const worker = this.ensureWorker();
    const payload: WorkerInput = { readings };

    return new Promise<WorkerOutput>((resolve, reject) => {
      const onMessage = (event: MessageEvent<WorkerOutput>) => {
        worker.removeEventListener('message', onMessage);
        worker.removeEventListener('error', onError);
        resolve(event.data);
      };
      const onError = (error: ErrorEvent) => {
        worker.removeEventListener('message', onMessage);
        worker.removeEventListener('error', onError);
        reject(error);
      };

      worker.addEventListener('message', onMessage);
      worker.addEventListener('error', onError);
      worker.postMessage(payload);
    });
  }

  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}