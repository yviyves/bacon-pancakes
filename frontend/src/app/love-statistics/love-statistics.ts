import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  Renderer2,
  Signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { map, Subject, switchMap } from 'rxjs';
import { Fight } from '../model/fight';
import { NewFightComponent } from '../new-fight/new-fight';
import { LoveStatisticsService } from './love-statistics.service';

@Component({
  selector: 'app-love-statistics',
  imports: [ReactiveFormsModule, DatePipe, NewFightComponent],
  templateUrl: './love-statistics.html',
  styleUrl: './love-statistics.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class LoveStatistics implements OnInit, AfterViewInit {
  @ViewChildren('animatedSpan') spanElements!: QueryList<ElementRef>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  refresh = new Subject<void>();
  loveStatisticsService = inject(LoveStatisticsService);

  private chartInstance: Chart | null = null;

  lastFights: Signal<Fight[]> = toSignal(
    this.refresh.pipe(
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

  numberOfFightsInLast30Days: Signal<number> = computed(() => {
    const last30Days = this.lastFights().filter((fight) => {
      const fightDate = new Date(fight.timestamp);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - fightDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    });
    return last30Days.length;
  });
  viewFinished = false;

  constructor(private renderer: Renderer2) {
    effect(() => {
      console.log('lastFights', this.lastFights());
      if (this.viewFinished) {
        this.renderChart();
      }
    });
  }

  ngOnInit(): void {
    this.refresh.next();
  }

  ngAfterViewInit(): void {
    this.viewFinished = true;
  }

  private renderChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    const ctx = this.canvas.nativeElement.getContext('2d');
    const fights = this.lastFights().filter((f) => f.timestamp);
    const reversedFights = [...fights].reverse();

    // Get computed CSS custom property values
    const computedStyle = getComputedStyle(document.documentElement);
    const baseColor = computedStyle.getPropertyValue('--base-300').trim();
    const accentColor = computedStyle.getPropertyValue('--accent-300').trim();

    // Group fights by date
    const groupedByDate = reversedFights.reduce((acc, fight) => {
      const dateKey = new Date(fight.timestamp).toLocaleDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = { reconciled: 0, notReconciled: 0 };
      }
      if (fight.reconciledOnSameDay) {
        acc[dateKey].reconciled++;
      } else {
        acc[dateKey].notReconciled++;
      }
      return acc;
    }, {} as Record<string, { reconciled: number; notReconciled: number }>);

    const labels = Object.keys(groupedByDate);
    const reconciledData = labels.map((date) => groupedByDate[date].reconciled);
    const notReconciledData = labels.map(
      (date) => groupedByDate[date].notReconciled
    );

    this.chartInstance = new Chart(ctx!, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Reconciled Same Day',
            data: reconciledData,
            backgroundColor: baseColor,
          },
          {
            label: 'Not Reconciled Same Day',
            data: notReconciledData,
            backgroundColor: accentColor,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: { display: false },
          },
        },
      },
    });
  }

  onRefresh() {
    this.refresh.next();
    this.spanElements.forEach((span) => {
      span.nativeElement.classList.remove('animate');
      setTimeout(() => {
        span.nativeElement.classList.add('animate');
      }, 10);
    });
  }
}
