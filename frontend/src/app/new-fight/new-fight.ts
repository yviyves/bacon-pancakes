import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoveStatisticsService } from '../love-statistics/love-statistics.service';

@Component({
  selector: 'app-new-fight',
  imports: [ReactiveFormsModule],
  templateUrl: './new-fight.html',
  styleUrl: './new-fight.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewFightComponent {
  todayDate = new Date().toISOString().split('T')[0];
  loveStatisticsService = inject(LoveStatisticsService);
  @Output() refresh = new EventEmitter<void>();

  newFightForm = new FormGroup({
    selectedDate: new FormControl('', [Validators.required]),
    reconciledOnSameDay: new FormControl<boolean>(false, { nonNullable: true }),
  });

  onSubmit() {
    setTimeout(() => {
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
