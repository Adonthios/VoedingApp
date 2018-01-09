import { Component } from '@angular/core';

import { QuizComponent } from './quiz/quiz.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  show: string = 'quiz';

  showQuiz() {
    this.show = "quiz";
  }

  showList() {
    this.show = "list";
  }





}
