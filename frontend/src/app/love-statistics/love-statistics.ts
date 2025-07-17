import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Renderer2,
  Signal,
  ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { LoveStatisticsService } from './love-statistics.service';

@Component({
  selector: 'app-love-statistics',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './love-statistics.html',
  styleUrl: './love-statistics.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class LoveStatistics {
  @ViewChild('spanElement', { static: true }) spanElement!: ElementRef;

  lastFights: Signal<string | undefined> = toSignal(
    inject(LoveStatisticsService)
      .getFights()
      .pipe(map((fights) => fights[0]?.timestamp))
  );
  selectedDate = new FormControl('', Validators.required);
  loveStatisticsService = inject(LoveStatisticsService);

  constructor(private renderer: Renderer2) {}

  onSubmit() {
    const element = this.spanElement.nativeElement;
    this.renderer.removeClass(element, 'animate');

    setTimeout(() => {
      this.renderer.addClass(element, 'animate');
      this.loveStatisticsService.addFight(this.selectedDate.value!);
    }, 10);
  }
}
