import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';

import { AddContractPage, ContractDetailPage } from '../../pages/pages';
import { Contract } from '../../models/models';

@Component({
  selector: 'page-contract-list',
  templateUrl: 'contract-list.html'
})
export class ContractListPage {

  public contractsVM: any;
  public totalContracts:number;

  constructor(
    public navController: NavController,
    public platform:Platform,
    public leaseholdService: LeaseholdService,
    public actionSheetController:ActionSheetController) { 

    this.contractsVM=this.leaseholdService.getAllContractsVM()
      .map((contractsVM)=>{
        this.totalContracts=contractsVM.length;
        return contractsVM.map(contract=>{
          this.leaseholdService.findRenter(contract.renterId)
            .subscribe(renter=>contract.renter=renter);
          this.leaseholdService.findLeasehold(contract.leaseholdId)
            .subscribe(leasehold=>contract.leasehold=leasehold);
        });
      });
    }
}
