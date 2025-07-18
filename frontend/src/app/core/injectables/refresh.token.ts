import { InjectionToken } from '@angular/core';
import { Subject } from 'rxjs';

export const GlobalRefreshToken = new InjectionToken<Subject<void>>(
  'RefreshToken',
  {
    providedIn: 'root',
    factory: () => new Subject<void>(),
  }
);
