import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';

import { LeaseholdService } from '../../providers/services';
import { Leasehold } from '../../models/models';
import { LeaseholdDetailPage, AddBrokerPage, AddLeaseholdPage } from '../../pages/pages';

@Component({
  selector: 'page-broker-detail',
  templateUrl: 'broker-detail.html'
})
export class BrokerDetailPage {

  public brokerId: string;
  public broker$: any;
  public leaseholdsVM: any;
  public totalLeaseholds: number;

  constructor(
    public navController: NavController,
    public platform: Platform,
    public leaseholdService: LeaseholdService,
    public navParams: NavParams,
    public actionSheetController: ActionSheetController) {

    this.brokerId = this.navParams.get('brokerId');
    this.broker$ = this.leaseholdService.findBroker(this.brokerId);
    this.leaseholdsVM = this.leaseholdService.getLeaseholdsForBroker(this.brokerId)
      .map((leaseholds) => {
        this.totalLeaseholds = leaseholds.length;
        return leaseholds.map(leasehold => {
          const renters$ = this.leaseholdService.getRentersForLeasehold(leasehold.$key)
          renters$.subscribe(renters => leasehold.renters = renters);
          const owners$ = this.leaseholdService.getOwnersForLeasehold(leasehold.$key)
          owners$.subscribe(owners => leasehold.owners = owners);
          const brokers$ = this.leaseholdService.getBrokersForLeasehold(leasehold.$key)
          brokers$.subscribe(brokers => leasehold.brokers = brokers);
          const contracts$ = this.leaseholdService.getContractsForLeasehold(leasehold.$key)
          contracts$.subscribe(contracts => leasehold.contracts = contracts);
          return leasehold
        });
      });
  }

  moreBrokerOptions() {
    let actionSheet = this.actionSheetController.create({
      title: 'Broker Options',
      buttons: [
        {
          text: 'Delete broker',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            //this.leaseholdService.removeContract(contractId);
            this.navController.pop();
          }
        },
        {
          text: 'Edit this broker',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(AddBrokerPage, {
              brokerId: this.brokerId
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
