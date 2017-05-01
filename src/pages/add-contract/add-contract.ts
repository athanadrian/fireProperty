import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { LeaseholdService, NotificationService } from '../../providers/services';
import { AddRenterPage, RenterListPage } from '../../pages/pages';
import { Leasehold, ContractVM } from '../../models/models';

@Component({
  selector: 'page-add-contract',
  templateUrl: 'add-contract.html'
})
export class AddContractPage {

  public newContractForm: any;
  public initialDurationChanged: boolean = false;
  public contractAmountChanged: boolean = false;
  public guaranteeChanged: boolean = false;
  public submitAttempt: boolean = false;
  public contract: any;
  public leaseholdId: string;
  public contractId: string;
  public object: string = 'Contract';

  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public leaseholdService: LeaseholdService,
    public notificationService: NotificationService) {

    this.contractId = this.navParams.get('contractId');
    this.leaseholdId = this.navParams.get('leaseholdId');

    this.leaseholdService.getContract(this.contractId)
      .subscribe(contract=>this.contract=contract);

    if (this.contractId) {
      this.newContractForm = formBuilder.group({
        initialDuration: [this.contract.initialDuration, Validators.required],
        contractAmount: [this.contract.contractAmount, Validators.required],
        guarantee: [this.contract.guarantee, Validators.required],
        startDate: [this.contract.startDate, Validators.required]
      });
    } else {
      this.newContractForm = formBuilder.group({
        initialDuration: ['', Validators.required],
        contractAmount: ['', Validators.required],
        guarantee: ['', Validators.required],
        startDate: ['', Validators.required]
      });
    }

  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  addContract({value, valid }: { leaseholdId: string, value: ContractVM, valid: boolean }) {
    this.submitAttempt = true;
    if (!this.newContractForm.valid) {
      this.notificationService.invalidFormToast();
    } else {
      value.initialDuration = this.newContractForm.value.initialDuration;
      value.contractAmount = this.newContractForm.value.contractAmount;
      value.startDate = this.newContractForm.value.startDate;
      value.guarantee = this.newContractForm.value.guarantee;
      value.isActive = true;
      if (!this.contractId) {
      this.leaseholdService.addContract(this.leaseholdId, value)
          .subscribe(() => {
            this.showConfirm();
            this.notificationService.addUpdateToast(this.contractId, this.object);
            this.navController.pop();
          }, (error) => {
            this.notificationService.errorToast(this.contractId, this.object, error);
          });
      } else {
        this.leaseholdService.updateContract(this.contractId, value)
          .then(() => {
            this.notificationService.addUpdateToast(this.contractId, this.object);
            this.navController.pop();
          }, (error) => {
            this.notificationService.errorToast(this.contractId, this.object, error);
          });
      }
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
            this.showRentItConfirmation();
            this.navController.pop();
          }
        }
      ]
    });
    confirm.present();
  }

  showRentItConfirmation() {
    let confirm = this.alertController.create({
      title: 'Add Renter',
      buttons: [
        {
          text: 'Add Renter from list?',
          handler: () => {
            this.navController.push(RenterListPage,
              {
                leaseholdId: this.leaseholdId,
                isListPage: true,
                addOptions: true
              })
          }
        },
        {
          text: 'Add a new Renter?',
          handler: () => {
            this.navController.push(AddRenterPage,
              { leaseholdId: this.leaseholdId })
          }
        }
      ]
    });
    confirm.present();
  }
}
