import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, Subject, switchMap } from 'rxjs';
import { LoveStatisticsService } from './love-statistics.service';

@Component({
  selector: 'app-love-statistics',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './love-statistics.html',
  styleUrl: './love-statistics.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class LoveStatistics implements OnInit {
  @ViewChild('spanElement', { static: true }) spanElement!: ElementRef;
  refresh = new Subject<void>();
  loveStatisticsService = inject(LoveStatisticsService);
  todayDate = new Date().toISOString().split('T')[0];

  lastFight = toSignal(
    this.refresh.pipe(
      switchMap(() =>
        this.loveStatisticsService
          .getFights()
          .pipe(map((fights) => fights[fights.length - 1]?.timestamp))
      )
    )
  );

  daysSinceLastFight = computed(() => {
    const lastFight = this.lastFight();
    if (!lastFight) {
      return 0;
    }
    const today = new Date();
    const lastFightDate = new Date(lastFight);
    const diffTime = Math.abs(today.getTime() - lastFightDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays - 1;
  });

  selectedDate = new FormControl('', [Validators.required]);

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.refresh.next();
  }

  onSubmit() {
    const element = this.spanElement.nativeElement;
    this.renderer.removeClass(element, 'animate');

    setTimeout(() => {
      this.renderer.addClass(element, 'animate');
      this.loveStatisticsService
        .addFight(this.selectedDate.value!)
        .subscribe(() => {
          this.refresh.next();
        });
    }, 10);
  }
}
