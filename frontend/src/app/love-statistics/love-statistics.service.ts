import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Fight } from '../model/fight';

@Injectable({
  providedIn: 'root',
})
export class LoveStatisticsService {
  httpClient = inject(HttpClient);

  getFights(): Observable<Fight[]> {
    return of([
      {
        id: 1,
        timestamp: '2024-01-15T10:30:00Z',
      },
    ]);
  }

  addFight(selectedDate: string): void {
    of({
      id: 1,
      timestamp: selectedDate,
    }).subscribe({
      next: () => {
        console.log('Fight added successfully');
      },
      error: (error) => {
        console.error('Error adding fight:', error);
      },
    });
  }
}
