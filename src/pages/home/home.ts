import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { LeaseholdService } from '../../providers/services';

import { ProfilePage, CreatePaymentPage, PaymentDetailPage } from '../pages';
import { Payment, PaymentVM } from '../../models/models';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public totalPayments: number;
  public paymentsVM: any;
  public contract: any;
  public renterId: string;
  public leaseholdId: string;
  public addOptions: boolean = false;
  public groupedPayments:any;

  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public leaseholdService: LeaseholdService,
    public actionSheetController: ActionSheetController,
    public platform: Platform) {

    this.leaseholdId = this.navParams.get('leaseholdId');
    this.renterId = this.navParams.get('renterId');
    this.addOptions = !this.leaseholdId ? true : this.navParams.get('addOptions');

    if (this.addOptions) {
      this.getAllPaymentsVM();
    }
    if (this.renterId) {
      this.getPaymentsForRenter();
    } else if (this.leaseholdId) {
      this.getPaymentsForLeasehold();
    }
  }

  groupPayments(payments:any){
      let propertyTitle="";
      let totalPayments=[];

      payments.forEach((payment,index)=>{
        if(payment.propertyTitle=propertyTitle){
          propertyTitle=payment.properTitle;

          let newGroup={
            groupPropertyTitle:propertyTitle,
            payments:[]
          };

          totalPayments=newGroup.payments;
          this.groupedPayments.push(newGroup);
        }
        totalPayments.push(payment);
      });
    }

    // loadClimbs(){
    //   console.log('loading climbs....');
    //   this.dataService.getClimbs()
    //     .subscribe(data=>{
    //       this.climbs=data;
    //       this.groupClimbs(this.climbs);
    //     })
    //     console.log('climbs: '+this.climbs);
    // }

  getAllPaymentsVM() {
    this.paymentsVM = this.leaseholdService.getAllPaymentsVM()
      .map((paymentsVM) => {
        this.groupPayments(paymentsVM);
        this.totalPayments = paymentsVM.length;
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

  getPaymentsForLeasehold() {
    this.paymentsVM = this.leaseholdService.getPaymentsForLeasehold(this.leaseholdId)
      .map((paymentsVM) => {
        this.totalPayments = paymentsVM.length;
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

  getPaymentsForRenter() {
    this.paymentsVM = this.leaseholdService.getPaymentsForRenter(this.renterId)
      .map((paymentsVM) => {
        this.totalPayments = paymentsVM.length;
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

  morePaymentOptions(paymentId: string) {
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
