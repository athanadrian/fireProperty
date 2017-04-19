import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
//import { Observable } from 'rxjs/Rx';

import { LeaseholdService } from '../../providers/services';
import { AddContractPage } from '../../pages/pages';
import { Leasehold, Contract, Renter } from '../../models/models';

@Component({
  selector: 'page-add-renter',
  templateUrl: 'add-renter.html'
})
export class AddRenterPage {

  //property = new Property;
  leasehold: Leasehold;
  contract$: any;
  newRenterForm: any;
  titleChanged: boolean = false;
  typeChanged: boolean = false;
  phoneCellChanged: boolean = false;
  phoneOfficeChanged: boolean = false;
  websiteChanged: boolean = false;
  nameChanged: boolean = false;
  emailChanged: boolean = false;
  submitAttempt: boolean = false;
  leaseholdId: string;
  renterId: string;
  makeContract: boolean = false;
  renter: any;

  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public leaseholdService: LeaseholdService) {

    this.leaseholdId = this.navParams.get('leaseholdId');
    this.renterId = this.navParams.get('renterId');
    console.log('rkey ', this.renterId);
    this.leaseholdService.getRenter(this.renterId)
      .subscribe(renter => this.renter = renter);
    console.log('R ', this.renter);
    this.leaseholdService.findContract(this.leaseholdId)
      .subscribe(contract => this.contract$ = contract);
    console.log('contract ', this.contract$);

    if (this.renterId) {
      this.newRenterForm = formBuilder.group({
        title: [this.renter.title, Validators.required],
        type: [this.renter.type, Validators.required],
        website: [this.renter.website],
        phoneCell: [this.renter.phoneCell, Validators.required],
        phoneOffice: [this.renter.phoneOffice, Validators.required],
        name: [this.renter.name, Validators.required],
        email: [this.renter.email, Validators.required],
      });
    } else {
      this.newRenterForm = formBuilder.group({
        title: ['', Validators.required],
        type: ['', Validators.required],
        website: ['',],
        phoneCell: ['', Validators.required],
        phoneOffice: ['', Validators.required],
        name: ['', Validators.required],
        email: ['', Validators.required],
      });
    }

  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  addRenterToLeasehold({ leaseholdId, value, valid }: { leaseholdId: string, value: Renter, valid: boolean }) {
    this.submitAttempt = true;
    if (!this.newRenterForm.valid) {
      console.log(this.newRenterForm.value);
    } else {
      value.title = this.newRenterForm.value.title;
      value.type = this.newRenterForm.value.type;
      value.website = this.newRenterForm.value.website;
      value.phoneCell = this.newRenterForm.value.phoneCell;
      value.phoneOffice = this.newRenterForm.value.phoneOffice;
      value.name = this.newRenterForm.value.name;
      value.email = this.newRenterForm.value.email;
      value.image = 'assets/images/ninja.png';
      value.isActive = !this.renter.isActive ? false : this.renter.isActive;
      if (!this.renterId) {
        this.leaseholdService.addRenter(this.leaseholdId, this.contract$.$key, value)
          .subscribe(() => {
            alert('renter added !');
            this.navController.pop();
          }, err => alert(`error adding renter, ${err}`));
      } else {
        this.leaseholdService.updateRenter(this.renterId, value)
          .then(() => {
            alert("leasehold saved");
            this.navController.pop();
          }, err => alert(`error saving leasehold ${err}`));
      }
    }
  }
}
