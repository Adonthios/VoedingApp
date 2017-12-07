import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class QuizService {

  constructor(private http: Http) { }

  get(url: string) {
    return this.http.get(url).map(res => res.text().length > 0 ? res.json() : null);
  }

  getAll() {
    return [
      { id: 'assets/quizen/schijfvanvijf.json', name: 'Schijf van Vijf' },
      { id: 'assets/quizen/koolhydraten.json', name: 'Koolhydraten' },
      { id: 'assets/quizen/vetten.json', name: 'Vetten' }
    ];
  }
}
