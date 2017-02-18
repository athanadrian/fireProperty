import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import firebase from 'firebase';

@Injectable()
export class AuthService {

  fireAuth: any;

  constructor(public http: Http, public af: AngularFire) {
    af.auth.subscribe(user => {
      if (user) {
        this.fireAuth = user.auth;
      }
      console.log('User: ', user);
    });
  }


  getUser() {
    return this.fireAuth;
  }

  loginUser(newEmail: string, newPassword: string): any {
    return this.af.auth.login({ 
      email: newEmail,
      password: newPassword
    });
  }

  anonymousLogin() {
    return this.af.auth.login({
      provider: AuthProviders.Anonymous,
      method: AuthMethods.Anonymous
    });
  }

  connectAccount(email, password) {
    const userProfile = firebase.database().ref('/userProfile');
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);

    return this.fireAuth.link(credential).then((user) => {
      userProfile.child(user.uid).update({
        email: email
      });
    }, (error) => {
      console.log('Account connecting error ', error);
    });
  }

  resetPassword(email: string): any {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): any {
    return this.af.auth.logout();
  }

}
