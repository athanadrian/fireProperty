import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

import { AddContractPage } from '../../pages/pages';
import { PaymentService, LeaseholdService } from '../../providers/services';
import { Payment, Leasehold, Property, Contract, Renter } from '../../models/models';

@Component({
  selector: 'page-create-payment',
  templateUrl: 'create-payment.html'
})
export class CreatePaymentPage {

  leaseholds$: Leasehold[];
  properties$: Property[];
  payment: Payment;
  paymentId: string;
  contract$: Contract;
  renter$: any;
  newPaymentForm: any;
  //titleChanged: boolean = false;
  typeChanged: boolean = false;
  paidAmountChanged: boolean = false;
  submitAttempt: boolean = false;
  selectedProperty: Property;

  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public dataService: PaymentService,
    public leaseholdService: LeaseholdService,
    public propertyService: LeaseholdService) {

    this.propertyService.getProperties()
      .subscribe(properties => this.properties$ = properties);

    this.paymentId = this.navParams.get('paymentId');

    this.newPaymentForm = formBuilder.group({
      propertyOption: ['0', Validators.required],
      leaseholdOption: ['0', Validators.required],
      //title: [{ value: '', disabled: true }, Validators.required],
      type: ['', Validators.required],
      paidAmount: ['', Validators.required],
      deptDate: ['', Validators.required],
      dueDate: ['']
    })
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  onPropertySelect(propertyId: string) {
    console.log('hi ', propertyId);
    const leaseholds$ = this.propertyService.getLeaseholdsForProperty(propertyId);
    leaseholds$.subscribe(leaseholds => this.leaseholds$ = leaseholds);
  }

  onLeaseholdSelect(leaseholdId: string) {
    console.log('hi ', leaseholdId);

    this.leaseholdService.findContractForLeasehold(leaseholdId)
      .subscribe(contract => this.contract$ = contract);
    // if (this.contract$) {
    //   this.leaseholdService.getRenter(this.contract$.renterId);
    //     //.subscribe(renter=>this.renter$=renter);
    //   console.log('contract ', this.contract$);
    //   console.log('renter ', this.renter$);
    // } else {
    //   this.showConfirm(leaseholdId);
    // }
  }

  showConfirm(leaseholdId: string) {
    let confirm = this.alertController.create({
      title: 'Leasehold contract?',
      message: 'You need to add an active contract for the Leasehold?',
      buttons: [
        {
          text: 'Not now!',
          handler: () => {
            //this.navController.pop();
            return;
          }
        },
        {
          text: 'Do it now!',
          handler: () => {
            this.navController.push(AddContractPage, {
              leaseholdId: leaseholdId
            });
          }
        }
      ]
    });
    confirm.present();
  }

  createPayment({ value, valid }: { contractId: string, value: Payment, valid: boolean }) {
    this.submitAttempt = true;
    if (!this.newPaymentForm.valid) {
      console.log(this.newPaymentForm.value);
    } else {
      //value.title = this.newPaymentForm.value.title;
      value.type = this.newPaymentForm.value.type;
      value.paidAmount = this.newPaymentForm.value.paidAmount;
      value.deptDate = this.newPaymentForm.value.deptDate;
      value.dueDate = this.newPaymentForm.value.dueDate;
      value.totalAmount = 0; //? 0 : += this.newPaymentForm.value.totalAmount;
      value.isPaid = false;
      if (!this.paymentId) {
        this.leaseholdService.addPayment(this.contract$.$key, this.contract$.renterId, this.contract$.leaseholdId, value)
          .subscribe(() => {
            alert('payment added !');
            this.navController.pop();
          }, err => alert(`error adding payment, ${err}`));
      } else {
        this.leaseholdService.updatePayment(this.paymentId, value)
          .then(() => {
            alert('payment updated!');
            this.navController.pop();
          }, err => alert(`error updating payment, ${err}`));
      }
    }
  }
}
