import { Component } from '@angular/core';
import { LoveStatistics } from './love-statistics/love-statistics';

@Component({
  selector: 'app-root',
  imports: [LoveStatistics],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'bacon-pancakes';
}
