import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';
import { Observable } from 'rxjs/Rx';

import { OwnerVM } from '../../models/models';

@Component({
  selector: 'page-owner-list',
  templateUrl: 'owner-list.html'
})
export class OwnerListPage {

  public ownersVM: any;
  public totalOwners: number;
  public leaseholdId: string;


  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public leaseholdService: LeaseholdService,
    public actionSheetController: ActionSheetController) {

    this.leaseholdId = this.navParams.get('leaseholdId');

    if (!this.leaseholdId) {
      this.getAllOwnersVM();
    } else {
      this.getOwnersForLeasehold();
    }
  }

  getAllOwnersVM() {
    this.ownersVM = this.leaseholdService.getAllOwnersVM()
      .map((ownersVM) => {
        this.totalOwners = ownersVM.length;
        return ownersVM.map(owner => {
          const leaseholds$ = this.leaseholdService.getLeaseholdsForOwner(owner.$key)
          leaseholds$.subscribe(leaseholds => owner.leaseholds = leaseholds)
          return owner;
        });
      });
  }

  getOwnersForLeasehold() {
    this.ownersVM = this.leaseholdService.getOwnersForLeasehold(this.leaseholdId)
      .map((ownersVM) => {
        this.totalOwners = ownersVM.length;
        return ownersVM.map(owner => {
          const leaseholds$ = this.leaseholdService.getLeaseholdsForOwner(owner.$key)
          leaseholds$.subscribe(leaseholds => owner.leaseholds = leaseholds)
          return owner;
        });
      });
  }
}
