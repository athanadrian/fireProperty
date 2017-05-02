import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';
import { Observable } from 'rxjs/Rx';

import { AddLeaseholdPage, LeaseholdDetailPage, BrokerListPage } from '../../pages/pages';
import { Leasehold } from '../../models/models';

@Component({
  selector: 'page-leasehold-list',
  templateUrl: 'leasehold-list.html'
})
export class LeaseholdListPage {

  public leaseholds$: Leasehold[];
  public leaseholdsVM: any;
  public totalLeaseholds: number;
  public renterId:string;

  constructor(
    public navController: NavController,
    public navParams:NavParams,
    public platform: Platform,
    public leaseholdService: LeaseholdService,
    public actionSheetController: ActionSheetController) {

    this.renterId=this.navParams.get('renterId');

    if(!this.renterId){
      this.getAllLeaseholdsVM();
    } else {
      this.getLeaseholdsForRenter()
    }
  }

  getAllLeaseholdsVM(){
    this.leaseholdsVM = this.leaseholdService.getAllLeaseholdsVM()
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
          const payments$ = this.leaseholdService.getPaymentsForLeasehold(leasehold.$key)
          payments$.subscribe(payments => leasehold.payments = payments);
          return leasehold
        });
      });
  }

  getLeaseholdsForRenter(){
    this.leaseholdsVM = this.leaseholdService.getLeaseholdsForRenter(this.renterId)
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
          const payments$ = this.leaseholdService.getPaymentsForLeasehold(leasehold.$key)
          payments$.subscribe(payments => leasehold.payments = payments);
          return leasehold
        });
      });
  }
}
