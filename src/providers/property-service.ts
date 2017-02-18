import { Injectable, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { AngularFire, AngularFireDatabase, FirebaseRef, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { Property, PropertyVM } from '../models/models';

@Injectable()
export class PropertyService {

  propertiesVM$:FirebaseListObservable<PropertyVM[]>;
  properties$: Observable<Property[]>;
  property$: Observable<Property>;
  properties: FirebaseListObservable<Property[]>;
  userId: string;
  sdkDb: any;

  constructor(public af: AngularFire, @Inject(FirebaseRef) fb) {

    this.sdkDb = fb.database().ref();

    af.auth.subscribe((auth) => {
      if (auth) {
        this.properties = af.database.list(`/userProfile/${auth.uid}/properties/`);
        this.properties$ = af.database.list(`/userProfile/${auth.uid}/properties/`);
        this.propertiesVM$ = af.database.list(`/userProfile/${auth.uid}/properties/`);
        this.userId = auth.uid;
      }
    });
  }

  getProperties(): Observable<Property[]> {
    return this.properties$.map(Property.fromJsonArray);
  }

  getPropertiesVM(): Observable<PropertyVM[]> {
    return this.propertiesVM$;
  }

  getProperty(propertyId: string): Observable<Property> {
    return this.af.database.object(`/userProfile/${this.userId}/properties/${propertyId}`)
      .map(Property.fromJson);
  }

  findProperty(propertyId: string): Observable<Property> {
    return this.af.database.list(`/userProfile/${this.userId}/properties/`, {
      query: {
        orderByKey: true,
        equalTo: propertyId
      }
    })
      .map(results => results[0]);
  }

  // addLeasehold(propertyId:string, leasehold: Leasehold) {
  //   this.leaseholdList = this.af.database.list(`/userProfile/${this.userId}/propertyList/${propertyId}/leaseholdList`);
  //   return this.leaseholdList.push( leasehold );
  // }

  getLeaseholdsForProperty(propertyId: string) {
    const property$ = this.getProperty(propertyId);

    const leaseholdsPerProperty$ = property$
      .switchMap(property => this.af.database.list(`/userProfile/${this.userId}/leaseholdsPerProperty/` + property.$key))

    return leaseholdsPerProperty$
      .map(lspp => lspp.map(lpp => this.af.database.object(`/userProfile/${this.userId}/leaseholds/` + lpp.$key)))
      .flatMap(fbojs => Observable.combineLatest(fbojs))
      .do(console.log);
  }

  getTotalLeaseholsPerProperty(propertyId:string){
    return this.sdkDb.child(`/userProfile/${this.userId}/leaseholdsPerProperty/${propertyId}`).once('value');
  }

  getAllLeaseholdsForProperty(propertyId:string): Observable<any[]> {
    const leaseholdsPerProperty=this.af.database.list(`/userProfile/${this.userId}/leaseholdsPerProperty/${propertyId}`);
    return leaseholdsPerProperty;
  }

  getLeaseholsForProperties(properties$: Observable<Property[]>) {
    properties$ = this.getProperties();
    return properties$.map(properties =>
      properties.map(property => {
        const property$ = this.getProperty(property.$key);

        const leaseholdsPerProperty$ = property$
          .switchMap(property => this.af.database.list(`/userProfile/${this.userId}/leaseholdsPerProperty/` + property.$key))

        return leaseholdsPerProperty$
          .map(lspp => lspp.map(lpp => this.af.database.object(`/userProfile/${this.userId}/leaseholds/` + lpp.$key)))
          .flatMap(fbojs => Observable.combineLatest(fbojs))
          .do(console.log);
      }));
  }

  createProperty(property: Property) {
    return this.properties.push(property);
  }

  editProperty(propertyId: string, property): Observable<any> {
    const propertyToSave = Object.assign({}, property);
    delete (propertyToSave.$key);

    let dataToSave = {};
    dataToSave[`properties/${propertyId}`] = propertyToSave;

    return this.firebaseUpdate(dataToSave);
  }

  removeProperty(propertyId: string) {
    return this.properties.remove(propertyId);
  }

  updateProperty(propertyId: string, property) {
    return this.properties.update(propertyId, property);
  }

  firebaseUpdate(dataToSave) {
    const subject = new Subject();

    this.sdkDb.update(dataToSave)
      .then(
      val => {
        subject.next(val);
        subject.complete();

      },
      err => {
        subject.error(err);
        subject.complete();
      }
      );

    return subject.asObservable();
  }

}
