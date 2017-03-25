import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { PropertyService } from '../../providers/services';
import { AddLeaseholdPage, ContractDetailPage, CreatePropertyPage, AddOwnerPage, LeaseholdDetailPage, AddContractPage } from '../../pages/pages';
import { Property, Leasehold } from '../../models/models';

@Component({
  selector: 'page-property-detail',
  templateUrl: 'property-detail.html'
})
export class PropertyDetailPage {

  public property$: any;
  public leaseholds: Leasehold[];
  public propertyId: string;
  public propertyTitle: string;

  constructor(public navController: NavController, public navParams: NavParams, public platform: Platform,
    public actionSheetController: ActionSheetController, public alertController: AlertController, public propetyService: PropertyService) {
    this.propertyId = this.navParams.get('propertyId');
    this.property$ = this.propetyService.findProperty(this.propertyId);
    this.property$.subscribe((prop) => {
      this.propertyTitle = prop.title;
    })
  }

  ionViewDidLoad() {
    //this.property$ = this.propetyService.findProperty(this.propertyId);
    const leaseholds$ = this.propetyService.getLeaseholdsForProperty(this.propertyId);
    leaseholds$.subscribe(leaseholds => this.leaseholds = leaseholds);
  }

  morePropertyOptions() {
    let actionSheet = this.actionSheetController.create({
      title: 'Property Options',
      buttons: [
        {
          text: 'Delete this property',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            console.log('pId ', this.propertyId)
            this.deleteConfirmation()
          }
        },
        {
          text: 'Edit this property',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(CreatePropertyPage, {
              propertyId: this.propertyId
            });
          }
        },
        {
          text: 'Add Leasehold to property',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(AddLeaseholdPage, {
              propertyId: this.propertyId
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

  moreLeaseholdOptions(leasehold, itHas: boolean) {
    let actionSheet = this.actionSheetController.create({
      title: 'Leasehold Options',
      buttons: [
        {
          text: !leasehold.isRented ? 'Make a contract!' : 'Show my contract',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            if (itHas) {
              this.contractAlert(leasehold);
            } else {
              this.navController.push(ContractDetailPage, {
                leaseholdId: leasehold.$key
              })
            }
          }
        },
        {
          text: 'Who is the owner?',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(AddOwnerPage, {
              leaseholdId: leasehold.$key
            });
          }
        },
        {
          text: 'More details for this leasehold',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.navController.push(LeaseholdDetailPage, {
              leaseholdId: leasehold.$key
            });
          }
        },
        {
          text: 'Remove this leasehold.',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            //this.dataService.removeLeasehold(this.propertyId, leasehold.$key);
            this.navController.pop();
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

  contractAlert(leasehold: Leasehold) {
    if (leasehold.isRented) {
      let alert = this.alertController.create({
        title: 'Warning!',
        subTitle: 'This leasehold has already a contract!',
        buttons: [
          {
            text: 'OK'
          }

        ]
      });
      alert.present();
    } else {
      this.navController.push(AddContractPage, {
        leaseholdId: leasehold.$key,
      });
    }
  }

  releaseLeasehold(leaseholdId: string) {

  }

  deleteConfirmation() {
    let confirm = this.alertController.create({
      title: 'Delete Property?',
      message: 'You are about to delete ' + this.propertyTitle + ' ?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'ΟΚ',
          handler: () => {
            this.propetyService.removeProperty(this.propertyId);
            this.navController.pop();
          }
        }
      ]
    });
    confirm.present();
  }

}