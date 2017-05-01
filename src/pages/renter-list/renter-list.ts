import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';
//import { Observable } from 'rxjs/Rx';

import { AddRenterPage, RenterDetailPage } from '../../pages/pages';
import { Renter } from '../../models/models';

@Component({
  selector: 'page-renter-list',
  templateUrl: 'renter-list.html'
})
export class RenterListPage {

  public renters$:Renter[];
  public rentersVM:any;
  public contractId:string;

  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public platform:Platform,
    public leaseholdService: LeaseholdService,
    public actionSheetController:ActionSheetController) {

      this.contractId = this.navParams.get('contractId');
      console.log('plcId ', this.contractId);
      this.rentersVM = this.leaseholdService.getAllRentersVM()
      .map((renters) => {
        return renters.map(renter => {
          const leaseholds$ = this.leaseholdService.getLeaseholdsForRenter(renter.$key)
          leaseholds$.subscribe(leaseholds => renter.leaseholds = leaseholds);
          const payments$=this.leaseholdService.getPaymentsForRenter(renter.$key)
          payments$.subscribe(payments=>{renter.payments=payments});
          return renter;
        });
      });
    }

  ionViewDidLoad() {
    this.leaseholdService.getAllRenters()
      .subscribe(renters=>this.renters$=renters);
  }

}
