import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';

import { LeaseholdService } from '../../providers/services';
import { AddRenterPage } from '../../pages/pages';
import { Renter, Leasehold } from '../../models/models';


@Component({
  selector: 'page-renter-detail',
  templateUrl: 'renter-detail.html'
})
export class RenterDetailPage {

  public renter$: any;
  public leaseholds: Leasehold[];
  public renterId: string;
  public leaseholdsVM:any;
  public totalLeaseholds:number;

  constructor(
    public navController: NavController,
    public platform: Platform,
    public leaseholdService: LeaseholdService,
    public actionSheetController: ActionSheetController,
    public navParams: NavParams) {

    this.renterId = this.navParams.get('renterId');
  }

  ionViewDidLoad() {
    this.renter$ = this.leaseholdService.findRenter(this.renterId);
    this.leaseholdsVM = this.leaseholdService.getLeaseholdsForRenter(this.renterId)
      .map((leaseholds) => {
        this.totalLeaseholds=leaseholds.length;
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

  moreRenterOptions() {
    let actionSheet = this.actionSheetController.create({
      title: 'Renter Options',
      buttons: [
        {
          text: 'Delete Renter',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            //this.leaseholdService.removeContract(contractId);
            this.navController.pop();
          }
        },
        {
          text: 'Edit this renter',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(AddRenterPage, {
              renterId: this.renterId
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
