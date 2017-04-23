import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';

import { PropertyVM } from '../../models/models';
import { CreatePropertyPage } from '../pages';

@Component({
  selector: 'page-property-list',
  templateUrl: 'property-list.html'
})
export class PropertyListPage {

  public numberOfProperties: number;
  public propertiesVM: any;
  public viewMode: string = "list";

  constructor(
    public navController: NavController,
    public leaseholdService: LeaseholdService,
    public actionSheetController: ActionSheetController,
    public platform: Platform) {

    this.propertiesVM = this.leaseholdService.getPropertiesVM()
      .map((propertiesVM) => {
        return propertiesVM.map(property => {
          this.leaseholdService.getLeaseholdsForProperty(property.$key)
            .subscribe((leaseholds) => {
              property.leaseholds = leaseholds;
              property.totalLeaseholds = property.leaseholds.length;
              this.numberOfProperties = propertiesVM.length;
            });
          return property;
        });
      });
  }

  showMap() {

  }

  createProperty(): void {
    this.navController.push(CreatePropertyPage);
  }
}
