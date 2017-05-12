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
  public totalProperties: number;
  public propertiesVM: any;
  public viewMode: string = "list";

  constructor(
    public navController: NavController,
    public leaseholdService: LeaseholdService,
    public actionSheetController: ActionSheetController,
    public platform: Platform) {

    this.propertiesVM = this.leaseholdService.getPropertiesVM()
      .map((propertiesVM) => {
        this.totalProperties = propertiesVM.length;
        return propertiesVM.map(property => {
          const leaseholds$ = this.leaseholdService.getLeaseholdsForProperty(property.$key)
          leaseholds$.subscribe((leaseholds) => {
            leaseholds.map(leasehold => {
              const renters$ = this.leaseholdService.getRentersForLeasehold(leasehold.$key)
              renters$.subscribe(renters => {
                leasehold.renters = renters
                 console.log('lsR ', leasehold.renters)
                 console.log('R ', renters)
            });
              const owners$ = this.leaseholdService.getOwnersForLeasehold(leasehold.$key)
              owners$.subscribe(owners => leasehold.owners = owners);
              const brokers$ = this.leaseholdService.getBrokersForLeasehold(leasehold.$key)
              brokers$.subscribe(brokers => leasehold.brokers = brokers);
              const contracts$ = this.leaseholdService.getContractsForLeasehold(leasehold.$key)
              contracts$.subscribe(contracts => leasehold.contracts = contracts);
              const payments$ = this.leaseholdService.getPaymentsForLeasehold(leasehold.$key)
              payments$.subscribe(payments => leasehold.payments = payments);
            })
            property.leaseholds = leaseholds;
            property.totalLeaseholds = property.leaseholds.length;

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
