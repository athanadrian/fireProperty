import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { LeaseholdService, NotificationService } from '../../providers/services';

import { Property, Leasehold } from '../../models/models';

@Component({
  selector: 'page-add-leasehold',
  templateUrl: 'add-leasehold.html'
})
export class AddLeaseholdPage {

  public newLeaseholdForm: any;
  public titleChanged: boolean = false;
  public extraSpace: boolean = false;
  public codeChanged: boolean = false;
  public sizeChanged: boolean = false;
  public extraSizeChanged: boolean = false;
  public rentAmountChanged: boolean = false;
  public submitAttempt: boolean = false;
  public property: Property;
  public leasehold: Leasehold;
  public propertyId: string;
  public leaseholdId: string;
  public object: string = 'Leasehold';

  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public leaseholdService: LeaseholdService,
    public notificationService: NotificationService) {

    this.propertyId = this.navParams.get('propertyId');
    this.leaseholdId = this.navParams.get('leaseholdId');

    this.leaseholdService.getLeasehold(this.leaseholdId)
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
      this.notificationService.invalidFormToast();
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
      value.isRented = this.leasehold.isRented
        ;
      if (!this.leaseholdId) {
        this.leaseholdService.addLeasehold(this.propertyId, value)
          .subscribe(() => {
            this.notificationService.addUpdateToast(this.leaseholdId, this.object);
            this.navController.pop();
          }, (error) => {
            this.notificationService.errorToast(this.leaseholdId, this.object, error);
          });
      } else {
        this.leaseholdService.updateLeasehold(this.leaseholdId, value)
          .then(() => {
            this.notificationService.addUpdateToast(this.leaseholdId, this.object);
            this.navController.pop();
          }, (error) => {
            this.notificationService.errorToast(this.leaseholdId, this.object, error);
          });
      }
    }
  }
}
