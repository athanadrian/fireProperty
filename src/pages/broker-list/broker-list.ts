import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';
import { Observable } from 'rxjs/Rx';

import { AddBrokerPage } from '../../pages/pages';
import { Broker, BrokerVM, Leasehold } from '../../models/models';

@Component({
  selector: 'page-broker-list',
  templateUrl: 'broker-list.html'
})
export class BrokerListPage {

  public brokers$: Broker[];
  public brokersVM: any;
  public totalBrokers: number;
  public leaseholdId: string;
  public addOptions: boolean = false;

  constructor(
    public navController: NavController,
    public platform: Platform,
    public modalController: ModalController,
    public alertController: AlertController,
    public leaseholdService: LeaseholdService,
    public navParams: NavParams) {

    this.leaseholdId = this.navParams.get('leaseholdId');
    this.addOptions =!this.leaseholdId ? true : this.navParams.get('addOptions');

    if (this.addOptions) {
      this.getAllBrokersVM();
    } else {
      this.brokersVM = this.leaseholdService.getBrokersForLeasehold(this.leaseholdId)
        .map((brokersVM) => {
          return brokersVM.map(broker => {
            this.brokers$ = brokersVM;
            const leaseholds$ = this.leaseholdService.getLeaseholdsForBroker(broker.$key)
            leaseholds$.subscribe(leaseholds => {
              broker.leaseholds = leaseholds;
            });
            return broker;
          });
        });
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
          leaseholds$.subscribe(leaseholds => {
            broker.leaseholds = leaseholds;
          });
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
