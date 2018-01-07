import { Component } from '@angular/core';

import { QuizComponent } from './quiz/quiz.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Voedings quiz app';
  description = "Alles over goede voeding";
}
