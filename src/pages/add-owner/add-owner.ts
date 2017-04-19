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
  ownerId: string;
  owner: any;

  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public leaseholdService: LeaseholdService) {
      
    this.ownerId = this.navParams.get('ownerId');
    console.log('o', this.ownerId);
    this.leaseholdService.getOwner(this.ownerId)
      .subscribe(owner => this.owner = owner);
    this.leaseholdId = this.navParams.get('leaseholdId');

    if (this.ownerId) {
      this.newOwnerForm = formBuilder.group({
        title: [this.owner.title, Validators.required],
        type: [this.owner.type],
        afm: [this.owner.afm, Validators.required],
        phone: [this.owner.phone],
        quota: [this.owner.quota, Validators.required]
      });
    } else {
      this.newOwnerForm = formBuilder.group({
        title: [, Validators.required],
        type: [''],
        afm: ['', Validators.required],
        phone: [''],
        quota: ['', Validators.required]
      });
    }
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
      value.type = this.newOwnerForm.value.type;
      value.afm = this.newOwnerForm.value.afm;
      value.phone = this.newOwnerForm.value.phone;
      value.quota = this.newOwnerForm.value.quota;
      value.image = 'assets/images/ninja.png';
      value.isActive = !this.owner.isActive ? false : this.owner.isActive;
      if (!this.ownerId) {
        this.leaseholdService.addOwner(this.leaseholdId, value)
          .subscribe(() => {
            alert('owner added !');
            this.navController.pop();
          }, err => alert(`error adding owner, ${err}`));
      } else {
        this.leaseholdService.updateOwner(this.ownerId, value)
          .then(() => {
            alert('owner updated!');
            this.navController.pop();
          }, err => alert(`error updating owner, ${err}`));
      }
    }
  }
}
