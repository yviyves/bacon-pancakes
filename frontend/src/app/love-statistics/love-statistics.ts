import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoveStatisticsHistoryComponent } from '../love-statistics-history/love-statistics-history.component';
import { LoveStatisticsOverviewComponent } from '../love-statistics-overview/love-statistics-overview';
import { NewFightComponent } from '../new-fight/new-fight';
import { GlobalRefreshToken } from '../core/injectables/refresh.token';

@Component({
  selector: 'app-love-statistics',
  imports: [
    ReactiveFormsModule,
    LoveStatisticsOverviewComponent,
    NewFightComponent,
    LoveStatisticsHistoryComponent,
  ],
  templateUrl: './love-statistics.html',
  styleUrl: './love-statistics.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class LoveStatistics implements OnInit {
  refreshToken = inject(GlobalRefreshToken);
  showNewFightForm = signal(false);

  ngOnInit(): void {
    this.refreshToken.subscribe(() => {
      this.showNewFightForm.set(false);
    });
  }
}
