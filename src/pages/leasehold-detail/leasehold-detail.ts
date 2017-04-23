import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { LeaseholdService } from '../../providers/services';
import {
  AddLeaseholdPage, AddOwnerPage, RenterListPage, OwnerDetailPage, OwnerListPage,
  AddContractPage, RenterDetailPage, ContractDetailPage, AddRenterPage, BrokerListPage
} from '../../pages/pages';
import { Leasehold, Contract, Owner, OwnerVM, Renter } from '../../models/models';

@Component({
  selector: 'page-leasehold-detail',
  templateUrl: 'leasehold-detail.html'
})
export class LeaseholdDetailPage {

  public leasehold$: any;
  public contract$: any;
  public contracts: Contract[];
  public owners: any;
  public owners$: Owner[];
  public renters: any;
  public renters$: Renter[];
  public leaseholdId: string;
  public isListPage: boolean;


  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public leaseholdService: LeaseholdService,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController) {

    this.leaseholdId = this.navParams.get('leaseholdId');
    this.owners = this.leaseholdService.getOwnersForLeasehold(this.leaseholdId)
      .map((owners) => {
        return owners.map(owner => {
          const leaseholds$ = this.leaseholdService.getLeaseholdsForOwner(owner.$key)
          leaseholds$.subscribe(leaseholds => owner.leaseholds = leaseholds)
          return owner;
        });
      });
    this.renters = this.leaseholdService.getRentersForLeasehold(this.leaseholdId)
      .map((renters) => {
        return renters.map(renter => {
          const leaseholds$ = this.leaseholdService.getLeaseholdsForRenter(renter.$key)
          leaseholds$.subscribe(leaseholds => renter.leaseholds = leaseholds)
          return renter;
        });
      });
  }

  ionViewDidLoad() {
    const renters$ = this.leaseholdService.getRentersForLeasehold(this.leaseholdId)
    renters$.subscribe(renters => this.renters$ = renters);
    const owners$ = this.leaseholdService.getOwnersForLeasehold(this.leaseholdId)
    owners$.subscribe(owners => this.owners$ = owners);
    const contracts$ = this.leaseholdService.getContractsForLeasehold(this.leaseholdId)
    contracts$.subscribe(contracts => this.contracts = contracts);
    this.leasehold$ = this.leaseholdService.findLeasehold(this.leaseholdId);
    this.leaseholdService.findContractForLeasehold(this.leaseholdId)
      .subscribe(contract => this.contract$ = contract);
  }

  moreContractOptions(contractId: string) {
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
      buttons: [
        {
          text: 'Delete Leasehold',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            //this.leaseholdService.removeLeasehold(leaseholdId);
            this.navController.pop();
          }
        },
        {
          text: 'Edit this leasehold',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(AddLeaseholdPage, {
              leaseholdId: this.leaseholdId
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

  showRentItConfirmation() {
    if (this.renters) {
      let confirm = this.alertController.create({
        title: 'Add Renter',
        buttons: [
          {
            text: 'Add Renter from list?',
            handler: () => {
              this.navController.push(RenterListPage,
                {
                  leaseholdId: this.leaseholdId,
                  isListPage: true,
                  addOptions: true
                })
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
            text: 'Add renter?',
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

  showOwnerConfirmation() {
    let confirm = this.alertController.create({
      title: 'Add Owner',
      buttons: [
        {
          text: 'Add owner from list?',
          handler: () => {
            this.navController.push(OwnerListPage,
              {
                leaseholdId: this.leaseholdId,
                isListPage: true,
                addOptions: true
              })
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
  }

  addRenter() {
    this.showRentItConfirmation();
  }

  addContract() {
    this.navController.push(AddContractPage, {
      leaseholdId: this.leaseholdId
    });
  }

  addOwner() {
    this.showOwnerConfirmation();
  }

  findBrokers() {
    this.navController.push(BrokerListPage,
      { leaseholdId: this.leaseholdId });
  }

}
