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

  property = Property;
  newLeaseholdForm: any;
  titleChanged: boolean = false;
  codeChanged: boolean = false;
  sizeChanged: boolean = false;
  rentAmountChanged: boolean = false;
  submitAttempt: boolean = false;
  propertyId: string;

  constructor(public navController: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder, public leaseholdService: LeaseholdService) {

    this.propertyId = this.navParams.get('propertyId');
    console.log('lspkey ',this.propertyId);
    this.newLeaseholdForm = formBuilder.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      code: [''],
      size: ['', Validators.required],
      rentAmount: ['', Validators.required]
    });
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
      value.rentAmount = this.newLeaseholdForm.value.rentAmount;
      value.isRented = false;
      //value.propertyId = this.propertyId;
      this.leaseholdService.addLeasehold(this.propertyId, value)
        .subscribe(() => {
          alert('leasehold created. Create another one ?');
          this.navController.pop();
        }, err => alert(`error creating leasehold, ${err}`));
    }
  }
}
