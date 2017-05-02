import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';
import { Observable } from 'rxjs/Rx';

import { AddBrokerPage } from '../../pages/pages';
import { BrokerVM } from '../../models/models';

@Component({
  selector: 'page-broker-list',
  templateUrl: 'broker-list.html'
})
export class BrokerListPage {

  public brokersVM: any;
  public totalBrokers: number;
  public leaseholdId: string;
  public addOptions: boolean = false;

  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public modalController: ModalController,
    public alertController: AlertController,
    public leaseholdService: LeaseholdService) {

    this.leaseholdId = this.navParams.get('leaseholdId');
    console.log('brk ', this.leaseholdId, this.addOptions);
    this.addOptions = !this.leaseholdId ? true : this.navParams.get('addOptions');
    console.log('aop ', this.addOptions);
    
    if (this.addOptions) {
      this.getAllBrokersVM();
    } else {
      this.getBrokersForLeasehold()
    }
  }

  addBroker() {
    this.showBrokerConfirmation();
  }

  showBrokerConfirmation() {
    let confirm = this.alertController.create({
      title: 'Add broker',
      buttons: [
        {
          text: 'Add broker from list?',
          handler: () => {
            this.navController.push(BrokerListPage,
              {
                leaseholdId: this.leaseholdId,
                isListPage: true,
                addOptions: true,
              })
            //this.presentModal();
          }
        },
        {
          text: 'Add a new broker?',
          handler: () => {
            this.navController.push(AddBrokerPage,
              {
                leaseholdId: this.leaseholdId
              })
          }
        }
      ]
    });
    confirm.present();
  }

  getAllBrokersVM() {
    this.brokersVM = this.leaseholdService.getAllBrokersVM()
      .map((brokersVM) => {
        this.totalBrokers = brokersVM.length;
        return brokersVM.map(broker => {
          const leaseholds$ = this.leaseholdService.getLeaseholdsForBroker(broker.$key)
          leaseholds$.subscribe(leaseholds => broker.leaseholds = leaseholds);
          return broker;
        });
      });
  }

  getBrokersForLeasehold() {
    this.brokersVM = this.leaseholdService.getBrokersForLeasehold(this.leaseholdId)
      .map((brokersVM) => {
        this.totalBrokers = brokersVM.length;
        return brokersVM.map(broker => {
          const leaseholds$ = this.leaseholdService.getLeaseholdsForBroker(broker.$key)
          leaseholds$.subscribe(leaseholds => broker.leaseholds = leaseholds);
          return broker;
        });
      });
  }

  presentModal() {
    let modal = this.modalController.create(BrokerListPage,
      {
        leaseholdId: this.leaseholdId,
        isListPage: true,
        addOptions: true,
        showAllBrokers: true
      });
    modal.present();
  }

}
