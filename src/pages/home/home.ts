import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';

import { ProfilePage, CreatePaymentPage, PaymentDetailPage } from '../pages';
import { Payment } from '../../models/models';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public payments$: Payment[];
  public paymentsVM: any;
  public contract: any;

  constructor(
    public navController: NavController,
    public leaseholdService: LeaseholdService,
    public actionSheetController: ActionSheetController,
    public platform: Platform) {

    this.leaseholdService.getAllPayments()
      .subscribe(payments => this.payments$ = payments)

    this.paymentsVM = this.leaseholdService.getAllPaymentsVM()
      .map((paymentsVM) => {
        return paymentsVM.map(payment => {
          this.leaseholdService.findContract(payment.contractId)
            .subscribe(contract => {
              payment.contract = contract
              this.leaseholdService.findRenter(contract.renterId)
                .subscribe(renter => payment.renter = renter);
              this.leaseholdService.findLeasehold(contract.leaseholdId)
                .subscribe(leasehold => {
                  payment.leasehold = leasehold
                  this.leaseholdService.findProperty(leasehold.propertyId)
                    .subscribe(property => payment.property = property)
                });
            });
          return payment;
        });
      });
  }

  createPayment(): void {
    this.navController.push(CreatePaymentPage);
  }

  goToPaidPayment(paymentId: string): void {
    this.navController.push(PaymentDetailPage, { paymentId: paymentId })
  }

  goToProfile() {
    this.navController.push(ProfilePage);
  }

  morePaymentOptions(paymentId:string) {
    let actionSheet = this.actionSheetController.create({
      title: '',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            //this.leaseholdService.removePayment(paymentId);
            this.navController.pop();
          }
        },
        {
          text: 'More details',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(PaymentDetailPage, {
              paymentId: paymentId
            });
          }
        },
        {
          text: 'Mark as Paid',
          icon: !this.platform.is('ios') ? 'checkmark' : null,
          handler: () => {
            this.leaseholdService.payPayment(paymentId);
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
