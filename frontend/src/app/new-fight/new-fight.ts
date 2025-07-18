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
import { LoveStatisticsService } from '../core/injectables/love-statistics.service';
import { GlobalRefreshToken } from '../core/injectables/refresh.token';

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
  refreshToken = inject(GlobalRefreshToken);

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
          this.refreshToken.next();
          this.newFightForm.reset();
        });
    }, 10);
  }

  onCancel() {
    this.newFightForm.reset();
    this.refreshToken.next();
  }
}
