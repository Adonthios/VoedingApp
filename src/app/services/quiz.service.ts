import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { QuizResult } from '../models/quiz-result';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import 'rxjs/add/operator/map';

@Injectable()
export class QuizService {
  private dbPath: string = '/quizResults';
  quizResult: FirebaseObjectObservable<QuizResult> = null;
  quizResults: FirebaseListObservable<QuizResult[]> = null;
  filteredQuizResults: FirebaseListObservable<QuizResult[]> = null;

  returnList: QuizResult[] = [];

  constructor(private db: AngularFireDatabase, private http: Http) {
    this.quizResults = db.list('quizResults');
  }

  getQuizResultsByID(key: number): void {
    this.returnList = [];
    this.filteredQuizResults = this.db.list('quizResults', {
      query: {
        orderByChild: 'quizid',
        equalTo: key
      }
    });

    this.filteredQuizResults.subscribe(quizResults => {
      quizResults.forEach(qr => {
        var temp: QuizResult = {
          '$key' : "",
          'uid': qr.uid,
          'email' : qr.email,
          'quizid' : key,
          'correctFirstTime': qr.correctFirstTime
        };
        this.returnList.push(temp);
      });
    });
  }

  getReturnList() {
    return this.returnList;
  }

   getQuizResult(key: string): FirebaseObjectObservable<QuizResult> {
     this.quizResult = this.db.object(`${this.dbPath}/${key}`);
     return this.quizResult;
   }

   createQuizResult(quizResultToBeCreated: QuizResult): string {
    delete (quizResultToBeCreated.$key);
    const promise = this.quizResults.push(quizResultToBeCreated);
    return promise.key;
   }

   updateQuizResult(key: string, value: any): void {
     this.quizResults.update(key, value).catch(error => this.handleError(error));
   }

   deleteQuizResult(key: string): void {
     this.quizResults.remove(key).catch(error => this.handleError(error));
   }

   getQuizResultList(query = {}): FirebaseListObservable<QuizResult[]> {
     this.quizResults = this.db.list(this.dbPath, {
       query: query
     });
     return this.quizResults;
   }

   deleteAll(): void {
     this.quizResults.remove().catch(error => this.handleError(error));
   }

   private handleError(error) {
     console.log(error);
   }

  get(url: string) {
    return this.http.get(url).map(res => res.text().length > 0 ? res.json() : null);
  }

  getAll() {
    return [
      { id: 'assets/quizen/easy.json', name: 'Voeding quiz niveau #1' },
      { id: 'assets/quizen/medium.json', name: 'Voeding quiz niveau #2' },
      { id: 'assets/quizen/hard.json', name: 'Voeding quiz niveau #3' },
      { id: 'assets/quizen/extra.json', name: 'Extra vragen en weetjes' }
    ];
  }
}
