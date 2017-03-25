import { Component, Input } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';

import { Leasehold } from '../../../models/models';
import { LeaseholdDetailPage, CreatePropertyPage, PropertyDetailPage } from '../../../pages/pages';

@Component({
  selector: 'leasehold-card',
  templateUrl: 'leasehold-component.html'
})
export class LeaseholdComponent {


  @Input() leasehold: Leasehold;

  constructor(public navController: NavController, public actionSheetController: ActionSheetController,
    public platform: Platform) {

  }

  viewLeasehold(leaseholdId: string) {
    this.navController.push(LeaseholdDetailPage,
      { leaseholdId: leaseholdId });
  }

}
