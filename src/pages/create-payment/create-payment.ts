import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

import { PaymentService, PropertyService, LeaseholdService } from '../../providers/services';

import { Payment, Leasehold, Property, Contract , Renter} from '../../models/models';

@Component({
  selector: 'page-create-payment',
  templateUrl: 'create-payment.html'
})
export class CreatePaymentPage {

  leaseholds$: Leasehold[];
  properties$: Property[];
  payment: Payment;
  contract$: Contract;
  renter$:Observable<Renter>;
  newPaymentForm: any;
  titleChanged: boolean = false;
  nameChanged: boolean = false;
  amountChanged: boolean = false;
  submitAttempt: boolean = false;
  selectedProperty: Property;

  constructor(public navController: NavController, public formBuilder: FormBuilder,
    public dataService: PaymentService, public leaseholdService: LeaseholdService, public propertyService: PropertyService) {

    this.propertyService.getProperties()
      .subscribe(properties => this.properties$ = properties);

    this.newPaymentForm = formBuilder.group({
      propertyOption: ['0', Validators.required],
      leaseholdOption: ['0', Validators.required],
      title: [{value:'',disabled:true}, Validators.required],
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
    this.leaseholdService.findContract(leaseholdId)
      .subscribe(contract => {
        this.contract$ = contract;
        this.renter$=this.leaseholdService.findRenter(this.contract$.renterId);
        console.log('contract ', this.contract$);
        console.log('renter ', this.renter$);
      });
  }

  createPayment({ value, valid }: { value: Payment, valid: boolean }) {
    this.submitAttempt = true;
    if (!this.newPaymentForm.valid) {
      console.log(this.newPaymentForm.value);
    } else {
      value.title = this.newPaymentForm.value.title;
      value.type = this.newPaymentForm.value.type;
      value.paidAmount = this.newPaymentForm.value.amount;
      value.deptDate = this.newPaymentForm.value.deptDate;
      value.dueDate = this.newPaymentForm.value.dueDate;
      value.totalAmount += this.newPaymentForm.value.amount;
      value.isPaid = false;
      this.dataService.createPayment(value)
        .then(() => {
          this.navController.pop();
        }, (error) => {
          console.log(error);
        });
    }
  }

}
