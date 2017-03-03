import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
import { PropertyService } from '../../providers/services';
import { Observable } from 'rxjs/Rx';

import { Property, Leasehold, PropertyVM } from '../../models/models';
import { CreatePropertyPage, PropertyDetailPage, AddLeaseholdPage } from '../pages';

@Component({
  selector: 'page-property-list',
  templateUrl: 'property-list.html'
})
export class PropertyListPage {

  public properties$: Observable<Property[]>;
  public leaseholds: Leasehold[];
  public numberOfProperties: number;
  public propertiesVM: any;

  constructor(public navController: NavController, public propertyService: PropertyService,
    public actionSheetController: ActionSheetController, public platform: Platform) {
  }

  ionViewDidLoad() {
    this.properties$ = this.propertyService.getProperties();
    this.propertiesVM = this.propertyService.getPropertiesVM()
      .map((propertiesVM) => {
        return propertiesVM.map(property => {
          property.leaseholds = this.propertyService.getLeaseholdsForProperty(property.$key);
          let totalLeaseholds = this.propertyService.getAllLeaseholdsForProperty(property.$key);
          totalLeaseholds.map(total=>total.length)
          .subscribe((length)=>property.totalLeaseholds=length);
          console.log('pp: ', property);
          return property;
        });
      });
    this.properties$
      .map(properties => properties.length)
      .subscribe((length) => this.numberOfProperties = length);
  }

  createProperty(): void {
    this.navController.push(CreatePropertyPage);
  }

  goToPaidPayment(propertyId: string): void {
    this.navController.push(PropertyDetailPage, { propertyId: propertyId })
  }

  morePropertyOptions(propertyId:string) {
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
