import { Injectable, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { AngularFire, AngularFireDatabase, FirebaseRef, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { Leasehold, Contract, LeaseholdVM, Owner, Renter } from '../models/models';

@Injectable()
export class LeaseholdService {

  leaseholds$: Observable<Leasehold[]>;
  owners$: Observable<Owner[]>;
  renters$: Observable<Renter[]>;
  leasehold: Observable<Leasehold>;
  contracts$: Observable<Contract[]>;
  leaseholds: FirebaseListObservable<Leasehold[]>;
  contracts: FirebaseListObservable<Contract[]>;
  //LeaseholdVM$: Observable<LeaseholdVM>;
  userId: string;
  sdkDb: any;


  constructor(public af: AngularFire, @Inject(FirebaseRef) fb) {

    this.sdkDb = fb.database().ref();

    af.auth.subscribe((auth) => {
      if (auth) {
        this.leaseholds = af.database.list(`/userProfile/${auth.uid}/leaseholds/`);
        this.contracts$ = af.database.list(`/userProfile/${auth.uid}/contracts/`);
        this.contracts = af.database.list(`/userProfile/${auth.uid}/contracts/`);
        this.leaseholds$ = af.database.list(`/userProfile/${auth.uid}/leaseholds/`);
        this.owners$ = af.database.list(`/userProfile/${auth.uid}/owners/`);
        this.renters$ = af.database.list(`/userProfile/${auth.uid}/renters/`);
        this.userId = auth.uid;
      }
    });
  }

  getAllLeaseholds(): Observable<Leasehold[]> {
    return this.leaseholds$.map(Leasehold.fromJsonArray);
  }

  getAllOwners(): Observable<Owner[]> {
    return this.owners$.map(Owner.fromJsonArray);
  }

  getAllContracts(): Observable<Contract[]> {
    return this.contracts$.map(Contract.fromJsonArray);
  }

  getAllRenters(): Observable<Renter[]> {
    return this.renters$.map(Renter.fromJsonArray);
  }

  getLeasehold(leaseholdId: string): Observable<Leasehold> {
    return this.af.database.object(`/userProfile/${this.userId}/leaseholds/${leaseholdId}`)
      .map(Leasehold.fromJson);
  }

  getRenter(renterId: string): Observable<Renter> {
    return this.af.database.object(`/userProfile/${this.userId}/renters/${renterId}`)
      .map(Renter.fromJson);
  }

  getOwner(ownerId: string): Observable<Owner> {
    return this.af.database.object(`/userProfile/${this.userId}/owners/${ownerId}`)
      .map(Owner.fromJson);
  }

  findContract(leaseholdId: string): Observable<Contract> {
    const contract = this.af.database.list(`/userProfile/${this.userId}/contracts/`, {
      query: {
        orderByChild: 'leaseholdId',
        equalTo: leaseholdId
      }
    })
      .map(results => results[0])
      .do(console.log);
    return contract;
  }

  findRenter(renterId: string): Observable<Renter> {
    return this.af.database.list(`/userProfile/${this.userId}/renters/`, {
      query: {
        orderByKey: true,
        equalTo: renterId
      }
    })
      .map(results => results[0]);
  }

  findLeasehold(leaseholdId: string): Observable<Leasehold> {
    return this.af.database.list(`/userProfile/${this.userId}/leaseholds/`, {
      query: {
        orderByKey: true,
        equalTo: leaseholdId
      }
    })
      .map(results => results[0]);
  }

  findOwner(ownerId: string): Observable<Owner> {
    return this.af.database.list(`/userProfile/${this.userId}/owners/`, {
      query: {
        orderByKey: true,
        equalTo: ownerId
      }
    })
      .map(results => results[0]);
  }

  getContractsForLeasehold(leaseholdId: string) {
    const leasehold$ = this.getLeasehold(leaseholdId);

    const contractsPerLeasehold$ = leasehold$
      .switchMap(leasehold => this.af.database.list(`/userProfile/${this.userId}/contractsPerLeasehold/` + leasehold.$key))

    return contractsPerLeasehold$
      .map(cspl => cspl.map(cpl => this.af.database.object(`/userProfile/${this.userId}/contracts/` + cpl.$key)))
      .flatMap(fbojs => Observable.combineLatest(fbojs))
      .do(console.log);
  }

  getRentersForLeasehold(leaseholdId: string) {
    const leasehold$ = this.getLeasehold(leaseholdId);

    const rentersPerLeasehold$ = leasehold$
      .switchMap(leasehold => this.af.database.list(`/userProfile/${this.userId}/rentersPerLeasehold/` + leasehold.$key))

    return rentersPerLeasehold$
      .map(rspl => rspl.map(rpl => this.af.database.object(`/userProfile/${this.userId}/renters/` + rpl.$key)))
      .flatMap(fbojs => Observable.combineLatest(fbojs))
      .do(console.log);
  }

  getOwnersForLeasehold(leaseholdId: string) {
    const leasehold$ = this.getLeasehold(leaseholdId);

    const ownersPerLeasehold$ = leasehold$
      .switchMap(leasehold => this.af.database.list(`/userProfile/${this.userId}/ownersPerLeasehold/` + leasehold.$key))

    return ownersPerLeasehold$
      .map(ospl => ospl.map(opl => this.af.database.object(`/userProfile/${this.userId}/owners/` + opl.$key)))
      .flatMap(fbojs => Observable.combineLatest(fbojs))
      .do(console.log);
  }

  getLeaseholdsForOwner(ownerId:string){
    const owner$ = this.getOwner(ownerId);

    const leaseholdsPerOwner$ = owner$
      .switchMap(owner => this.af.database.list(`/userProfile/${this.userId}/leaseholdsPerOwner/` + owner.$key))

    return leaseholdsPerOwner$
      .map(lspo => lspo.map(lpo => this.af.database.object(`/userProfile/${this.userId}/leaseholds/` + lpo.$key)))
      .flatMap(fbojs => Observable.combineLatest(fbojs))
      .do(console.log);
  }

  addLeasehold(propertyId: string, leasehold: any): Observable<any> {
    const leaseholdsToSave = Object.assign({}, leasehold, { propertyId: propertyId });
    const newLeaseholdKey = this.sdkDb.child('leaseholds/').push().key;

    let dataToSave = {};
    dataToSave["/userProfile/" + this.userId + "/leaseholds/" + newLeaseholdKey] = leaseholdsToSave;
    dataToSave[`/userProfile/${this.userId}/leaseholdsPerProperty/${propertyId}/${newLeaseholdKey}`] = true;

    return this.firebaseUpdate(dataToSave);
  }

  addOwner(leaseholdId: string, owner: any): Observable<any> {
    const ownerToSave = Object.assign({}, owner, { leaseholdId: leaseholdId });
    const newOwnerKey = this.sdkDb.child('owners/').push().key;

    let dataToSave = {};
    dataToSave["/userProfile/" + this.userId + "/owners/" + newOwnerKey] = ownerToSave;
    dataToSave[`/userProfile/${this.userId}/ownersPerLeasehold/${leaseholdId}/${newOwnerKey}`] = true;
    dataToSave[`/userProfile/${this.userId}/leaseholdsPerOwner/${newOwnerKey}/${leaseholdId}`] = true;

    return this.firebaseUpdate(dataToSave);
  }

  addContract(leaseholdId: string, contract: any) {
    const contractToSave = Object.assign({}, contract, { leaseholdId: leaseholdId });
    const newContractKey = this.sdkDb.child('contracts/').push().key;

    this.rentLeasehold(leaseholdId);

    let dataToSave = {};
    dataToSave["/userProfile/" + this.userId + "/contracts/" + newContractKey] = contractToSave;
    dataToSave[`/userProfile/${this.userId}/contractsPerLeasehold/${leaseholdId}/${newContractKey}`] = true;

    return this.firebaseUpdate(dataToSave);
  }

  addRenter(leaseholdId: string, contractId: string, renter: any) {
    const renterToSave = Object.assign({}, renter);
    const newRenterKey = this.sdkDb.child('renters/').push().key;

    this.addRenterToContract(contractId, newRenterKey);

    let dataToSave = {};
    dataToSave["/userProfile/" + this.userId + "/renters/" + newRenterKey] = renterToSave;
    dataToSave[`/userProfile/${this.userId}/rentersPerLeasehold/${leaseholdId}/${newRenterKey}`] = true;
    dataToSave[`/userProfile/${this.userId}/leaseholdsPerRenter/${newRenterKey}/${leaseholdId}`] = true;

    return this.firebaseUpdate(dataToSave);
  }

  addContractToLeasehold(leaseholdId: string, contractId: string) {
    return this.leaseholds.update(leaseholdId, { contractId: contractId, isRented: true });
  }

  addRenterToContract(contractId: string, renterId: string) {
    return this.contracts.update(contractId, { renterId: renterId });
  }

  addOwnerToLeasehold(leaseholdId: string, ownerId: string) {
    return this.leaseholds.update(leaseholdId, { ownerId: ownerId });
  }

  rentLeasehold(leaseholdId: string) {
    return this.leaseholds.update(leaseholdId, { isRented: true });
  }

  releaseLeasehold(leaseholdId: string) {
    return this.leaseholds.update(leaseholdId, { isRented: false });
  }

  endContract(contractId: string) {
    return this.leaseholds.update(contractId, { isActive: false });
  }

  endRenter(renterId: string) {
    return this.leaseholds.update(renterId, { isActive: false });
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
