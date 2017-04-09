import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { AngularFire } from 'angularfire2';

import { HomePage, StartPage, CreatePropertyPage, AddLeaseholdPage,
         PropertyListPage, LeaseholdListPage, OwnerListPage,
         AboutPage, ProfilePage, RenterListPage } from '../pages/pages';
import { PageItem } from '../models/models';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  appPages: PageItem[] = [
    { title:'Payments', component: HomePage, icon:'logo-euro'},
    { title: 'Properties', component: PropertyListPage, icon: 'home' },
    { title: 'Leaseholds', component: LeaseholdListPage, icon: 'logo-buffer' },
    { title: 'Renters', component: RenterListPage, icon: 'people' },
    { title: 'Owners', component: OwnerListPage, icon: 'contacts' }
  ];

  menuPages: PageItem[] = [
    //{ title: 'Χάρτης', component: MapPage, icon: 'globe' },
    { title: 'Profile', component: ProfilePage, icon: 'person' },
    //{ title: 'Πεδία', component: CragsPage, index: 2, icon: 'podium' }
  ];

  adminPages: PageItem[] = [
    { title: 'Property', component: CreatePropertyPage, icon: 'ios-add-circle-outline' },
    { title: 'Leasehold', component: AddLeaseholdPage, icon: 'ios-add-circle-outline' }
  ];

  helpPages: PageItem[] = [
      //{title: 'Welcome', component: WelcomePage, icon: 'bookmark'},
      {title: 'About', component: AboutPage, icon: 'information-circle'},
  ];

  constructor(
    platform: Platform,
    af: AngularFire) {
    af.auth.subscribe(user => {
      if (user) {
        this.rootPage = HomePage;
      } else {
        this.rootPage = StartPage;
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component,{isListPage:true});
  }
}