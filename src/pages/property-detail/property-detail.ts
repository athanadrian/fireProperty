import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { PropertyService } from '../../providers/services';
import { AddLeaseholdPage, CreatePropertyPage, AddOwnerPage, LeaseholdDetailPage, AddContractPage } from '../../pages/pages';
import { Property, Leasehold } from '../../models/models';

@Component({
  selector: 'page-property-detail',
  templateUrl: 'property-detail.html'
})
export class PropertyDetailPage {

  public property$: any;
  public leaseholds: Leasehold[];
  public propertyId: string;

  constructor(public navController: NavController, public navParams: NavParams, public platform: Platform,
    public actionSheetController: ActionSheetController, public alertController: AlertController, public propetyService: PropertyService) {
    this.propertyId = this.navParams.get('propertyId');
  }

  ionViewDidLoad() {
    this.property$ = this.propetyService.findProperty(this.propertyId);
    const leaseholds$ = this.propetyService.getLeaseholdsForProperty(this.propertyId);
    leaseholds$.subscribe(leaseholds => this.leaseholds = leaseholds);
  }

  morePropertyOptions(propertyId) {
    let actionSheet = this.actionSheetController.create({
      title: '',
      buttons: [
        {
          text: 'Delete property',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.propetyService.removeProperty(propertyId);
            this.navController.pop();
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

  moreLeaseholdOptions(leasehold) {
    //let leasehold:Leasehold;
    //this.leasehold = this.dataService.getLeasehold(this.propertyId, leasehold.$key);
    let actionSheet = this.actionSheetController.create({
      title: '',
      buttons: [
        {
          text: 'Rent it!',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            if (leasehold.isRented) {
              let alert = this.alertController.create({
                title: 'Warning!',
                subTitle: 'This leasehold is already rented!',
                buttons: ['OK']
              });
              alert.present();
            } else {
              this.navController.push(AddContractPage, {
                leaseholdId: leasehold.$key,
              });
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
          text: 'Delete this leasehold',
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

  releaseLeasehold(leaseholdId: string) {

  }

}