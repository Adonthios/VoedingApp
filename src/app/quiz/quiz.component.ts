import { Component, OnInit, Input } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { HelperService } from '../services/helper.service';
import { QuizResult } from '../models/quiz-result';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { Option, Question, Quiz, QuizConfig } from '../models/index';
import { AuthService }  from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  providers: [QuizService]
})

export class QuizComponent implements OnInit {
  show: string = "quiz";
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

  // This object keeps track of the users progress within a quiz
  toCreateQuizResult: QuizResult = {
    '$key' : "",
    'uid': "",
    'email' : "",
    'quizid' : 0,
    'correctFirstTime': 0
  };
  key: string;

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

  constructor(private quizService: QuizService, public authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (!this.authService.isUserEmailLoggedIn) {
      this.router.navigate(['/'])
    } else {
      this.quizes = this.quizService.getAll();
      this.quizName = this.quizes[0].id;
      this.state = "quizLoading";
    }
  }

  loadQuiz(quizName: string) {
    this.quizService.get(quizName).subscribe(res => {
      this.quiz = new Quiz(res);
      this.pager.count = this.quiz.questions.length;
      this.quizProgress = ((this.pager.index + 1) / this.pager.count) * 100;

      // update quiz result
      this.toCreateQuizResult.quizid = this.quiz.id;
      this.toCreateQuizResult.uid = this.authService.currentUserId;
      this.toCreateQuizResult.email = this.authService.currentUserName;
      this.key = this.quizService.createQuizResult(this.toCreateQuizResult);
      console.log("key", this.key);
      console.log("toCreateQuizResult", this.toCreateQuizResult);
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
    // update quiz result data
    var quizResultUpdate = { correctFirstTime: this.correctFirstTime}
    this.quizService.updateQuizResult(this.key, quizResultUpdate);
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

  showQuiz() {
    this.show = "quiz";
  }

  showList() {
    this.show = "list";
  }
}
