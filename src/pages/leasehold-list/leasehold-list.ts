import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';
import { Observable } from 'rxjs/Rx';

import { Leasehold } from '../../models/models';

@Component({
  selector: 'page-leasehold-list',
  templateUrl: 'leasehold-list.html'
})
export class LeaseholdListPage {

  public leaseholds$:Leasehold[];

  constructor(public navCtrl: NavController, public leaseholdService:LeaseholdService) {}

  ionViewDidLoad() {
    this.leaseholdService.getAllLeaseholds()
      .subscribe(leaseholds=>this.leaseholds$=leaseholds);
  }

}
