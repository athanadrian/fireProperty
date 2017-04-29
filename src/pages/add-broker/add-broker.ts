import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { LeaseholdService, NotificationService } from '../../providers/services';
import { AddContractPage } from '../../pages/pages';
import { Leasehold, Broker } from '../../models/models';
import { EmailValidator } from '../../shared/validators/email';

@Component({
  selector: 'page-add-broker',
  templateUrl: 'add-broker.html'
})
export class AddBrokerPage {

  public newBrokerForm: any;
  public titleChanged: boolean = false;
  public typeChanged: boolean = false;
  public phoneCellChanged: boolean = false;
  public phoneOfficeChanged: boolean = false;
  public websiteChanged: boolean = false;
  public firstNameChanged: boolean = false;
  public lastNameChanged: boolean = false;
  public emailChanged: boolean = false;
  public submitAttempt: boolean = false;
  public leaseholdId: string;
  public brokerId: string;
  public broker: Broker;
  public object: string = 'Broker';

  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public leaseholdService: LeaseholdService,
    public notificationService: NotificationService) {

    this.leaseholdId = this.navParams.get('leaseholdId');
    this.brokerId = this.navParams.get('brokerId');
    this.leaseholdService.getBroker(this.brokerId)
      .subscribe(broker => this.broker = broker);

    if (this.brokerId) {
      this.newBrokerForm = formBuilder.group({
        title: [this.broker.title, Validators.required],
        firstName: [this.broker.firstName, Validators.required],
        lastName: [this.broker.lastName, Validators.required],
        phoneCell: [this.broker.phoneCell, Validators.required],
        phoneOffice: [this.broker.phoneOffice, Validators.required],
        email: [this.broker.email, Validators.compose([Validators.required, EmailValidator.isValid])],
        website: [this.broker.website],
      });
    } else {
      this.newBrokerForm = formBuilder.group({
        title: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phoneCell: ['', Validators.required],
        phoneOffice: ['', Validators.required],
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
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
      this.notificationService.invalidFormToast();
    } else {
      value.title = this.newBrokerForm.value.title;
      value.firstName = this.newBrokerForm.value.firstName;
      value.lastName = this.newBrokerForm.value.lastName;
      value.phoneCell = this.newBrokerForm.value.phoneCell;
      value.phoneOffice = this.newBrokerForm.value.phoneOffice;
      value.email = this.newBrokerForm.value.email;
      value.image = 'assets/images/broker_white.png';
      value.website = this.newBrokerForm.value.website;
      value.isActive=true;
      if (!this.brokerId) {
        this.leaseholdService.addBroker(this.leaseholdId, value)
          .subscribe(() => {
            this.notificationService.addUpdateToast(this.brokerId, this.object);
            this.navController.pop();
          }, (error) => {
            this.notificationService.errorToast(this.brokerId, this.object, error);
          });
      } else {
        this.leaseholdService.updateBroker(this.brokerId, value)
          .then(() => {
            this.notificationService.addUpdateToast(this.brokerId, this.object);
            this.navController.pop();
          }, (error) => {
            this.notificationService.errorToast(this.brokerId, this.object, error);
          });
      }
    }
  }
}
