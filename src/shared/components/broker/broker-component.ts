import { Component, Input } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';

import { Broker } from '../../../models/models';
import { BrokerDetailPage, AddBrokerPage } from '../../../pages/pages';

@Component({
  selector: 'broker-card',
  templateUrl: 'broker-component.html'
})
export class BrokerComponent {

  public isListPage: boolean = false;
  @Input() broker: Broker;

  constructor(
    public navController: NavController,
    public actionSheetController: ActionSheetController,
    public platform: Platform,
    public navParams: NavParams) {

    this.isListPage = this.navParams.get('isListPage');
  }

  moreRenterOptions(renterId: string) {
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
              renterId: renterId
            });
          }
        },
        {
          text: 'Show this broker details',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(BrokerDetailPage, {
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
