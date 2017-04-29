import { Component, Input } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';

import { LeaseholdService, NotificationService } from '../../../providers/services';
import { Broker } from '../../../models/models';
import { BrokerDetailPage, AddBrokerPage } from '../../../pages/pages';

@Component({
  selector: 'broker-card',
  templateUrl: 'broker-component.html'
})
export class BrokerComponent {

  public isListPage: boolean = false;
  public addOptions: boolean = false;
  public leaseholdId: string;
  public object: string = 'Broker';
  @Input() broker: Broker;

  constructor(
    public navController: NavController,
    public leaseholdService: LeaseholdService,
    public notificationService: NotificationService,
    public actionSheetController: ActionSheetController,
    public platform: Platform,
    public navParams: NavParams) {

    this.isListPage = this.navParams.get('isListPage');
    this.leaseholdId = this.navParams.get('leaseholdId');
    this.addOptions = this.navParams.get('addOptions');
  }

  moreBrokerOptions(brokerId: string) {
    let actionSheet = this.actionSheetController.create({
      title: 'Broker Options',
      buttons: [
        {
          text: !this.isListPage ? 'Remove Broker' : 'Delete Broker',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            if (!this.isListPage) {
              //remove broker from leasehold
            } else {
              //delete broker
            }
            this.navController.pop();
          }
        },
        {
          text: 'Edit this broker',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(AddBrokerPage, {
              brokerId: brokerId
            });
          }
        },
        {
          text: 'Show this broker details',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(BrokerDetailPage, {
              brokerId: brokerId
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

  addBroker(brokerId: string) {
    this.leaseholdService.addBrokerFromList(brokerId, this.leaseholdId)
      .subscribe(() => {
        this.notificationService.addUpdateToast(brokerId, this.object);
        this.navController.pop();
      }, error => {
        this.notificationService.errorToast(brokerId, this.object, error)
      });
  }
}
