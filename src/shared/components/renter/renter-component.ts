import { Component, Input } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';

import { LeaseholdService, NotificationService } from '../../../providers/services';
import { Renter } from '../../../models/models';
import { RenterDetailPage, AddRenterPage } from '../../../pages/pages';

@Component({
  selector: 'renter-card',
  templateUrl: 'renter-component.html'
})
export class RenterComponent {

  public leaseholdId: string;
  public contractId: string;
  public isListPage: boolean = false;
  public addOptions: boolean = false;
  public object: string = 'Renter';
  @Input() renter: Renter;

  constructor(
    public navController: NavController,
    public actionSheetController: ActionSheetController,
    public leaseholdService: LeaseholdService,
    public notificationService: NotificationService,
    public platform: Platform,
    public navParams: NavParams) {

    this.isListPage = this.navParams.get('isListPage');
    this.leaseholdId = this.navParams.get('leaseholdId');
    this.contractId = this.navParams.get('contractId');
    console.log('rentComcId ', this.contractId);
    this.addOptions = this.navParams.get('addOptions');
  }

  addRenter(renterId: string) {
    this.leaseholdService.addRenterFromList(renterId, this.contractId, this.leaseholdId)
      .subscribe(() => {
        this.notificationService.addUpdateToast(renterId, this.object);
        this.navController.pop();
      }, (error) => {
        this.notificationService.errorToast(renterId, this.object, error);
      });
  }

  moreRenterOptions(renterId: string) {
    let actionSheet = this.actionSheetController.create({
      title: 'Renter Options',
      buttons: [
        {
          text: !this.isListPage ? 'Remove Renter' : 'Delete Renter',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            if (!this.isListPage) {
              //remove renter from leasehold
            } else {
              //delete renter
            }
            this.navController.pop();
          }
        },
        {
          text: 'Edit this renter',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(AddRenterPage, {
              renterId: renterId
            });
          }
        },
        {
          text: 'Show this renter details',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(RenterDetailPage, {
              renterId: renterId
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
