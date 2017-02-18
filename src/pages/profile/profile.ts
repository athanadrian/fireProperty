import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { AuthService, PropertyService, LeaseholdService } from '../../providers/services';
import { PropertyListPage, LeaseholdListPage, OwnerListPage, ContractListPage, RenterListPage, LoginPage } from '../pages';
import { Property, Leasehold, Owner, Contract, Renter } from '../../models/models';
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  properties: Property[];
  leaseholds: Leasehold[];
  contracts: Contract[];
  owners: Owner[];
  renters:Renter[];

  constructor(public navController: NavController,
    public authService: AuthService,
    public propertyService: PropertyService,
    public leaseholdService: LeaseholdService) {
  }

  ionViewDidLoad() {
    this.propertyService.getProperties()
      .subscribe(properties => this.properties = properties);
    this.leaseholdService.getAllLeaseholds()
      .subscribe(leaseholds => this.leaseholds = leaseholds);
    this.leaseholdService.getAllContracts()
      .subscribe(contracts => this.contracts = contracts);
    this.leaseholdService.getAllOwners()
      .subscribe(owners => this.owners = owners);
    this.leaseholdService.getAllRenters()
      .subscribe(renters => this.renters = renters);
  }

  logout() {
    this.authService.logoutUser().then(() => {
      this.navController.setRoot(LoginPage);
    });
  }

  updateName() {
    console.log('Updating name....')
  }

  showProperties() {
    this.navController.push(PropertyListPage);
  }
  showAllLeaseholds() {
    this.navController.push(LeaseholdListPage);
  }

  showAllRenters() {
    this.navController.push(RenterListPage);
  }

  showAllContracts() {
    this.navController.push(ContractListPage);
  }

  showAllOwners() {
    this.navController.push(OwnerListPage);
  }

}
