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

  constructor(public navController: NavController, public platform: Platform, public leaseholdService: LeaseholdService,
    public navParams: NavParams, public actionSheetController: ActionSheetController) {
    this.ownerId = this.navParams.get('ownerId');
    this.owner$ = this.leaseholdService.findOwner(this.ownerId);
    const leaseholds$ = this.leaseholdService.getLeaseholdsForOwner(this.ownerId);
    leaseholds$.subscribe(leaseholds => this.leaseholds = leaseholds);
  }

  // ionViewDidLoad() {
  //   this.owner$ = this.leaseholdService.findOwner(this.ownerId);
  //   //.subscribe(owner => this.owner$ = owner);
  //   const leaseholds$ = this.leaseholdService.getLeaseholdsForOwner(this.ownerId);
  //   leaseholds$.subscribe(leaseholds => this.owner$.leaseholds = leaseholds);
  // }

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
