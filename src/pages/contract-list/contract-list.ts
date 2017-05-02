import { Component, Input } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';

import { AddContractPage, ContractDetailPage } from '../../pages/pages';
import { Contract } from '../../models/models';

@Component({
  selector: 'page-contract-list',
  templateUrl: 'contract-list.html'
})
export class ContractListPage {

  public contractsVM: any;
  public totalContracts: number;
  public renterId: string;
  public leaseholdId: string;
  public addOptions: boolean = false;


  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public leaseholdService: LeaseholdService,
    public actionSheetController: ActionSheetController) {

    this.leaseholdId = this.navParams.get('leaseholdId');
    this.renterId = this.navParams.get('renterId');
    this.addOptions = !this.leaseholdId ? true : this.navParams.get('addOptions');
    
    if(this.addOptions){
      this.getAllContractsVM();
    }
    if (this.renterId) {
      this.getPaymentsForRenter();
    } else if(this.leaseholdId) {
      this.getContractsForLeasehold();
    }
  }

  getAllContractsVM() {
    this.contractsVM = this.leaseholdService.getAllContractsVM()
      .map((contractsVM) => {
        this.totalContracts = contractsVM.length;
        return contractsVM.map(contract => {
          this.leaseholdService.findRenter(contract.renterId)
            .subscribe(renter => contract.renter = renter);
          this.leaseholdService.findLeasehold(contract.leaseholdId)
            .subscribe(leasehold => contract.leasehold = leasehold);
          return contract;
        });
      });
  }

  getContractsForLeasehold() {
    this.contractsVM = this.leaseholdService.getContractsForLeasehold(this.leaseholdId)
      .map((contractsVM) => {
        this.totalContracts = contractsVM.length;
        return contractsVM.map(contract => {
          this.leaseholdService.findRenter(contract.renterId)
            .subscribe(renter => contract.renter = renter);
          this.leaseholdService.findLeasehold(contract.leaseholdId)
            .subscribe(leasehold => contract.leasehold = leasehold);
          return contract;
        });
      });
  }

  getPaymentsForRenter(){
    this.contractsVM = this.leaseholdService.getContractsForRenter(this.renterId)
      .map((contractsVM) => {
        this.totalContracts = contractsVM.length;
        return contractsVM.map(contract => {
          this.leaseholdService.findRenter(contract.renterId)
            .subscribe(renter => contract.renter = renter);
          this.leaseholdService.findLeasehold(contract.leaseholdId)
            .subscribe(leasehold => contract.leasehold = leasehold);
          return contract;
        });
      });
  }

}
