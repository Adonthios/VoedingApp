import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UserLoginComponent} from './auth/user-login/user-login.component';
import {QuizComponent} from './quiz/quiz.component';
import {UserInfoComponent} from './auth/user-info/user-info.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'quiz', component: QuizComponent },
  {path: 'login', component: UserLoginComponent},
  {path: 'user', component: UserInfoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
