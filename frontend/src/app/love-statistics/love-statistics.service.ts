import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Fight } from '../model/fight';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class LoveStatisticsService {
  httpClient = inject(HttpClient);
  lastFight: Signal<string | undefined> = toSignal(
    this.getFights().pipe(
      map((fights: Fight[]) => fights[fights.length - 1]?.timestamp)
    )
  );

  getFights(): Observable<Fight[]> {
    return this.httpClient.get<Fight[]>('http://localhost:3000/fights');
  }

  addFight(selectedDate: string): Observable<Fight> {
    return this.httpClient.post<Fight>('http://localhost:3000/fights', {
      timestamp: selectedDate,
    });
  }
}
