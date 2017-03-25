import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { LeaseholdService } from '../../providers/services';
import {
  AddLeaseholdPage, AddOwnerPage, RenterListPage, OwnerDetailPage,
  AddContractPage, RenterDetailPage, ContractDetailPage, AddRenterPage
} from '../../pages/pages';
import { Property, Leasehold, Contract, Owner, Renter } from '../../models/models';

@Component({
  selector: 'page-leasehold-detail',
  templateUrl: 'leasehold-detail.html'
})
export class LeaseholdDetailPage {

  public leasehold$: any;
  public contract$: any;
  public contracts: Contract[];
  public owners: Owner[];
  public renters: Renter[];
  public leaseholdId: string;

  constructor(public navController: NavController, public navParams: NavParams, public platform: Platform,
    public leaseholdService: LeaseholdService, public alertController: AlertController, public actionSheetController: ActionSheetController) {
    this.leaseholdId = this.navParams.get('leaseholdId');
  }

  ionViewDidLoad() {
    const renters$ = this.leaseholdService.getRentersForLeasehold(this.leaseholdId)
    renters$.subscribe(renters => this.renters = renters);
    const owners$ = this.leaseholdService.getOwnersForLeasehold(this.leaseholdId)
    owners$.subscribe(owners => this.owners = owners);
    const contracts$ = this.leaseholdService.getContractsForLeasehold(this.leaseholdId)
    contracts$.subscribe(contracts => this.contracts = contracts);
    this.leasehold$ = this.leaseholdService.findLeasehold(this.leaseholdId);
    //.subscribe(leasehold=>this.leasehold$=leasehold);
    this.leaseholdService.findContract(this.leaseholdId)
      .subscribe(contract => this.contract$ = contract);
  }

  moreContractOptions(contractId:string) {
    let actionSheet = this.actionSheetController.create({
      title: 'Contract Options',
      buttons: [
        {
          text: 'Release Contract',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            //this.leaseholdService.removeContract(contractId);
            this.navController.pop();
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

  moreLeaseholdOptions(leaseholdId: string) {
    let actionSheet = this.actionSheetController.create({
      title: 'Leasehold Options',
      //cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Delete Leasehold',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            //this.leaseholdService.removeContract(contractId);
            this.navController.pop();
          }
        },
        {
          text: 'Edit this leasehold',
          //cssClass:'red-color',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(AddLeaseholdPage, {
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

  moreRenterOptions(renterId: string) {
    let actionSheet = this.actionSheetController.create({
      title: 'Renter Options',
      buttons: [
        {
          text: 'Release Renter',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            //this.propetyService.removeProperty(propertyId);
            this.navController.pop();
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
          text: 'Add renter for the leasehold',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.insertRenter();
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

  moreOwnerOptions(ownerId: string) {
    let actionSheet = this.actionSheetController.create({
      title: 'Owner Options',
      //cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Add owner to leasehold',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.insertOwner();
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

  insertRenter() {
    this.showRentItConfirmation();
  }

  showRentItConfirmation() {
    if (this.renters) {
      let confirm = this.alertController.create({
        title: 'Add Renter',
        buttons: [
          {
            text: 'Add Renter from list?',
            handler: () => {
              this.navController.push(RenterListPage,
                { leaseholdId: this.leaseholdId })
            }
          },
          {
            text: 'Add a new Renter?',
            handler: () => {
              this.navController.push(AddRenterPage,
                { leaseholdId: this.leaseholdId })
            }
          }
        ]
      });
      confirm.present();
    } else {
      let confirm = this.alertController.create({
        title: 'Add Renter',
        buttons: [
          {
            text: 'Add a new Renter?',
            handler: () => {
              this.navController.push(AddRenterPage,
                { leaseholdId: this.leaseholdId });
            }
          }
        ]
      });
      confirm.present();
    }
  }

  insertOwner(){
    this.showOwnerConfirmation();
  }

  showOwnerConfirmation() {
    if (this.owners) {
      let confirm = this.alertController.create({
        title: 'Add Owner',
        buttons: [
          {
            text: 'Add owner from list?',
            handler: () => {
              this.navController.push(RenterListPage,
                { leaseholdId: this.leaseholdId })
            }
          },
          {
            text: 'Add a new owner?',
            handler: () => {
              this.navController.push(AddOwnerPage,
                { leaseholdId: this.leaseholdId })
            }
          }
        ]
      });
      confirm.present();
    } else {
      let confirm = this.alertController.create({
        title: 'Add Owner',
        buttons: [
          {
            text: 'Add a new owner?',
            handler: () => {
              this.navController.push(AddOwnerPage,
                { leaseholdId: this.leaseholdId });
            }
          }
        ]
      });
      confirm.present();
    }
  }

  addRenter() {
    this.insertRenter();
  }

  addContract() {
    this.navController.push(AddContractPage, {
      leaseholdId: this.leaseholdId
    });
  }

  addOwner() {
    this.insertOwner();
  }

}