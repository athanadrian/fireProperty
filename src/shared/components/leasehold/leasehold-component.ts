import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';

import { LeaseholdService } from '../../../providers/services';
import { Leasehold } from '../../../models/models';
import {
  LeaseholdDetailPage, CreatePropertyPage, PropertyDetailPage,
  AddLeaseholdPage, BrokerListPage, ContractListPage, HomePage,
  RenterListPage, OwnerListPage
} from '../../../pages/pages';

@Component({
  selector: 'leasehold-card',
  templateUrl: 'leasehold-component.html'
})
export class LeaseholdComponent {

  @Input() leasehold: Leasehold;
  //@Output() onViewBrokers = new EventEmitter<string>();

  constructor(
    public navController: NavController,
    public actionSheetController: ActionSheetController,
    public platform: Platform) {
  }

  viewLeasehold(leaseholdId: string) {
    this.navController.push(LeaseholdDetailPage,
      { leaseholdId: leaseholdId });
  }

  moreLeaseholdOptions(leaseholdId: string) {
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

  viewBrokers() {
    this.navController.push(BrokerListPage,
      {
        leaseholdId: this.leasehold.$key,
        isListPage: true,
        addOptions: false
      });
  }

  viewContracts() {
    this.navController.push(ContractListPage,
      {
        leaseholdId: this.leasehold.$key,
        isListPage: true,
        addOptions: false
      });
  }

  viewOwners() {
    this.navController.push(OwnerListPage,
      {
        leaseholdId: this.leasehold.$key,
        isListPage: true,
        addOptions: false
      });
  }

  viewRenters() {
    this.navController.push(RenterListPage,
      {
        leaseholdId: this.leasehold.$key,
        isListPage: true,
        addOptions: false
      });
  }

  viewPayments() {
    this.navController.push(HomePage,
      {
        leaseholdId: this.leasehold.$key,
        isListPage: true,
        addOptions: false
      });
  }
}
