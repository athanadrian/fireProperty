import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';
import { Observable } from 'rxjs/Rx';

import { AddBrokerPage } from '../../pages/pages';
import { Broker, BrokerVM, Leasehold } from '../../models/models';

@Component({
  selector: 'page-broker-list',
  templateUrl: 'broker-list.html'
})
export class BrokerListPage {

  public brokers$: Broker[];
  public brokersVM: any;
  public leaseholdId: string;
  public addOption:boolean=false;

  constructor(
    public navController: NavController,
    public platform: Platform,
    public leaseholdService: LeaseholdService,
    public actionSheetController: ActionSheetController,
    public navParams: NavParams) {

    this.leaseholdId = this.navParams.get('leaseholdId');
   
    if (!this.leaseholdId) {
      this.brokersVM = this.leaseholdService.getAllBrokersVM()
        .map((brokersVM) => {
          return brokersVM.map(broker => {
            const leaseholds$ = this.leaseholdService.getLeaseholdsForBroker(broker.$key)
            leaseholds$.subscribe(leaseholds => broker.leaseholds = leaseholds)
            return broker;
          });
        });
    } else {
      this.brokersVM = this.leaseholdService.getBrokersForLeasehold(this.leaseholdId)
        .map((brokersVM) => {
          return brokersVM.map(broker => {
            const leaseholds$ = this.leaseholdService.getLeaseholdsForBroker(broker.$key)
            leaseholds$.subscribe(leaseholds => broker.leaseholds = leaseholds)
            return broker;
          });
        });
    }
  }

  ionViewDidLoad() {
    this.leaseholdService.getAllBrokers()
      .subscribe(brokers => this.brokers$ = brokers);
  }

  addBrokerToLeasehold(leaseholdId: string) {
    this.navController.push(AddBrokerPage, { leaseholdId: leaseholdId })
  }

}
