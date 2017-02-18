import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { LeaseholdService } from '../../providers/services';
import { AddLeaseholdPage, AddOwnerPage, AddContractPage, AddRenterPage } from '../../pages/pages';
import { Property, Leasehold, Contract, Owner, Renter } from '../../models/models';

@Component({
  selector: 'page-leasehold-detail',
  templateUrl: 'leasehold-detail.html'
})
export class LeaseholdDetailPage {

  public leasehold$: any;
  public contracts: Contract[];
  public owners: Owner[];
  public renters: Renter[];
  public leaseholdId: string;

  constructor(public navController: NavController, public navParams: NavParams,
    public leaseholdService: LeaseholdService) {
    this.leaseholdId = this.navParams.get('leaseholdId');
    console.log('lkey', this.leaseholdId);
    this.leasehold$ = this.leaseholdService.findLeasehold(this.leaseholdId);
    console.log('lsh', this.leasehold$);
  }

  ionViewDidLoad() {
   
    const owners$ = this.leaseholdService.getOwnersForLeasehold(this.leaseholdId)
    owners$.subscribe(owners => this.owners = owners);
    const renters$ = this.leaseholdService.getRentersForLeasehold(this.leaseholdId)
    renters$.subscribe(renters => this.renters = renters);
    const contracts$ = this.leaseholdService.getContractsForLeasehold(this.leaseholdId)
    contracts$.subscribe(contracts => this.contracts = contracts);
  }

  insertRenter(){
    this.navController.push(AddRenterPage,{leaseholdId:this.leaseholdId});
  }

}
