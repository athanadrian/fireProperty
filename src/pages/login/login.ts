import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../providers/services';
import { ResetPasswordPage, HomePage } from '../pages';
import { EmailValidator } from '../../shared/validators/email';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loginForm: any;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;

  constructor(public navController: NavController, public loadingController: LoadingController,
    public alertController: AlertController, public formBuilder: FormBuilder, public authService: AuthService) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  goToResetPassword() {
    this.navController.push(ResetPasswordPage);
  }

  loginUser() {
    //this.submitAttempt = true;
    if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      this.authService.loginUser(this.loginForm.value.email,
        this.loginForm.value.password).then(() => {
          this.loading.dismiss().then(() => {
            this.navController.setRoot(HomePage);
          });
        }, (error) => {
          this.loading.dismiss().then(() => {
            let alert = this.alertController.create({
              message: error,
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });
      this.loading = this.loadingController.create();
      this.loading.present();
    }
  }

}
