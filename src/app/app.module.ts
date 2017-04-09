import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { StartPage, HomePage, LoginPage, SignupPage, ResetPasswordPage, ProfilePage, PaymentDetailPage, AboutPage,
          CreatePaymentPage, PropertyListPage, PropertyDetailPage, CreatePropertyPage, ContractDetailPage,
          AddLeaseholdPage, AddOwnerPage,  LeaseholdDetailPage, LeaseholdListPage, ContractListPage,
          OwnerListPage, AddRenterPage, RenterListPage, RenterDetailPage, AddContractPage, OwnerDetailPage } from '../pages/pages';
import { AuthService, PropertyService, PaymentService, LeaseholdService} from '../providers/services';

import { PropertyComponent, LeaseholdComponent, RenterComponent, OwnerComponent } from '../shared/components/components';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2'

export const firebaseConfig = {
  apiKey: "AIzaSyDx8muahAeqyiZqdej1RjuFSCrv-9Q5w3A",
  authDomain: "myproperty-4ef4e.firebaseapp.com",
  databaseURL: "https://myproperty-4ef4e.firebaseio.com",
  storageBucket: "myproperty-4ef4e.appspot.com",
  messagingSenderId: "615105415177"
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    MyApp,
    StartPage,
    HomePage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    AboutPage,
    ProfilePage,
    PaymentDetailPage,
    CreatePaymentPage,
    PropertyListPage,
    PropertyDetailPage,
    CreatePropertyPage,
    AddLeaseholdPage,
    AddOwnerPage,
    LeaseholdDetailPage,
    LeaseholdListPage,
    OwnerListPage,
    OwnerDetailPage,
    AddRenterPage,
    RenterListPage,
    RenterDetailPage,
    AddContractPage,
    ContractListPage,
    ContractDetailPage,
    PropertyComponent,
    LeaseholdComponent,
    RenterComponent,
    OwnerComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StartPage,
    HomePage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    AboutPage,
    ProfilePage,
    PaymentDetailPage,
    CreatePaymentPage,
    PropertyListPage,
    PropertyDetailPage,
    CreatePropertyPage,
    AddLeaseholdPage,
    AddOwnerPage,
    LeaseholdDetailPage,
    LeaseholdListPage,
    OwnerListPage,
    OwnerDetailPage,
    AddRenterPage,
    RenterListPage,
    RenterDetailPage,
    AddContractPage,
    ContractListPage,
    ContractDetailPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, LeaseholdService, PaymentService, PropertyService, AuthService]
})
export class AppModule { }