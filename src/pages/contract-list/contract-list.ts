import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';
import { Observable } from 'rxjs/Rx';

import { Contract } from '../../models/models';

@Component({
  selector: 'page-contract-list',
  templateUrl: 'contract-list.html'
})
export class ContractListPage {

  public contracts$: Contract[];

  constructor(public navCtrl: NavController, public leaseholdService: LeaseholdService) { }

  ionViewDidLoad() {
    this.leaseholdService.getAllContracts()
      .subscribe(contracts => this.contracts$ = contracts);
  }

}
