import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { LeaseholdService, NotificationService } from '../../providers/services';
import { Leasehold, Owner } from '../../models/models';

@Component({
  selector: 'page-add-owner',
  templateUrl: 'add-owner.html'
})
export class AddOwnerPage {

  public newOwnerForm: any;
  public titleChanged: boolean = false;
  public afmChanged: boolean = false;
  public phoneChanged: boolean = false;
  public quotaChanged: boolean = false;
  public submitAttempt: boolean = false;
  public owner: Owner;
  public leaseholdId: string;
  public ownerId: string;
  public object: string = 'Owner';

  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public leaseholdService: LeaseholdService,
    public notificationService: NotificationService) {

    this.ownerId = this.navParams.get('ownerId');
    this.leaseholdId = this.navParams.get('leaseholdId');

    this.leaseholdService.getOwner(this.ownerId)
      .subscribe(owner => this.owner = owner);

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
      this.notificationService.invalidFormToast();
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
            this.notificationService.addUpdateToast(this.ownerId, this.object);
            this.navController.pop();
          }, (error) => {
            this.notificationService.errorToast(this.ownerId, this.object, error);
          });
      } else {
        this.leaseholdService.updateOwner(this.ownerId, value)
          .then(() => {
            this.notificationService.addUpdateToast(this.ownerId, this.object);
            this.navController.pop();
          }, (error) => {
            this.notificationService.errorToast(this.ownerId, this.object, error);
          });
      }
    }
  }
}
