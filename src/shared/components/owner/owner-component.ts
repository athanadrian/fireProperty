import { Component, Input } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';

import { Owner } from '../../../models/models';
import { OwnerDetailPage, AddOwnerPage } from '../../../pages/pages';

@Component({
  selector: 'owner-card',
  templateUrl: 'owner-component.html'
})
export class OwnerComponent {

  @Input() owner: Owner;

  constructor(public navController: NavController, public actionSheetController: ActionSheetController,
    public platform: Platform) {

  }

  viewLeasehold(ownerId: string) {
    this.navController.push(OwnerDetailPage,
      { ownerId: ownerId });
  }

  moreOwnerOptions(ownerId: string) {
    let actionSheet = this.actionSheetController.create({
      title: 'Owner Options',
      buttons: [
        {
          text: 'Edit this owner',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(AddOwnerPage, {
              ownerId: ownerId
            });
          }
        },
        {
          text: 'Show this owner details',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(OwnerDetailPage, {
              ownerId: ownerId
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
