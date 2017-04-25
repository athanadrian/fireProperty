import { Injectable, Inject } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class NotificationService {

  constructor(
    public toastController: ToastController
  ) { }

  addUpdateToast(objId: string, object: string) {
    let toast = this.toastController.create({
      message: !objId ? `${object} was added successfully` : `${object} was saved successfully`,
      duration: 2000,
      position: 'top',
      cssClass: !objId ? "addSuccessStyle" : "updateSuccessStyle"
    });
    toast.present();
  }

  errorToast(objId: string, object: string, error: any) {
    let toast = this.toastController.create({
      message: !objId ? `Error creating ${object}, ${error}` : `Error saving ${object}, ${error}`,
      duration: 2000,
      position: 'bottom',
      cssClass: "errorStyle"
    });
    toast.present();
  }

}
