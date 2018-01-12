import {AngularFireAuth} from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';

@Injectable()
export class AuthService {

    private dbPath: string = '/users';
    userObservable: FirebaseListObservable<any> = null;
    userObservables: FirebaseListObservable<User[]> = null;

    user: User = null;

    constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private router: Router) {
      this.userObservables = this.db.list('users');
      this.afAuth.authState.subscribe((auth) => {
        if (auth != null) {
          this.getUserByUID(auth.uid);
        }
      });
    }

    get currentUserId(): string {
      return (this.user !== null) ? this.user.uid : ''
    }

    get currentUserName(): string {
      return this.user.displayName;
    }

    get currentUserEmail(): string {
      return this.user.email;
    }

    get currentUser(): User {
      return (this.user !== null) ? this.user : null;
    }

    get isUserEmailLoggedIn(): boolean {
      if (this.user !== null) {
        return true
      } else {
        return false
      }
    }

    signUpWithEmail(email: string, password: string, displayName: string) {
      return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
          this.user = {
            'uid': user.uid,
            'displayName': displayName,
            'email': user.email,
          };
          this.saveNewUser(this.user);
        })
        .catch(error => {
          console.log(error)
          throw error
        });
    }

    getUserByUID(key: string): void {
      this.userObservable = this.db.list('users', {
        query: {
          orderByChild: 'uid',
          equalTo: key
        }
      });
      this.userObservable.subscribe(myUser => {
        this.user = {
          'uid': myUser[0].uid,
          'displayName': myUser[0].displayName,
          'email': myUser[0].email,
        }
      });
    }

    saveNewUser(user: User): void {
      this.userObservables.push(user);
    }

    loginWithEmail(email: string, password: string) {
      return this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then((user) => {
          this.getUserByUID(user.uid);
        })
        .catch(error => {
          console.log(error)
          throw error
        });
    }

    signOut(): void {
      this.afAuth.auth.signOut();
      this.user = null;
      this.router.navigate(['/'])
    }
  }
