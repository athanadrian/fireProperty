import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

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
  public contract$: any;
  newRenterForm: any;
  titleChanged: boolean = false;
  typeChanged: boolean = false;
  phoneChanged: boolean = false;
  websiteChanged: boolean = false;
  nameChanged: boolean = false;
  emailChanged: boolean = false;
  submitAttempt: boolean = false;
  leaseholdId: string;
  makeContract: boolean = false;
  renter: Renter;

  constructor(public navController: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder, public leaseholdService: LeaseholdService) {

    this.leaseholdId = this.navParams.get('leaseholdId');
    console.log('lkey ', this.leaseholdId);
    this.leaseholdService.findContract(this.leaseholdId)
      .subscribe(contract=>this.contract$=contract);
    console.log('contract ', this.contract$);

    this.newRenterForm = formBuilder.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      website: ['',],
      phone: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  addRenterToLeasehold({ leaseholdId, value, valid }: { propertyId: string, leaseholdId: string, value: Renter, valid: boolean }) {
    this.submitAttempt = true;
    if (!this.newRenterForm.valid) {
      console.log(this.newRenterForm.value);
    } else {
      value.title = this.newRenterForm.value.title;
      value.type = this.newRenterForm.value.type;
      value.website = this.newRenterForm.value.website;
      value.phone = this.newRenterForm.value.phone;
      value.name = this.newRenterForm.value.name;
      value.email = this.newRenterForm.value.email;
      value.isActive = true;
      this.leaseholdService.addRenter(this.leaseholdId, this.contract$.$key, value)
        .subscribe(() => {
          alert('renter added !');
          this.navController.pop();
        }, err => alert(`error adding renter, ${err}`));
    }
  }

}
