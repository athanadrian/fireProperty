import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';
import { Observable } from 'rxjs/Rx';

import { AddLeaseholdPage, LeaseholdDetailPage } from '../../pages/pages';
import { Leasehold } from '../../models/models';

@Component({
  selector: 'page-leasehold-list',
  templateUrl: 'leasehold-list.html'
})
export class LeaseholdListPage {

  public leaseholds$:Leasehold[];

constructor(public navController: NavController, public platform:Platform, public leaseholdService: LeaseholdService,
              public actionSheetController:ActionSheetController) { }

  ionViewDidLoad() {
    this.leaseholdService.getAllLeaseholds()
      .subscribe(leaseholds=>this.leaseholds$=leaseholds);
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
