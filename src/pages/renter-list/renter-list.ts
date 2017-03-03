import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';
//import { Observable } from 'rxjs/Rx';

import { AddRenterPage, RenterDetailPage } from '../../pages/pages';
import { Renter } from '../../models/models';

@Component({
  selector: 'page-renter-list',
  templateUrl: 'renter-list.html'
})
export class RenterListPage {

  public renters$:Renter[];

  constructor(public navController: NavController, public platform:Platform, public leaseholdService: LeaseholdService,
              public actionSheetController:ActionSheetController) { }

  ionViewDidLoad() {
    this.leaseholdService.getAllRenters()
      .subscribe(renters=>this.renters$=renters);
  }

  moreRenterOptions(renterId){
    let actionSheet = this.actionSheetController.create({
      title: 'Renter Options',
      //cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Edit this renter',
          //cssClass:'red-color',
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
