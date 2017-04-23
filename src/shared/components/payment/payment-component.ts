import { Component } from '@angular/core';

@Component({
  selector: 'payment-component',
  templateUrl: 'payment-component.html'
})
export class PaymentComponent {

  text: string;

  constructor() {
    console.log('Hello PaymentComponent Component');
    this.text = 'Hello World';
  }

}
