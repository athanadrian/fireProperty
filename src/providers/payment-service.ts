import { Injectable } from '@angular/core';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Payment, Property, Leasehold } from '../models/models';


@Injectable()
export class PaymentService {

  paymentList: FirebaseListObservable<Payment[]>;
  paymentDetail: FirebaseObjectObservable<Payment>;
  userId: string;

  constructor(public af: AngularFire) {
    af.auth.subscribe((auth) => {
      if (auth) {
        this.paymentList = af.database.list(`/userProfile/${auth.uid}/paymentList/`);
        this.userId = auth.uid;
      }
    });
  }

  getPaymentList(): FirebaseListObservable<Payment[]> {
    return this.paymentList;
  }

  getPayment(paymentId: string): FirebaseObjectObservable<Payment> {
    return this.paymentDetail =
      this.af.database.object(`/userProfile/${this.userId}/paymentList/${paymentId}/`);
  }

  createPayment(payment: Payment) {
    return this.paymentList.push(payment);
  }

  payPayment(paymentId: string) {
    return this.paymentList.update(paymentId, { paid: true, paidDate: Date() });
  }

  removePayment(paymentId: string) {
    return this.paymentList.remove(paymentId);
  }

}
