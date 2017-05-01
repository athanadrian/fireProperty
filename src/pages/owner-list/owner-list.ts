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

  constructor(
    public navController: NavController,
    public platform: Platform,
    public leaseholdService: LeaseholdService,
    public actionSheetController: ActionSheetController,
    public navParams: NavParams) {

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

}
