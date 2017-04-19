import { Component, Input } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';

import { Renter } from '../../../models/models';
import { RenterDetailPage, AddRenterPage } from '../../../pages/pages';

@Component({
  selector: 'renter-card',
  templateUrl: 'renter-component.html'
})
export class RenterComponent {

  public isListPage: boolean = false;
  @Input() renter: Renter;

  constructor(
    public navController: NavController,
    public actionSheetController: ActionSheetController,
    public platform: Platform,
    public navParams: NavParams) {

    this.isListPage = this.navParams.get('isListPage');
  }

  moreRenterOptions(renterId: string) {
    let actionSheet = this.actionSheetController.create({
      title: 'Renter Options',
      buttons: [
        {
          text: !this.isListPage ? 'Remove Renter' : 'Delete Renter',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            if (!this.isListPage) {
              //remove renter from leasehold
            } else {
              //delete renter
            }
            this.navController.pop();
          }
        },
        {
          text: 'Edit this renter',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(AddRenterPage, {
              renterId: renterId
            });
          }
        },
        {
          text: 'Show this renter details',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(RenterDetailPage, {
              renterId: renterId
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}