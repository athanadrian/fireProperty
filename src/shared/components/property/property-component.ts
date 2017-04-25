import { Component, Input } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';

import { Property } from '../../../models/models';
import { LeaseholdDetailPage, CreatePropertyPage, PropertyDetailPage } from '../../../pages/pages';

@Component({
  selector: 'property-card',
  templateUrl: 'property-component.html'
})
export class PropertyComponent {

  @Input() property: Property;

  constructor(
    public navController: NavController,
    public actionSheetController: ActionSheetController,
    public platform: Platform) {

  }

  viewLeasehold(leaseholdId: string) {
    this.navController.push(LeaseholdDetailPage,
      { leaseholdId: leaseholdId });
  }

  morePropertyOptions(propertyId: string) {
    let actionSheet = this.actionSheetController.create({
      title: 'Property Options',
      buttons: [
        {
          text: 'Edit this property',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(CreatePropertyPage, {
              propertyId: propertyId
            });
          }
        },
        {
          text: 'Show this property details',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(PropertyDetailPage, {
              propertyId: propertyId
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
