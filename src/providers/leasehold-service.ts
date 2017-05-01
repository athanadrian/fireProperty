import { Injectable, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { AngularFire, AngularFireDatabase, FirebaseRef, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import {
  Property, PropertyVM,
  Leasehold, LeaseholdVM,
  Broker, BrokerVM,
  Contract, ContractVM,
  Owner, OwnerVM,
  Renter, RenterVM,
  Payment, PaymentVM
} from '../models/models';

@Injectable()
export class LeaseholdService {

  propertiesVM$: FirebaseListObservable<PropertyVM[]>;
  // properties$: Observable<Property[]>;
  property$: Observable<Property>;
  //properties: FirebaseListObservable<Property[]>;
  leasehold: Observable<Leasehold>;
  leaseholds$: Observable<Leasehold[]>;
  leaseholds: FirebaseListObservable<Leasehold[]>;
  leaseholdsVM: FirebaseListObservable<LeaseholdVM[]>;
  owners$: Observable<Owner[]>;
  owners: FirebaseListObservable<Owner[]>;
  ownersVM: FirebaseListObservable<OwnerVM[]>;
  brokers$: Observable<Broker[]>;
  brokers: FirebaseListObservable<Broker[]>;
  brokersVM: FirebaseListObservable<BrokerVM[]>;
  renters$: Observable<Renter[]>;
  renters: FirebaseListObservable<Renter[]>;
  rentersVM: FirebaseListObservable<RenterVM[]>;
  contracts$: Observable<Contract[]>;
  contracts: FirebaseListObservable<Contract[]>;
  contractsVM: FirebaseListObservable<ContractVM[]>;
  payments$: Observable<Payment[]>;
  payments: FirebaseListObservable<Payment[]>;
  paymentsVM: FirebaseListObservable<PaymentVM[]>;

  userId: string;
  sdkDb: any;


  constructor(public af: AngularFire, @Inject(FirebaseRef) fb) {

    this.sdkDb = fb.database().ref();

    af.auth.subscribe((auth) => {
      if (auth) {
        //this.properties = af.database.list(`/userProfile/${auth.uid}/properties/`);
        //this.properties$ = af.database.list(`/userProfile/${auth.uid}/properties/`);
        this.propertiesVM$ = af.database.list(`/userProfile/${auth.uid}/properties/`);
        this.leaseholds = af.database.list(`/userProfile/${auth.uid}/leaseholds/`);
        this.leaseholds$ = af.database.list(`/userProfile/${auth.uid}/leaseholds/`);
        this.leaseholdsVM = af.database.list(`/userProfile/${auth.uid}/leaseholds/`);
        this.renters = af.database.list(`/userProfile/${auth.uid}/renters/`);
        this.renters$ = af.database.list(`/userProfile/${auth.uid}/renters/`);
        this.rentersVM = af.database.list(`/userProfile/${auth.uid}/renters/`);
        this.brokers = af.database.list(`/userProfile/${auth.uid}/brokers/`);
        this.brokers$ = af.database.list(`/userProfile/${auth.uid}/brokers/`);
        this.brokersVM = af.database.list(`/userProfile/${auth.uid}/brokers/`);
        this.owners = af.database.list(`/userProfile/${auth.uid}/owners/`);
        this.owners$ = af.database.list(`/userProfile/${auth.uid}/owners/`);
        this.ownersVM = af.database.list(`/userProfile/${auth.uid}/owners/`);
        this.contracts = af.database.list(`/userProfile/${auth.uid}/contracts/`);
        this.contracts$ = af.database.list(`/userProfile/${auth.uid}/contracts/`);
        this.contractsVM = af.database.list(`/userProfile/${auth.uid}/contracts/`);
        this.payments = af.database.list(`/userProfile/${auth.uid}/payments/`);
        this.payments$ = af.database.list(`/userProfile/${auth.uid}/payments/`);
        this.paymentsVM = af.database.list(`/userProfile/${auth.uid}/payments/`);
        this.userId = auth.uid;
      }
    });
  }
  //--------------------------------------------**** PROPERTY ****-------------------------------------------- 
  // getProperties(): Observable<Property[]> {
  //   return this.properties$.map(Property.fromJsonArray);
  // }

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

  getLeaseholdsForProperty(propertyId: string) {
    const property$ = this.getProperty(propertyId);

    const leaseholdsPerProperty$ = property$
      .switchMap(property => this.af.database.list(`/userProfile/${this.userId}/leaseholdsPerProperty/` + property.$key))

    return leaseholdsPerProperty$
      .map(lspp => lspp.map(lpp => this.af.database.object(`/userProfile/${this.userId}/leaseholds/` + lpp.$key)))
      .flatMap(fbojs => Observable.combineLatest(fbojs))
      .do(console.log);
  }

  createProperty(property: Property) {
    return this.propertiesVM$.push(property);
  }

  editProperty(propertyId: string, property): Observable<any> {
    const propertyToSave = Object.assign({}, property);
    delete (propertyToSave.$key);

    let dataToSave = {};
    dataToSave[`properties/${propertyId}`] = propertyToSave;

    return this.firebaseUpdate(dataToSave);
  }

  removeProperty(propertyId: string) {
    return this.propertiesVM$.remove(propertyId);
  }

  updateProperty(propertyId: string, property) {
    return this.propertiesVM$.update(propertyId, property);
  }

  //--------------------------------------------**** LEASEHOLD ****--------------------------------------------

  getAllLeaseholds(): Observable<Leasehold[]> {
    return this.leaseholds$.map(Leasehold.fromJsonArray);
  }

  getAllLeaseholdsVM(): Observable<LeaseholdVM[]> {
    return this.leaseholdsVM;
  }

  getTotalLeaseholsPerOwner(ownerId: string) {
    return this.sdkDb.child(`/userProfile/${this.userId}/leaseholdsPerOwner/${ownerId}`).once('value');
  }

  getLeasehold(leaseholdId: string): Observable<Leasehold> {
    return this.af.database.object(`/userProfile/${this.userId}/leaseholds/${leaseholdId}`)
      .map(Leasehold.fromJson);
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

  addLeasehold(propertyId: string, leasehold: any): Observable<any> {
    const leaseholdsToSave = Object.assign({}, leasehold, { propertyId: propertyId });
    const newLeaseholdKey = this.sdkDb.child('leaseholds/').push().key;

    let dataToSave = {};
    dataToSave["/userProfile/" + this.userId + "/leaseholds/" + newLeaseholdKey] = leaseholdsToSave;
    dataToSave[`/userProfile/${this.userId}/leaseholdsPerProperty/${propertyId}/${newLeaseholdKey}`] = true;

    return this.firebaseUpdate(dataToSave);
  }

  updateLeasehold(leaseholdId: string, leasehold: any) {
    return this.leaseholds.update(leaseholdId, leasehold);
  }

  rentLeasehold(leaseholdId: string) {
    return this.leaseholds.update(leaseholdId, { isRented: true });
  }

  releaseLeasehold(leaseholdId: string) {
    return this.leaseholds.update(leaseholdId, { isRented: false });
  }

  getBrokersForLeasehold(leaseholdId: string) {
    const leasehold$ = this.getLeasehold(leaseholdId);

    const brokersPerLeasehold$ = leasehold$
      .switchMap(leasehold => this.af.database.list(`/userProfile/${this.userId}/brokersPerLeasehold/` + leasehold.$key))

    return brokersPerLeasehold$
      .map(bspl => bspl.map(bpl => this.af.database.object(`/userProfile/${this.userId}/brokers/` + bpl.$key)))
      .flatMap(fbojs => Observable.combineLatest(fbojs))
      .do(console.log);
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

  getPaymentsForLeasehold(leaseholdId: string) {
    const leasehold$=this.getLeasehold(leaseholdId);

    const paymentsPerLeasehold$=leasehold$
      .switchMap(leasehold => this.af.database.list(`/userProfile/${this.userId}/paymentsPerLeasehold/` + leasehold.$key))
    
    return paymentsPerLeasehold$
      .map(pspl=>pspl.map(ppl=>this.af.database.object(`/userProfile/${this.userId}/payments/` + ppl.$key)))
      .flatMap(fbojs=>Observable.combineLatest(fbojs))
      .do(console.log)
  }

  //--------------------------------------------**** BROKER ****--------------------------------------------

  getAllBrokers(): Observable<Broker[]> {
    return this.brokers$.map(Broker.fromJsonArray);
  }

  getAllBrokersVM(): Observable<BrokerVM[]> {
    return this.brokersVM;
  }

  getBroker(brokerId: string): Observable<Broker> {
    return this.af.database.object(`/userProfile/${this.userId}/brokers/${brokerId}`)
      .map(Broker.fromJson);
  }

  findBroker(brokerId: string): Observable<BrokerVM> {
    return this.af.database.list(`/userProfile/${this.userId}/brokers/`, {
      query: {
        orderByKey: true,
        equalTo: brokerId
      }
    })
      .map(results => results[0]);
  }

  addBroker(leaseholdId: string, broker: any): Observable<any> {
    const brokerToSave = Object.assign({}, broker);
    const newBrokerKey = this.sdkDb.child('brokers/').push().key;

    let dataToSave = {};
    dataToSave["/userProfile/" + this.userId + "/brokers/" + newBrokerKey] = brokerToSave;
    dataToSave[`/userProfile/${this.userId}/brokersPerLeasehold/${leaseholdId}/${newBrokerKey}`] = true;
    dataToSave[`/userProfile/${this.userId}/leaseholdsPerBroker/${newBrokerKey}/${leaseholdId}`] = true;

    return this.firebaseUpdate(dataToSave);
  }

  updateBroker(brokerId: string, broker: any) {
    return this.brokers.update(brokerId, broker);
  }

  getLeaseholdsForBroker(brokerId: string) {
    const broker$ = this.getBroker(brokerId);

    const leaseholdsPerBroker$ = broker$
      .switchMap(broker => this.af.database.list(`/userProfile/${this.userId}/leaseholdsPerBroker/` + broker.$key))

    return leaseholdsPerBroker$
      .map(lspb => lspb.map(lpb => this.af.database.object(`/userProfile/${this.userId}/leaseholds/` + lpb.$key)))
      .flatMap(fbojs => Observable.combineLatest(fbojs))
      .do(console.log);
  }

  addBrokerFromList(brokerId: string, leaseholdId: string) {
    let dataToSave = {};
    dataToSave[`/userProfile/${this.userId}/brokersPerLeasehold/${leaseholdId}/${brokerId}`] = true;
    dataToSave[`/userProfile/${this.userId}/leaseholdsPerBroker/${brokerId}/${leaseholdId}`] = true;

    return this.firebaseUpdate(dataToSave);
  }

  //--------------------------------------------**** OWNER ****--------------------------------------------

  getAllOwners(): Observable<Owner[]> {
    return this.owners$.map(Owner.fromJsonArray);
  }

  getAllOwnersVM(): Observable<OwnerVM[]> {
    return this.ownersVM;
  }

  getOwner(ownerId: string): Observable<Owner> {
    return this.af.database.object(`/userProfile/${this.userId}/owners/${ownerId}`)
      .map(Owner.fromJson);
  }

  findOwner(ownerId: string): Observable<OwnerVM> {
    return this.af.database.list(`/userProfile/${this.userId}/owners/`, {
      query: {
        orderByKey: true,
        equalTo: ownerId
      }
    })
      .map(results => results[0]);
  }

  addOwner(leaseholdId: string, owner: any): Observable<any> {
    const ownerToSave = Object.assign({}, owner);
    const newOwnerKey = this.sdkDb.child('owners/').push().key;

    let dataToSave = {};
    dataToSave["/userProfile/" + this.userId + "/owners/" + newOwnerKey] = ownerToSave;
    dataToSave[`/userProfile/${this.userId}/ownersPerLeasehold/${leaseholdId}/${newOwnerKey}`] = true;
    dataToSave[`/userProfile/${this.userId}/leaseholdsPerOwner/${newOwnerKey}/${leaseholdId}`] = true;

    return this.firebaseUpdate(dataToSave);
  }

  addOwnerFromList(ownerId: string, leaseholdId: string) {
    let dataToSave = {};
    dataToSave[`/userProfile/${this.userId}/ownersPerLeasehold/${leaseholdId}/${ownerId}`] = true;
    dataToSave[`/userProfile/${this.userId}/leaseholdsPerOwner/${ownerId}/${leaseholdId}`] = true;

    return this.firebaseUpdate(dataToSave);
  }

  updateOwner(ownerId: string, owner: any) {
    return this.owners.update(ownerId, owner);
  }

  getLeaseholdsForOwner(ownerId: string) {
    const owner$ = this.getOwner(ownerId);

    const leaseholdsPerOwner$ = owner$
      .switchMap(owner => this.af.database.list(`/userProfile/${this.userId}/leaseholdsPerOwner/` + owner.$key))

    return leaseholdsPerOwner$
      .map(lspo => lspo.map(lpo => this.af.database.object(`/userProfile/${this.userId}/leaseholds/` + lpo.$key)))
      .flatMap(fbojs => Observable.combineLatest(fbojs))
      .do(console.log);
  }

  //--------------------------------------------**** CONTRACT ****--------------------------------------------

  getAllContracts(): Observable<Contract[]> {
    return this.contracts$.map(Contract.fromJsonArray);
  }

  getAllContractsVM(): Observable<ContractVM[]> {
    return this.contractsVM;
  }

  getContract(contractId: string): Observable<Contract> {
    return this.af.database.object(`/userProfile/${this.userId}/contracts/${contractId}`)
      .map(Contract.fromJson);
  }

  findContract(contractId: string): Observable<ContractVM> {
    return this.af.database.list(`/userProfile/${this.userId}/contracts/`, {
      query: {
        orderByKey: true,
        equalTo: contractId
      }
    })
      .map(results => results[0]);
  }

  findContractForLeasehold(leaseholdId: string): Observable<Contract> {
    const contract = this.af.database.list(`/userProfile/${this.userId}/contracts/`, {
      query: {
        orderByChild: 'leaseholdId',
        equalTo: leaseholdId
      }
    })
      .map(results => results[0])
    return contract;
  }

  addContract(leaseholdId: string, contract: any): Observable<any> {
    const contractToSave = Object.assign({}, contract, { leaseholdId: leaseholdId });
    const newContractKey = this.sdkDb.child('contracts/').push().key;

    this.rentLeasehold(leaseholdId);

    let dataToSave = {};
    dataToSave["/userProfile/" + this.userId + "/contracts/" + newContractKey] = contractToSave;
    dataToSave[`/userProfile/${this.userId}/contractsPerLeasehold/${leaseholdId}/${newContractKey}`] = true;

    return this.firebaseUpdate(dataToSave);
  }

  updateContract(contractId: string, contract: any) {
    return this.contracts.update(contractId, contract);
  }

  endContract(contractId: string) {
    return this.leaseholds.update(contractId, { isActive: false });
  }

  getPaymentsForContract(contractId: string) {
    const contract$ = this.getContract(contractId);

    const paymentsPerConract$ = contract$
      .switchMap(contract => this.af.database.list(`/userProfile/${this.userId}/paymentsPerContract/` + contract.$key))

    return paymentsPerConract$
      .map(pspc => pspc.map(ppc => this.af.database.object(`/userProfile/${this.userId}/payments/` + ppc.$key)))
      .flatMap(fbojs => Observable.combineLatest(fbojs))
      .do(console.log);
  }

  //--------------------------------------------**** RENTER ****--------------------------------------------

  getAllRenters(): Observable<Renter[]> {
    return this.renters$.map(Renter.fromJsonArray);
  }

  getAllRentersVM(): Observable<RenterVM[]> {
    return this.rentersVM;
  }

  getRenter(renterId: string): Observable<Renter> {
    return this.af.database.object(`/userProfile/${this.userId}/renters/${renterId}`)
      .map(Renter.fromJson);
  }

  findRenter(renterId: string): Observable<Renter> {
    return this.af.database.list(`/userProfile/${this.userId}/renters/`, {
      query: {
        orderByKey: true,
        equalTo: renterId
      }
    })
      .map(results => results[0])
  }

  addRenter(leaseholdId: string, contractId: string, renter: any): Observable<any> {
    const renterToSave = Object.assign({}, renter);
    const newRenterKey = this.sdkDb.child('renters/').push().key;

    this.addRenterToContract(contractId, newRenterKey);
    //this.activateRenter(newRenterKey);

    let dataToSave = {};
    dataToSave["/userProfile/" + this.userId + "/renters/" + newRenterKey] = renterToSave;
    dataToSave[`/userProfile/${this.userId}/rentersPerLeasehold/${leaseholdId}/${newRenterKey}`] = true;
    dataToSave[`/userProfile/${this.userId}/leaseholdsPerRenter/${newRenterKey}/${leaseholdId}`] = true;

    return this.firebaseUpdate(dataToSave);
  }

  addRenterFromList(renterId: string, leaseholdId: string) {
    let dataToSave = {};
    dataToSave[`/userProfile/${this.userId}/rentersPerLeasehold/${leaseholdId}/${renterId}`] = true;
    dataToSave[`/userProfile/${this.userId}/leaseholdsPerRenter/${renterId}/${leaseholdId}`] = true;

    return this.firebaseUpdate(dataToSave);
  }

  updateRenter(renterId: string, renter: any) {
    return this.renters.update(renterId, renter);
  }

  activateRenter(renterId: string) {
    return this.renters.update(renterId, { isActive: true })
  }

  endRenter(renterId: string) {
    return this.leaseholds.update(renterId, { isActive: false });
  }

  addRenterToContract(contractId: string, renterId: string) {
    //this.activateRenter(renterId);
    return this.contracts.update(contractId, { renterId: renterId });
  }

  getLeaseholdsForRenter(renterId: string) {
    const renter$ = this.getRenter(renterId);

    const leaseholdsPerRenter$ = renter$
      .switchMap(renter => this.af.database.list(`/userProfile/${this.userId}/leaseholdsPerRenter/` + renter.$key))

    return leaseholdsPerRenter$
      .map(lspr => lspr.map(lpr => this.af.database.object(`/userProfile/${this.userId}/leaseholds/` + lpr.$key)))
      .flatMap(fbojs => Observable.combineLatest(fbojs))
      .do(console.log);
  }

  getPaymentsForRenter(renterId: string) {

  }
  //--------------------------------------------**** PAYMENT ****--------------------------------------------

  getAllPayments(): Observable<Payment[]> {
    return this.payments$.map(Payment.fromJsonArray);
  }

  getAllPaymentsVM(): Observable<PaymentVM[]> {
    return this.paymentsVM;
  }

  getPayment(paymentId: string): Observable<Payment> {
    return this.af.database.object(`/userProfile/${this.userId}/payments/${paymentId}`)
      .map(Payment.fromJson);
  }

  findPayment(paymentId: string): Observable<Payment> {
    return this.af.database.list(`/userProfile/${this.userId}/payments/`, {
      query: {
        orderByKey: true,
        equalTo: paymentId
      }
    })
      .map(results => results[0]);
  }

  addPayment(contractId: string, leaseholdId: string, renterId: string, payment: any): Observable<any> {
    const paymentToSave = Object.assign({}, payment, { contractId: contractId });
    const newPaymentKey = this.sdkDb.child('payments/').push().key;

    let dataToSave = {};
    dataToSave["/userProfile/" + this.userId + "/payments/" + newPaymentKey] = paymentToSave;
    dataToSave[`/userProfile/${this.userId}/paymentsPerContract/${contractId}/${newPaymentKey}`] = true;
    dataToSave[`/userProfile/${this.userId}/paymentsPerRenter/${renterId}/${newPaymentKey}`] = true;
    dataToSave[`/userProfile/${this.userId}/paymentsPerLeasehold/${leaseholdId}/${newPaymentKey}`] = true;

    return this.firebaseUpdate(dataToSave);
  }

  updatePayment(paymentId: string, payment: any) {
    return this.brokers.update(paymentId, payment);
  }

  payPayment(paymentId: string) {
    return this.payments.update(paymentId, { isPaid: true, paidDate: Date() });
  }
  //------------------------------------------------------------------------------------------------------

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
