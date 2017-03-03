import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';
import { Observable } from 'rxjs/Rx';

import { AddContractPage } from '../../pages/pages';
import { Contract } from '../../models/models';


@Component({
  selector: 'page-contract-detail',
  templateUrl: 'contract-detail.html'
})
export class ContractDetailPage {

constructor(public navController: NavController, public platform:Platform, public leaseholdService: LeaseholdService,
              public actionSheetController:ActionSheetController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractDetailPage');
  }

  moreContractOptions(contractId) {
    let actionSheet = this.actionSheetController.create({
      title: 'Contract Options',
      buttons: [
        {
          text: 'Delete Contract',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            //this.leaseholdService.removeContract(contractId);
            this.navController.pop();
          }
        },
        {
          text: 'Edit this contract',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(AddContractPage, {
              contractId: contractId
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
