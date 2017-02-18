import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { LeaseholdService } from '../../providers/services';

import { Leasehold, Owner } from '../../models/models';

@Component({
  selector: 'page-add-owner',
  templateUrl: 'add-owner.html'
})
export class AddOwnerPage {

  newOwnerForm: any;
  titleChanged: boolean = false;
  afmChanged: boolean = false;
  phoneChanged: boolean = false;
  quotaChanged: boolean = false;
  submitAttempt: boolean = false;
  leaseholdId: string;

  constructor(public navController: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder, public leaseholdService: LeaseholdService) {

    this.leaseholdId = this.navParams.get('leaseholdId');
    this.newOwnerForm = formBuilder.group({
      title: ['', Validators.required],
      afm: ['', Validators.required],
      phone: [''],
      quota: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddOwnerPage');
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  addOwner({value, valid }: { leaseholdId: string, value: Owner, valid: boolean }) {
    this.submitAttempt = true;
    if (!this.newOwnerForm.valid) {
      console.log(this.newOwnerForm.value);
    } else {
      value.title = this.newOwnerForm.value.title;
      value.afm = this.newOwnerForm.value.afm;
      value.phone = this.newOwnerForm.value.phone;
      value.quota= this.newOwnerForm.value.quota;
      value.isActive = true;
      this.leaseholdService.addOwner(this.leaseholdId, value)
        .subscribe(() => {
          alert('owner added !');
          this.navController.pop();
        }, err => alert(`error adding owner, ${err}`));
    }
  }

}
