import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { LeaseholdService } from '../../providers/services';
import { AddLeaseholdPage, AddOwnerPage, RenterListPage, AddContractPage, AddRenterPage } from '../../pages/pages';
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
    console.log('c: ', this.contract$);
  }

  ionViewDidLoad() {
    const renters$ = this.leaseholdService.getRentersForLeasehold(this.leaseholdId)
    renters$.subscribe(renters => this.renters = renters);
    const owners$ = this.leaseholdService.getOwnersForLeasehold(this.leaseholdId)
    owners$.subscribe(owners => this.owners = owners);
    const contracts$ = this.leaseholdService.getContractsForLeasehold(this.leaseholdId)
    contracts$.subscribe(contracts => this.contracts = contracts);
    this.leasehold$=this.leaseholdService.findLeasehold(this.leaseholdId);
      //.subscribe(leasehold=>this.leasehold$=leasehold);
    this.leaseholdService.findContract(this.leaseholdId)
      .subscribe(contract=>this.contract$=contract);
  }

  moreRenterOptions() {
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
          text: 'Edit this renter',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(AddRenterPage, {
              renterId: this.contract$.renterId
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

  insertRenter() {
    this.showRentItConfirmation();
  }

  showRentItConfirmation() {
    if (this.renters) {
      let confirm = this.alertController.create({
        title: 'Add Renter',
        buttons: [
          {
            text: 'Add an existing Renter?',
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
                { leaseholdId: this.leaseholdId })
            }
          }
        ]
      });
      confirm.present();
    }
  }
}
