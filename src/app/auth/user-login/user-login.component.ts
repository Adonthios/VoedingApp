import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  isNewUser = false;
  email = '';
  password = '';
  displayName = '';
  errorMessage = '';
  error: { name: string, message: string } = { name: '', message: '' };

  resetPassword = false;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() { }

  checkUserInfo() {
    if (this.authService.isUserEmailLoggedIn) {
      this.router.navigate(['/quiz'])
    }
  }

  clearErrorMessage() {
    this.errorMessage = '';
    this.error = { name: '', message: '' };
  }

  changeForm() {
    this.isNewUser = !this.isNewUser
  }

  onSignUp(): void {
    this.clearErrorMessage()

    if (this.validateForm(this.email, this.password, this.displayName)) {
      this.authService.signUpWithEmail(this.email, this.password, this.displayName)
        .then(() => {
          this.router.navigate(['/quiz'])
        }).catch(_error => {
          let error: any = _error;
          if (error.code === "auth/email-already-in-use") {
            _error.message = "Het e-mail adres is al in gebruik";
          } else if (error.code === "auth/wrong-password") {
            _error.message = "Het wachtwoord is niet juist";
          }
          this.error = _error
          this.router.navigate(['/'])
        })
    }
  }

  onLoginEmail(): void {
    this.clearErrorMessage()

    if (this.validateForm(this.email, this.password, "dummyname")) {
      this.authService.loginWithEmail(this.email, this.password)
        .then(() => this.router.navigate(['/quiz']))
        .catch(_error => {
          this.error = _error
          this.router.navigate(['/'])
        })
    }
  }

  validateForm(email: string, password: string, displayName: string): boolean {
    if (email.length === 0) {
      this.errorMessage = 'Er is geen e-mail adres ingevuld'
      return false
    }

    if (displayName.length === 0) {
      this.errorMessage = 'Er is geen naam ingevuld'
      return false
    }

    if (password.length === 0) {
      this.errorMessage = 'Er is geen wachtwoord ingevuld'
      return false
    }

    if (password.length < 3) {
      this.errorMessage = 'Het wachtwoord moet uit minimaal 3 tekens bestaan'
      return false
    }

    this.errorMessage = ''

    return true
  }

  isValidMailFormat(email: string) {
    const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if ((email.length === 0) && (!EMAIL_REGEXP.test(email))) {
      return false;
    }

    return true;
  }
}
