import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';
import { Observable } from 'rxjs/Rx';

import { AddLeaseholdPage, LeaseholdDetailPage } from '../../pages/pages';
import { Leasehold } from '../../models/models';

@Component({
  selector: 'page-leasehold-list',
  templateUrl: 'leasehold-list.html'
})
export class LeaseholdListPage {

  public leaseholds$: Leasehold[];
  public leaseholdsVM: any;
  public totalLeaseholds: number;

  constructor(
    public navController: NavController,
    public platform: Platform,
    public leaseholdService: LeaseholdService,
    public actionSheetController: ActionSheetController) {

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
}
