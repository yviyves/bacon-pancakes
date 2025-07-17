import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  Renderer2,
  Signal,
  ViewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map, Subject, switchMap } from 'rxjs';
import { LoveStatisticsService } from './love-statistics.service';
import { Fight } from '../model/fight';

@Component({
  selector: 'app-love-statistics',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './love-statistics.html',
  styleUrl: './love-statistics.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class LoveStatistics implements OnInit {
  @ViewChildren('animatedSpan') spanElements!: QueryList<ElementRef>;
  refresh = new Subject<void>();
  loveStatisticsService = inject(LoveStatisticsService);
  todayDate = new Date().toISOString().split('T')[0];

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

  newFightForm = new FormGroup({
    selectedDate: new FormControl('', [Validators.required]),
    reconciledOnSameDay: new FormControl<boolean>(false, { nonNullable: true }),
  });

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.refresh.next();
  }

  onSubmit() {
    this.spanElements.forEach((element) => {
      this.renderer.removeClass(element.nativeElement, 'animate');
    });

    setTimeout(() => {
      this.spanElements.forEach((element) => {
        this.renderer.addClass(element.nativeElement, 'animate');
      });
      this.loveStatisticsService
        .addFight(
          this.newFightForm.value.selectedDate!,
          this.newFightForm.controls.reconciledOnSameDay.value
        )
        .subscribe(() => {
          this.refresh.next();
          this.newFightForm.reset();
        });
    }, 10);
  }
}
