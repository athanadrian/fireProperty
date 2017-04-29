import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { LeaseholdService, NotificationService } from '../../providers/services';

import { Property } from '../../models/models';

@Component({
  selector: 'page-create-property',
  templateUrl: 'create-property.html'
})
export class CreatePropertyPage {

  public newPropertyForm: any;
  public titleChanged: boolean = false;
  public typeChanged: boolean = false;
  public addressChanged: boolean = false;
  public submitAttempt: boolean = false;
  public property: Property;
  public propertyId: string;
  public object: string = 'Property';

  constructor(
    public navController: NavController,
    public toastController: ToastController,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public leaseholdService: LeaseholdService,
    public notificationService: NotificationService) {

    this.propertyId = this.navParams.get('propertyId');
    this.leaseholdService.getProperty(this.propertyId)
      .subscribe(property => this.property = property);

    if (this.propertyId) {
      this.newPropertyForm = formBuilder.group({
        title: [this.property.title, Validators.required],
        type: [this.property.type, Validators.required],
        address: [this.property.address]
      });
    } else {
      this.newPropertyForm = formBuilder.group({
        title: ['', Validators.required],
        type: ['', Validators.required],
        address: ['']
      });
    }
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  createProperty({ value, valid }: { value: Property, valid: boolean }) {
    this.submitAttempt = true;
    if (!this.newPropertyForm.valid) {
      this.notificationService.invalidFormToast();
    } else {
      value.title = this.newPropertyForm.value.title;
      value.type = this.newPropertyForm.value.type;
      value.address = this.newPropertyForm.value.address;
      value.image = 'assets/images/property.png';
      value.lat = null;
      value.lng = null;
      value.icon = null;
      if (!this.propertyId) {
        this.leaseholdService.createProperty(value)
          .then(() => {
            this.notificationService.addUpdateToast(this.propertyId, this.object);
            this.navController.pop();
          }, (error) => {
            this.notificationService.errorToast(this.propertyId, this.object, error);
          });
      } else {
        this.leaseholdService.updateProperty(this.propertyId, value)
          .then(() => {
            this.notificationService.addUpdateToast(this.propertyId, this.object);
            this.navController.pop();
          }, (error) => {
            this.notificationService.errorToast(this.propertyId, this.object, error);
          });
      }
    }
  }
}
