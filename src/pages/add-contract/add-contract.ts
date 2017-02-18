import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { LeaseholdService } from '../../providers/services';
import { AddRenterPage } from '../../pages/pages';
import { Leasehold, Contract, Renter } from '../../models/models';


@Component({
  selector: 'page-add-contract',
  templateUrl: 'add-contract.html'
})
export class AddContractPage {

  newContractForm: any;
  initialDurationChanged: boolean = false;
  contractAmountChanged: boolean = false;
  submitAttempt: boolean = false;
  leaseholdId: string;

  constructor(public navController: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder, public alertController:AlertController, public leaseholdService: LeaseholdService) {

    this.leaseholdId = this.navParams.get('leaseholdId');
    this.newContractForm = formBuilder.group({
      initialDuration: ['', Validators.required],
      contractAmount: ['', Validators.required],
      startDate: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddOwnerPage');
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  addContract({value, valid }: { leaseholdId: string, value: Contract, valid: boolean }) {
    this.submitAttempt = true;
    if (!this.newContractForm.valid) {
      console.log(this.newContractForm.value);
    } else {
      value.initialDuration = this.newContractForm.value.initialDuration;
      value.contractAmount = this.newContractForm.value.contractAmount;
      value.startDate = this.newContractForm.value.startDate;
      value.isActive = true;
      this.leaseholdService.addContract(this.leaseholdId, value)
        .subscribe(() => {
          this.showConfirm();
        }, err => alert(`error establishing contract, ${err}`));
    }
  }

  showConfirm() {
    let confirm = this.alertController.create({
      title: 'Add renter info?',
      message: 'Enter more info about the renter now or do it later?',
      buttons: [
        {
          text: 'Not now!',
          handler: () => {
            this.navController.pop();
          }
        },
        {
          text: 'Do it now!',
          handler: () => {
            this.navController.push(AddRenterPage, 
            {leaseholdId:this.leaseholdId})
          }
        }
      ]
    });
    confirm.present();
  }
}
