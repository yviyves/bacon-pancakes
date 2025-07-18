import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, Subject } from 'rxjs';
import { Fight } from '../model/fight';
import { LoveStatisticsService } from '../core/injectables/love-statistics.service';
import { GlobalRefreshToken } from '../core/injectables/refresh.token';

@Component({
  selector: 'app-love-statistics-overview',
  imports: [DatePipe],
  templateUrl: './love-statistics-overview.html',
  styleUrl: './love-statistics-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class LoveStatisticsOverviewComponent implements OnInit {
  refreshToken = inject(GlobalRefreshToken);
  loveStatisticsService = inject(LoveStatisticsService);

  lastFights: Signal<Fight[]> = toSignal(
    this.refreshToken.pipe(
      switchMap(() =>
        this.loveStatisticsService
          .getFights()
          .pipe(
            map((fights) =>
              fights.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
            )
          )
      )
    ),
    {
      initialValue: [
        { id: 0, timestamp: '', reconciledOnSameDay: false },
      ] as Fight[],
    }
  );

  lastFight: Signal<Fight> = computed(() => this.lastFights()[0]);

  daysSinceLastFight: Signal<number> = computed(() => {
    const lastFight = this.lastFight();
    if (!lastFight) {
      return 0;
    }
    const today = new Date();
    const lastFightDate = new Date(lastFight.timestamp);
    const diffTime = Math.abs(today.getTime() - lastFightDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays - 1;
  });

  ngOnInit(): void {
    this.refreshToken.next();
  }
}
