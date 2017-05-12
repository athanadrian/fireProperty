import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';

import { AddRenterPage, RenterDetailPage } from '../../pages/pages';
import { Renter } from '../../models/models';

@Component({
  selector: 'page-renter-list',
  templateUrl: 'renter-list.html'
})
export class RenterListPage {

  public rentersVM: any;
  public totalRenters: number;
  public contractId: string;
  public renterId: string;
  public leaseholdId: string;
  public addOptions: boolean = false;

  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public leaseholdService: LeaseholdService,
    public actionSheetController: ActionSheetController) {

    this.leaseholdId = this.navParams.get('leaseholdId');
    this.contractId = this.navParams.get('contractId');
    this.renterId = this.navParams.get('renterId');
    this.addOptions = !this.leaseholdId ? true : this.navParams.get('addOptions');

    if (this.addOptions) {
      this.getAllRentersVM();
    } else {
      this.getRentersForLeasehold();
    }
  }
  getAllRentersVM() {
    this.rentersVM = this.leaseholdService.getAllRentersVM()
      .map((rentersVM) => {
        this.totalRenters = rentersVM.length
        return rentersVM.map(renter => {
          const leaseholds$ = this.leaseholdService.getLeaseholdsForRenter(renter.$key)
          leaseholds$.subscribe(leaseholds => renter.leaseholds = leaseholds);
          const contracts$ = this.leaseholdService.getContractsForRenter(renter.$key)
          contracts$.subscribe(contracts => renter.contracts = contracts);
          const payments$ = this.leaseholdService.getPaymentsForRenter(renter.$key)
          payments$.subscribe(payments => renter.payments = payments);
          return renter;
        });
      });
  }

  getRentersForLeasehold() {
    this.rentersVM = this.leaseholdService.getRentersForLeasehold(this.leaseholdId)
      .map((rentersVM) => {
        this.totalRenters = rentersVM.length
        return rentersVM.map(renter => {
          const leaseholds$ = this.leaseholdService.getLeaseholdsForRenter(renter.$key)
          leaseholds$.subscribe(leaseholds => renter.leaseholds = leaseholds);
          const contracts$ = this.leaseholdService.getContractsForRenter(renter.$key)
          contracts$.subscribe(contracts => renter.contracts = contracts);
          const payments$ = this.leaseholdService.getPaymentsForRenter(renter.$key)
          payments$.subscribe(payments => { renter.payments = payments });
          return renter;
        });
      });
  }
}
