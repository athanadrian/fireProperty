import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { LeaseholdService } from '../../providers/services';
import { AddContractPage } from '../../pages/pages';
import { Leasehold, Broker } from '../../models/models';

@Component({
  selector: 'page-add-broker',
  templateUrl: 'add-broker.html'
})
export class AddBrokerPage {

  newBrokerForm: any;
  titleChanged: boolean = false;
  typeChanged: boolean = false;
  phoneCellChanged: boolean = false;
  phoneOfficeChanged: boolean = false;
  websiteChanged: boolean = false;
  firstNameChanged: boolean = false;
  lastNameChanged: boolean = false;
  emailChanged: boolean = false;
  submitAttempt: boolean = false;
  leaseholdId: string;
  brokerId: string;
  broker: any;

  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public leaseholdService: LeaseholdService) {

    this.leaseholdId = this.navParams.get('leaseholdId');
    this.brokerId = this.navParams.get('brokerId');
    console.log('bId', this.brokerId);
    console.log('lId', this.leaseholdId);
    this.leaseholdService.getBroker(this.brokerId)
      .subscribe(broker => this.broker = broker);

    if (this.brokerId) {
      this.newBrokerForm = formBuilder.group({
        title: [this.broker.title, Validators.required],
        firstName: [this.broker.firstName, Validators.required],
        lastName: [this.broker.lastName, Validators.required],
        phoneCell: [this.broker.phoneCell, Validators.required],
        phoneOffice: [this.broker.phoneOffice, Validators.required],
        email: [this.broker.email, Validators.required],
        website: [this.broker.website],
      });
    } else {
      this.newBrokerForm = formBuilder.group({
        title: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phoneCell: ['', Validators.required],
        phoneOffice: ['', Validators.required],
        email: ['', Validators.required],
        website: ['']
      });
    }
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  addBroker({value, valid}: { value: Broker, valid: boolean }) {
    this.submitAttempt = true;
    if (!this.newBrokerForm.valid) {
      console.log(this.newBrokerForm.value);
    } else {
      value.title = this.newBrokerForm.value.title;
      value.firstName = this.newBrokerForm.value.firstName;
      value.lastName = this.newBrokerForm.value.lastName;
      value.phoneCell = this.newBrokerForm.value.phoneCell;
      value.phoneOffice = this.newBrokerForm.value.phoneOffice;
      value.email = this.newBrokerForm.value.email;
      value.image = 'assets/images/broker_white.png';
      value.website = this.newBrokerForm.value.website;
      if (!this.brokerId) {
        this.leaseholdService.addBroker(this.leaseholdId, value)
          .subscribe(() => {
            alert('broker added !');
            this.navController.pop();
          }, err => alert(`error adding broker, ${err}`));
      } else {
        this.leaseholdService.updateBroker(this.brokerId, value)
          .then(() => {
            alert("broker saved");
            this.navController.pop();
          }, err => alert(`error saving broker ${err}`));
      }
    }
  }
}
