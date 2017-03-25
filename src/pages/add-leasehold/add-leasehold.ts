import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { LeaseholdService } from '../../providers/services';

import { Property, Leasehold } from '../../models/models';

@Component({
  selector: 'page-add-leasehold',
  templateUrl: 'add-leasehold.html'
})
export class AddLeaseholdPage {

  property: Property;
  leasehold: Leasehold;
  newLeaseholdForm: any;
  titleChanged: boolean = false;
  extraSpace: boolean = false;
  codeChanged: boolean = false;
  sizeChanged: boolean = false;
  extraSizeChanged: boolean = false;
  rentAmountChanged: boolean = false;
  submitAttempt: boolean = false;
  propertyId: string;
  leaseholdId: string;

  constructor(public navController: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder, public leaseholdService: LeaseholdService) {

    this.propertyId = this.navParams.get('propertyId');
    this.leaseholdId = this.navParams.get('leaseholdId');
    console.log('pkey ', this.propertyId);
    console.log('lkey ', this.leaseholdId);

    this.leaseholdService.getLeasehold(this.leaseholdId)
      .do(console.log)
      .subscribe(leasehold => this.leasehold = leasehold);
    if (this.leaseholdId) {
      this.newLeaseholdForm = formBuilder.group({
        title: [this.leasehold.title, Validators.required],
        type: [this.leasehold.type, Validators.required],
        code: [this.leasehold.code],
        size: [this.leasehold.size, Validators.required],
        rentAmount: [this.leasehold.rentAmount, Validators.required],
        offices: [this.leasehold.offices],
        bathrooms: [this.leasehold.bathrooms],
        extraSpace: [this.leasehold.extraSpace],
        extraSize: [this.leasehold.extraSize]
      });
    } else {
      this.newLeaseholdForm = formBuilder.group({
        title: ['', Validators.required],
        type: ['', Validators.required],
        code: [''],
        size: ['', Validators.required],
        rentAmount: ['', Validators.required],
        offices: [''],
        bathrooms: [''],
        extraSpace: [''],
        extraSize: ['']
      });
    }

  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  addLeasehold({value, valid }: { propertyId: string, value: Leasehold, valid: boolean }) {
    this.submitAttempt = true;
    if (!this.newLeaseholdForm.valid) {
      console.log(this.newLeaseholdForm.value);
    } else {
      value.title = this.newLeaseholdForm.value.title;
      value.type = this.newLeaseholdForm.value.type;
      value.code = this.newLeaseholdForm.value.code;
      value.size = this.newLeaseholdForm.value.size;
      value.extraSpace = this.newLeaseholdForm.value.extraSpace;
      value.extraSize = this.newLeaseholdForm.value.extraSize;
      value.offices = this.newLeaseholdForm.value.offices;
      value.bathrooms = this.newLeaseholdForm.value.bathrooms;
      value.rentAmount = this.newLeaseholdForm.value.rentAmount;
      value.isRented = false;
      if (!this.leaseholdId) {
        this.leaseholdService.addLeasehold(this.propertyId, value)
          .subscribe(() => {
            alert('leasehold created. Create another one ?');
            this.navController.pop();
          }, err => alert(`error creating leasehold, ${err}`));
      } else {
        this.leaseholdService.updateLeasehold(this.leaseholdId, value)
          .then(() => {
            alert("leasehold saved");
            this.navController.pop();
          }, err => alert(`error saving leasehold ${err}`));
      }
    }
  }
}
