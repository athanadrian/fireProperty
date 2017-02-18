import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/services';
import { LoginPage } from '../pages';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {

  constructor(public navController: NavController, public authService:AuthService) {}

  goToLogin(){
    this.navController.push(LoginPage);
  }

  goToPaymentsList(){
    this.authService.anonymousLogin().then(()=>{
      console.log('Anonymous Login OK')
    });
  }

}
