import { Component } from '@angular/core';
import { LoveStatistics } from './love-statistics/love-statistics';
import { Background } from './background/background';

@Component({
  selector: 'app-root',
  imports: [LoveStatistics, Background],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'bacon-pancakes';
}
