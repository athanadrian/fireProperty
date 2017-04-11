import { Component, Input } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';

import { LeaseholdService } from '../../../providers/services';
import { Owner } from '../../../models/models';
import { OwnerDetailPage, AddOwnerPage } from '../../../pages/pages';

@Component({
  selector: 'owner-card',
  templateUrl: 'owner-component.html'
})
export class OwnerComponent {

  public leaseholdId: string;
  public isListPage: boolean = false;
  public addOptions:boolean=false;
  @Input() owner: Owner;

  constructor(
    public navController: NavController,
    public actionSheetController: ActionSheetController,
    public leaseholdService:LeaseholdService,
    public platform: Platform,
    public navParams: NavParams) { 

    this.isListPage = this.navParams.get('isListPage');
    this.leaseholdId = this.navParams.get('leaseholdId');
    this.addOptions=this.navParams.get('addOptions');
    console.log('add: ',this.addOptions);
    }

  addOwner(ownerId: string) {
    this.leaseholdService.addOwnerFromList(ownerId, this.leaseholdId)
      .subscribe(() => {
            alert('owner added !');
            this.navController.pop();
          }, err => alert(`error adding owner, ${err}`));
  }

  moreOwnerOptions(ownerId: string) {
    let actionSheet = this.actionSheetController.create({
      title: 'Owner Options',
      buttons: [
        {
          text: !this.isListPage ? 'Remove Owner' : 'Delete Owner',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            if (!this.isListPage) {
              //remove Owner from leasehold
            } else {
              //delete Owner
            }
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
          text: 'Show this owner details',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(OwnerDetailPage, {
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

}
