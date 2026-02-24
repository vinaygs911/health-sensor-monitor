import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-shell">
      <header class="app-header">
        <h1>Health Sensor Monitor</h1>
        <p class="subtitle">
          Simulated vital signals with Web Worker analytics (demo only)
        </p>
      </header>

      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .app-shell {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
          sans-serif;
        background: #020617;
        color: #e5e7eb;
      }
      .app-header {
        padding: 1rem 2rem;
        border-bottom: 1px solid #1e293b;
        background: #020617;
      }
      .app-header h1 {
        margin: 0;
        font-size: 1.3rem;
      }
      .subtitle {
        margin: 0.25rem 0 0;
        font-size: 0.85rem;
        color: #9ca3af;
      }
      .app-main {
        flex: 1;
        padding: 1.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}