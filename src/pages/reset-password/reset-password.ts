import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../providers/services';
import { EmailValidator } from '../../shared/validators/email';

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html'
})
export class ResetPasswordPage {

  resetPasswordForm: any;
  emailChanged: boolean = false;
  submitAttempt: boolean = false;

  constructor(public navController: NavController, public alertController: AlertController,
    public authService: AuthService, public formBuilder: FormBuilder) {
    this.resetPasswordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
    });
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  resetPassword() {
    this.submitAttempt = true;

    if (!this.resetPasswordForm.valid) {
      console.log(this.resetPasswordForm.value);
    } else {
      this.authService.resetPassword(this.resetPasswordForm.value.email).then((user) => {
        let alert = this.alertController.create({
          message: 'We just send you a reset link to your email',
          buttons: [
            {
              text: 'OK',
              role: 'cancel',
              handler: () => {
                this.navController.pop();
              }
            }
          ]
        });
        alert.present();
      }, (error) => {
        let errorAlert = this.alertController.create({
          message: error,
          buttons: [
            {
              text: 'OK',
              role: 'cancel'
            }
          ]
        });
        errorAlert.present();
      });
    }
  }

}
