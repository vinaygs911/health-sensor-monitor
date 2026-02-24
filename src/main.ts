import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./app/features/monitor/monitor.routes').then(
        (m) => m.MONITOR_ROUTES
      ),
  },
  { path: '**', redirectTo: '' },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
  ],
}).catch((err) => console.error(err));