import { Component, Input } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';

import { Leasehold } from '../../../models/models';
import { LeaseholdDetailPage, CreatePropertyPage, PropertyDetailPage, AddLeaseholdPage } from '../../../pages/pages';

@Component({
  selector: 'leasehold-card',
  templateUrl: 'leasehold-component.html'
})
export class LeaseholdComponent {


  @Input() leasehold: Leasehold;

  constructor(public navController: NavController, public actionSheetController: ActionSheetController,
    public platform: Platform) {

  }

  viewLeasehold(leaseholdId: string) {
    this.navController.push(LeaseholdDetailPage,
      { leaseholdId: leaseholdId });
  }

  moreLeaseholdOptions(leaseholdId:string){
    let actionSheet = this.actionSheetController.create({
      title: 'Leasehold Options',
      buttons: [
        {
          text: 'Edit this leasehold',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(AddLeaseholdPage, {
              leaseholdId: leaseholdId
            });
          }
        },
        {
          text: 'Show this leasehold details',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(LeaseholdDetailPage, {
              leaseholdId: leaseholdId
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
