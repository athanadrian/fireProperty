import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { StartPage, HomePage, LoginPage, SignupPage, ResetPasswordPage, ProfilePage, PaymentDetailPage, AboutPage,
          CreatePaymentPage, PropertyListPage, PropertyDetailPage, CreatePropertyPage, ContractDetailPage,
          AddLeaseholdPage, AddOwnerPage,  LeaseholdDetailPage, LeaseholdListPage, ContractListPage,
          OwnerListPage, AddRenterPage, RenterListPage, RenterDetailPage, AddContractPage, OwnerDetailPage,
          BrokerListPage, BrokerDetailPage, AddBrokerPage } from '../pages/pages';
import { AuthService, PaymentService, LeaseholdService, NotificationService} from '../providers/services';

import { PropertyComponent, LeaseholdComponent, RenterComponent, OwnerComponent, ContractComponent, BrokerComponent, PaymentComponent } from '../shared/components/components';
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
    BrokerListPage,
    BrokerDetailPage,
    AddBrokerPage,
    PropertyComponent,
    LeaseholdComponent,
    RenterComponent,
    OwnerComponent,
    ContractComponent,
    BrokerComponent,
    PaymentComponent
  ],
  imports: [
    BrowserModule,
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
    ContractDetailPage,
    BrokerListPage,
    BrokerDetailPage,
    AddBrokerPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
     PaymentService, LeaseholdService, AuthService, NotificationService]
})
export class AppModule { }