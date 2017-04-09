import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';
import { Observable } from 'rxjs/Rx';

import { AddOwnerPage, OwnerDetailPage } from '../../pages/pages';
import { Owner } from '../../models/models';

@Component({
  selector: 'page-owner-list',
  templateUrl: 'owner-list.html'
})
export class OwnerListPage {

  public owners$: Owner[];

  constructor(public navController: NavController, public platform: Platform, public leaseholdService: LeaseholdService,
    public actionSheetController: ActionSheetController) { }

  ionViewDidLoad() {
    this.leaseholdService.getAllOwners()
      .subscribe(owners => this.owners$ = owners);
  }

  // moreOwnerOptions(ownerId: string) {
  //   let actionSheet = this.actionSheetController.create({
  //     title: 'Owner Options',
  //     //cssClass: 'action-sheets-basic-page',
  //     buttons: [
  //       {
  //         text: 'Edit this owner',
  //         //cssClass:'red-color',
  //         icon: !this.platform.is('ios') ? 'play' : null,
  //         handler: () => {
  //           this.navController.push(AddOwnerPage, {
  //             ownerId: ownerId
  //           });
  //         }
  //       },
  //       {
  //         text: 'Show this owner details',
  //         icon: !this.platform.is('ios') ? 'play' : null,
  //         handler: () => {
  //           this.navController.push(OwnerDetailPage, {
  //             ownerId: ownerId
  //           });
  //         }
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         icon: !this.platform.is('ios') ? 'close' : null,
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         }
  //       }
  //     ]
  //   });
  //   actionSheet.present();
  // }
}
