import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { QuizService } from '../services/quiz.service';
import { QuizResult } from '../models/quiz-result';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Component({
  selector: 'ranklist',
  templateUrl: './ranklist.component.html',
  styleUrls: ['./ranklist.component.css'],
  providers: [QuizService]
})
export class RanklistComponent implements OnInit {
  private dbPath: string = '/quizResults';
  quizResultListOne: QuizResult[];
  quizResultListTwo: QuizResult[];
  quizResultListThree: QuizResult[];
  quizResultListFour: QuizResult[];

  constructor(private quizService: QuizService) { }

  ngOnInit() {
    this.quizService.getQuizResultsByID(1);
    this.quizService.getQuizResultsByID(2);
    this.quizService.getQuizResultsByID(3);
    this.quizService.getQuizResultsByID(4);

    setTimeout(this.setData(), 600);
  }


  setData() {
    this.quizResultListOne = this.quizService.returnQuizResultListOne;
    this.quizResultListTwo = this.quizService.returnQuizResultListTwo;
    this.quizResultListThree = this.quizService.returnQuizResultListThree;
    this.quizResultListFour = this.quizService.returnQuizResultListFour;
  }
}
