import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { AuthService, PropertyService, LeaseholdService } from '../../providers/services';
import { PropertyListPage, LeaseholdListPage, SignupPage, OwnerListPage, ContractListPage, RenterListPage, BrokerListPage, LoginPage } from '../pages';
import { Property, Leasehold, Owner, Contract, Renter, Broker } from '../../models/models';
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  properties: Property[];
  leaseholds: Leasehold[];
  contracts: Contract[];
  owners: Owner[];
  renters: Renter[];
  brokers: Broker[];

  constructor(public navController: NavController,
    public authService: AuthService, public alertController: AlertController,
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
    this.leaseholdService.getAllBrokers()
      .subscribe(brokers => this.brokers = brokers);
  }

  logout() {
    this.authService.logoutUser().then(() => {
      this.navController.setRoot(LoginPage);
    });
  }

  addPersonalInfo() {
    if (this.authService.getUser().isAnonymous == true) {
      const alert = this.alertController.create({
        message: `If you want to continue you'll need to
                  provide an email and create a password`,
        buttons: [
          { text: "Cancel" },
          {
            text: "OK",
            handler: data => {
              this.navController.push(SignupPage);
            }
          }]
      });
      alert.present();
    } else {
      // Take the picture
    }
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

  showAllBrokers() {
    this.navController.push(BrokerListPage);
  }

}
