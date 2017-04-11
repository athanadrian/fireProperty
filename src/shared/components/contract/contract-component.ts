import { Component, Input } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';

import { Contract } from '../../../models/models';
import { ContractDetailPage, AddContractPage } from '../../../pages/pages';

@Component({
  selector: 'contract-card',
  templateUrl: 'contract-component.html'
})
export class ContractComponent {

  public isListPage: boolean = false;
  @Input() contract: Contract;

  constructor(
    public navController: NavController,
    public actionSheetController: ActionSheetController,
    public platform: Platform) { }

    moreContractOptions(contractId:string) {
    let actionSheet = this.actionSheetController.create({
      title: 'Contract Options',
      buttons: [
        {
          text: !this.isListPage ? 'Release Contract' : 'Delete Contract' ,
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            if (!this.isListPage) {
              //release contract from leasehold
            } else {
              //delete contract
            }
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
          text: 'Show this contract details',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(ContractDetailPage, {
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
