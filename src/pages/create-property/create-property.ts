import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { PropertyService } from '../../providers/services';

import { Property } from '../../models/models';

@Component({
  selector: 'page-create-property',
  templateUrl: 'create-property.html'
})
export class CreatePropertyPage {

  public property: Property;
  public propId: string;
  newPropertyForm: any;
  titleChanged: boolean = false;
  typeChanged: boolean = false;
  addressChanged: boolean = false;
  submitAttempt: boolean = false;

  constructor(public navController: NavController, public formBuilder: FormBuilder,
    public navParams: NavParams, public propertyService: PropertyService) {

    this.propId = this.navParams.get('propertyId');
    this.propertyService.getProperty(this.propId)
      .do(console.log)
      .subscribe(property => this.property = property);

    if (this.propId) {
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
      console.log(this.newPropertyForm.value);
    } else {
      value.title = this.newPropertyForm.value.title;
      value.type = this.newPropertyForm.value.type;
      value.address = this.newPropertyForm.value.address;
      value.image='assets/images/property.png';
      value.lat = null;
      value.lng = null;
      value.icon = null;
      if (!this.propId) {
        this.propertyService.createProperty(value)
          .then(() => {
            this.navController.pop();
          }, (error) => {
            console.log(error);
          });
        
      } else {
        this.propertyService.updateProperty(this.propId, value)
          .then(() => {
            alert("propety saved");
            this.navController.pop();
          }, err => alert(`error saving property ${err}`));
      }
    }
  }

}
