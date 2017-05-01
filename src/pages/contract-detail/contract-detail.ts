import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';
import { Observable } from 'rxjs/Rx';

import { AddContractPage } from '../../pages/pages';
import { ContractVM } from '../../models/models';


@Component({
  selector: 'page-contract-detail',
  templateUrl: 'contract-detail.html'
})
export class ContractDetailPage {

  public contractId: string;
  public contract: any;

  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public leaseholdService: LeaseholdService,
    public actionSheetController: ActionSheetController) {

    this.contractId = this.navParams.get('contractId');
    this.contract = this.leaseholdService.findContract(this.contractId)
      .map((contract) => {
        const renter$ = this.leaseholdService.findRenter(contract.renterId)
        renter$.subscribe(renter => this.contract.renter = renter);
        const leasehold$ = this.leaseholdService.findLeasehold(contract.leaseholdId)
        leasehold$.subscribe(leasehold => this.contract.leasehold = leasehold);
        const payments$ = this.leaseholdService.getPaymentsForContract(this.contractId)
        payments$.subscribe(payments => {
          this.contract.totalPayments = payments.length;
          this.contract.payments = payments;
           console.log('tc', this.contract.totalPayments)
            console.log('ps', payments)
        });
        console.log('ccc', contract);
       
        return contract;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractDetailPage');
  }

  moreContractOptions() {
    let actionSheet = this.actionSheetController.create({
      title: 'Contract Options',
      buttons: [
        {
          text: 'Delete contract',
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
              contractId: this.contractId
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
