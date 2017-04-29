import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { LeaseholdService, NotificationService } from '../../providers/services';
import { AddContractPage } from '../../pages/pages';
import { Leasehold, Contract, Renter } from '../../models/models';
import { EmailValidator } from '../../shared/validators/email';

@Component({
  selector: 'page-add-renter',
  templateUrl: 'add-renter.html'
})
export class AddRenterPage {

  public newRenterForm: any;
  public titleChanged: boolean = false;
  public typeChanged: boolean = false;
  public phoneCellChanged: boolean = false;
  public phoneOfficeChanged: boolean = false;
  public websiteChanged: boolean = false;
  public nameChanged: boolean = false;
  public emailChanged: boolean = false;
  public submitAttempt: boolean = false;
  public leasehold: Leasehold;
  public contract: Contract;
  public renter: Renter;
  public leaseholdId: string;
  public renterId: string;
  public object: string = 'Renter';

  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public leaseholdService: LeaseholdService,
    public notificationService: NotificationService) {

    this.leaseholdId = this.navParams.get('leaseholdId');
    this.renterId = this.navParams.get('renterId');
    this.leaseholdService.getRenter(this.renterId)
      .subscribe(renter => this.renter = renter);
    this.leaseholdService.findContractForLeasehold(this.leaseholdId)
      .subscribe(contract => this.contract = contract);

    if (this.renterId) {
      this.newRenterForm = formBuilder.group({
        title: [this.renter.title, Validators.required],
        type: [this.renter.type, Validators.required],
        website: [this.renter.website],
        phoneCell: [this.renter.phoneCell, Validators.required],
        phoneOffice: [this.renter.phoneOffice, Validators.required],
        name: [this.renter.name, Validators.required],
        email: [this.renter.email, Validators.compose([Validators.required, EmailValidator.isValid])]
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
      this.notificationService.invalidFormToast();
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
        this.leaseholdService.addRenter(this.leaseholdId, this.contract.$key, value)
          .subscribe(() => {
            this.notificationService.addUpdateToast(this.renterId, this.object);
            this.navController.pop();
          }, (error) => {
            this.notificationService.errorToast(this.renterId, this.object, error);
          });
      } else {
        this.leaseholdService.updateRenter(this.renterId, value)
          .then(() => {
            this.notificationService.addUpdateToast(this.renterId, this.object);
            this.navController.pop();
          }, (error) => {
            this.notificationService.errorToast(this.renterId, this.object, error);
          });
      }
    }
  }
}
