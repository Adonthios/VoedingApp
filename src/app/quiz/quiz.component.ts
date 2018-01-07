import { Component, OnInit } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { HelperService } from '../services/helper.service';
import { Option, Question, Quiz, QuizConfig } from '../models/index';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  providers: [QuizService]
})

export class QuizComponent implements OnInit {
  quizes: any[];
  quiz: Quiz = new Quiz(null);
  mode = 'quiz';
  quizName: string;
  currentAnswer: string;
  currentDescription: string;
  currentUrl: string;
  state: string;
  quizProgress: number;
  timesGuessed: number;
  correctFirstTime: number;

  config: QuizConfig = {
    'allowBack': true,
    'allowReview': true,
    'autoMove': false,  // if true, it will move to next question automatically when answered.
    'duration': 0,  // indicates the time in which quiz needs to be completed. 0 means unlimited.
    'pageSize': 1,
    'requiredAll': false,  // indicates if you must answer all the questions before submitting.
    'richText': false,
    'shuffleQuestions': false,
    'shuffleOptions': false,
    'showClock': false,
    'showPager': true,
    'theme': 'none'
  };

  pager = {
    index: 0,
    size: 1,
    count: 1
  };

  constructor(private quizService: QuizService, public authService: AuthService) { }

  ngOnInit() {
    this.quizes = this.quizService.getAll();
    this.quizName = this.quizes[0].id;
    this.state = "quizLoading";
  }

  loadQuiz(quizName: string) {
    this.quizService.get(quizName).subscribe(res => {
      this.quiz = new Quiz(res);
      this.pager.count = this.quiz.questions.length;
      this.quizProgress = ((this.pager.index + 1) / this.pager.count) * 100;
    });
    this.correctFirstTime = this.timesGuessed = 0;
    this.mode = 'quiz';
    this.state = "quizStarted";
  }

  get filteredQuestions() {
    return (this.quiz.questions) ?
      this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }

  onSelect(question: Question, option: Option) {
    if (question.questionTypeId === 1) {
      question.options.forEach((x) => { if (x.id !== option.id) x.selected = false; });
    }

    this.currentAnswer = this.isCorrect(question);
    this.timesGuessed++;

    this.currentDescription = option.description;
    this.currentUrl = option.url;

    if ((this.isCorrect(question) == 'Goed') && (this.timesGuessed <= 1)) {
      this.correctFirstTime++;
    }
  }

  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.timesGuessed = 0;
      this.mode = 'quiz';
      this.currentAnswer = "";
      this.quizProgress = ((this.pager.index + 1) / this.pager.count) * 100;
    }
  }

  isAnswered(question: Question) {
    return question.options.find(x => x.selected) ? 'Answered' : 'Not Answered';
  };

  isCorrect(question: Question) {
    return question.options.every(x => x.selected === x.isAnswer) ? 'Goed' : 'Fout';
  };

  onSubmit() {
    let answers = [];
    this.quiz.questions.forEach(x => answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered }));

    this.resetPager();
    this.currentAnswer = "";
    this.mode = 'result';
    this.state = "quizLoading";
  }

  resetPager() {
    this.pager = {
      index: 0,
      size: 1,
      count: 1
    };
  }

  stopQuiz() {
    this.resetPager();
    this.currentAnswer = "";
    this.state = "quizLoading";
    this.quiz = new Quiz(null);
  }

  logout() {
    this.authService.signOut();
  }
}
