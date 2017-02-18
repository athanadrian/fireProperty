import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';
import { Observable } from 'rxjs/Rx';

import { Owner } from '../../models/models';

@Component({
  selector: 'page-owner-list',
  templateUrl: 'owner-list.html'
})
export class OwnerListPage {

  public owners$:Owner[];

  constructor(public navCtrl: NavController, public leaseholdService:LeaseholdService) {}

  ionViewDidLoad() {
    this.leaseholdService.getAllOwners()
      .subscribe(owners=>this.owners$=owners);
  }
}
