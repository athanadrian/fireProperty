import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
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

  constructor(
    public navController: NavController,
    public platform:Platform,
    public leaseholdService: LeaseholdService,
    public actionSheetController:ActionSheetController) {

      this.rentersVM = this.leaseholdService.getAllRentersVM()
      .map((renters) => {
        return renters.map(renter => {
          const leaseholds$ = this.leaseholdService.getLeaseholdsForRenter(renter.$key)
          leaseholds$.subscribe(leaseholds => renter.leaseholds = leaseholds)
          return renter;
        });
      });
    }

  ionViewDidLoad() {
    this.leaseholdService.getAllRenters()
      .subscribe(renters=>this.renters$=renters);
  }

}
