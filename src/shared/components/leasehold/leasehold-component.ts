import { Component, Input } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';

import { LeaseholdService } from '../../../providers/services';
import { Leasehold } from '../../../models/models';
import { LeaseholdDetailPage, CreatePropertyPage, PropertyDetailPage, AddLeaseholdPage } from '../../../pages/pages';

@Component({
  selector: 'leasehold-card',
  templateUrl: 'leasehold-component.html'
})
export class LeaseholdComponent {

  //public leaseholdsVM:any;
  @Input() leasehold: Leasehold;

  constructor(
    public navController: NavController,
    //public leaseholdService: LeaseholdService,
    public actionSheetController: ActionSheetController,
    public platform: Platform) {

    // this.leaseholdsVM = this.leaseholdService.getLeaseholdsForRenter(this.renterId)
    //   .map((leaseholds) => {
    //     return leaseholds.map(leasehold => {
    //       const renters$ = this.leaseholdService.getRentersForLeasehold(leasehold.$key)
    //       renters$.subscribe(renters => leasehold.renters = renters);
    //       const owners$ = this.leaseholdService.getOwnersForLeasehold(leasehold.$key)
    //       owners$.subscribe(owners => leasehold.owners = owners);
    //       const brokers$ = this.leaseholdService.getBrokersForLeasehold(leasehold.$key)
    //       brokers$.subscribe(brokers => leasehold.brokers = brokers);
    //       const contracts$ = this.leaseholdService.getContractsForLeasehold(leasehold.$key)
    //       contracts$.subscribe(contracts => leasehold.contracts = contracts);
    //       return leasehold
    //     });
    //   });
  }

  viewLeasehold(leaseholdId: string) {
    this.navController.push(LeaseholdDetailPage,
      { leaseholdId: leaseholdId });
  }

  moreLeaseholdOptions(leaseholdId:string){
    let actionSheet = this.actionSheetController.create({
      title: 'Leasehold Options',
      buttons: [
        {
          text: 'Edit this leasehold',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(AddLeaseholdPage, {
              leaseholdId: leaseholdId
            });
          }
        },
        {
          text: 'Show this leasehold details',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(LeaseholdDetailPage, {
              leaseholdId: leaseholdId
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
