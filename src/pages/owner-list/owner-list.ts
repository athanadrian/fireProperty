import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';
import { Observable } from 'rxjs/Rx';

import { Owner, OwnerVM } from '../../models/models';

@Component({
  selector: 'page-owner-list',
  templateUrl: 'owner-list.html'
})
export class OwnerListPage {

  public owners$: Owner[];
  public ownersVM: any;
  //public leaseholds:Leasehold[];


  constructor(
    public navController: NavController,
    public platform: Platform,
    public leaseholdService: LeaseholdService,
    public actionSheetController: ActionSheetController,
    public navParams: NavParams) {

    this.ownersVM = this.leaseholdService.getAllOwnersVM()
      .map((ownersVM) => {
        return ownersVM.map(owner => {
          const leaseholds$=this.leaseholdService.getLeaseholdsForOwner(owner.$key)
          leaseholds$.subscribe(leaseholds=>owner.leaseholds=leaseholds)
          return owner;
        });
      });
  }

  ionViewDidLoad() {
    this.leaseholdService.getAllOwners()
      .subscribe(owners => this.owners$ = owners);
  }

}
