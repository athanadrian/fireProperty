import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';

import { LeaseholdService } from '../../providers/services';
import { AddRenterPage } from '../../pages/pages';
import { Renter } from '../../models/models';


@Component({
  selector: 'page-renter-detail',
  templateUrl: 'renter-detail.html'
})
export class RenterDetailPage {

  public renter$: any;
  public renterId: string;

  constructor(public navController: NavController, public platform: Platform, public leaseholdService: LeaseholdService,
    public actionSheetController: ActionSheetController, public navParams: NavParams) {
    this.renterId = this.navParams.get('renterId');
  }

  ionViewDidLoad() {
    this.renter$ = this.leaseholdService.findRenter(this.renterId);
    //.subscribe(renter => this.renter$ = renter);
  }

  moreRenterOptions(renterId) {
    let actionSheet = this.actionSheetController.create({
      title: 'Renter Options',
      //cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Delete Renter',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            //this.leaseholdService.removeContract(contractId);
            this.navController.pop();
          }
        },
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
