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
  public viewMode: string = "list";

  constructor(public navController: NavController, public propertyService: PropertyService,
    public actionSheetController: ActionSheetController, public platform: Platform) {

      this.properties$ = this.propertyService.getProperties();
    this.propertiesVM = this.propertyService.getPropertiesVM()
      .map((propertiesVM) => {
        return propertiesVM.map(property => {
          property.leaseholds = this.propertyService.getLeaseholdsForProperty(property.$key);
          let totalLeaseholds = this.propertyService.getAllLeaseholdsForProperty(property.$key);
          totalLeaseholds.map(total=>total.length)
          .subscribe((length)=>property.totalLeaseholds=length);
          console.log('pp: ', property.leaseholds);
          return property;
        });
      });
    this.properties$
      .map(properties => properties.length)
      .subscribe((length) => this.numberOfProperties = length);
}

  // ionViewDidLoad() {
  //   this.properties$ = this.propertyService.getProperties();
  //   this.propertiesVM = this.propertyService.getPropertiesVM()
  //     .map((propertiesVM) => {
  //       return propertiesVM.map(property => {
  //         property.leaseholds = this.propertyService.getLeaseholdsForProperty(property.$key);
  //         let totalLeaseholds = this.propertyService.getAllLeaseholdsForProperty(property.$key);
  //         totalLeaseholds.map(total=>total.length)
  //         .subscribe((length)=>property.totalLeaseholds=length);
  //         console.log('pp: ', property.leaseholds);
  //         return property;
  //       });
  //     });
  //   this.properties$
  //     .map(properties => properties.length)
  //     .subscribe((length) => this.numberOfProperties = length);
  // }

  showMap() {

  }

  createProperty(): void {
    this.navController.push(CreatePropertyPage);
  }

  goToPaidPayment(propertyId: string): void {
    this.navController.push(PropertyDetailPage, { propertyId: propertyId })
  }

}
