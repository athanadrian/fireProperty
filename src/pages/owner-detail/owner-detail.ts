import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';

import { LeaseholdService } from '../../providers/services';
import { Leasehold } from '../../models/models';
import { AddOwnerPage, AddLeaseholdPage, LeaseholdDetailPage} from '../../pages/pages';

@Component({
  selector: 'page-owner-detail',
  templateUrl: 'owner-detail.html'
})
export class OwnerDetailPage {

  public owner$: any;
  public leaseholds: Leasehold[];
  public ownerId: string;
  public leaseholdsVM:any;

  constructor(
    public navController: NavController,
    public platform: Platform,
    public leaseholdService: LeaseholdService,
    public navParams: NavParams,
    public actionSheetController: ActionSheetController) {

    this.ownerId = this.navParams.get('ownerId');
    this.owner$ = this.leaseholdService.findOwner(this.ownerId);
    this.leaseholdsVM = this.leaseholdService.getLeaseholdsForOwner(this.ownerId)
      .map((leaseholds) => {
        return leaseholds.map(leasehold => {
          const renters$ = this.leaseholdService.getRentersForLeasehold(leasehold.$key)
          renters$.subscribe(renters => leasehold.renters = renters);
          const owners$ = this.leaseholdService.getOwnersForLeasehold(leasehold.$key)
          owners$.subscribe(owners => leasehold.owners = owners);
          const brokers$ = this.leaseholdService.getBrokersForLeasehold(leasehold.$key)
          brokers$.subscribe(brokers => leasehold.brokers = brokers);
          const contracts$ = this.leaseholdService.getContractsForLeasehold(leasehold.$key)
          contracts$.subscribe(contracts => leasehold.contracts = contracts);
          return leasehold
        });
      });
  }

  moreOwnerOptions(ownerId) {
    let actionSheet = this.actionSheetController.create({
      title: 'Owner Options',
      buttons: [
        {
          text: 'Delete Owner',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            //this.leaseholdService.removeContract(contractId);
            this.navController.pop();
          }
        },
        {
          text: 'Edit this owner',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(AddOwnerPage, {
              ownerId: ownerId
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

  moreLeaseholdOptions(leaseholdId:string){
    let actionSheet = this.actionSheetController.create({
      title: 'Leasehold Options',
      //cssClass: 'action-sheets-basic-page',
      buttons: [
        // {
        //   text: 'Delete Leasehold',
        //   role: 'destructive',
        //   icon: !this.platform.is('ios') ? 'trash' : null,
        //   handler: () => {
        //     //this.leaseholdService.removeContract(contractId);
        //     this.navController.pop();
        //   }
        // },
        {
          text: 'Edit this leasehold',
          //cssClass:'red-color',
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
