import { Property, Owner, Contract, Renter, Leasehold } from './models'
import { Observable, Subject } from 'rxjs/Rx';

export class PropertyVM {
    constructor(
        public $key: string,
        public title: string,
        public type: string,
        public address: string,
        public leaseholds: any,
        public totalLeaseholds: number,
        public lat?: number,
        public lng?: number,
        public icon?: string) {
    }

}

export class LeaseholdVM {
    constructor(
        public $key: string,
        public title: string,
        public type: string,
        public code: string,
        public size: number,
        public rentAmount: number = 0,
        public isRented: boolean = false,
        public propertyId: string,
        public property: Property,
        public contracts: any,
        public renters: any,
        public owners: any,
        public brokers: any,
        public payments: any,
        public ownerId: string) {
    }
}

export class OwnerVM {
    constructor(
        public $key: string,
        public title: string,
        public type: string,
        public afm: string,
        public phone: string,
        public quota: string,
        public image: string,
        public isActive: boolean,
        public totalLeaseholds: number,
        public totalContracts: number,
        public leaseholds: any,
        public contracts: any) {
    }
}

export class RenterVM {

    constructor(
        public $key: string,
        public title: string,
        public type: string,
        public name: string,
        public phoneCell: string,
        public phoneOffice: string,
        public email: string,
        public website: string,
        public image: string,
        public isActive: boolean,
        public activeRent: number,
        public totalDeptAmount: number,
        public totalLeaseholds: number,
        public totalContracts: number,
        public leaseholds: any,
        public contracts: any,
        public payments:any) {
    }
}

export class BrokerVM {

    constructor(
        public $key: string,
        public firstName: string,
        public lastName: string,
        public title: string,
        public mobile: string,
        public phone: string,
        public email: string,
        public image: string,
        public isActive: boolean,
        public totalBrokers: number,
        public leaseholds: any, ) {
    }

    get fullName() {
        return this.firstName + ' ' + this.lastName;
    }
}

export class PaymentVM {
    constructor(
        public $key: string,
        public contractId: string,
        public title: string,
        public type: string,
        public deptDate: string,
        public dueDate: string = null,
        public paidDate: string = null,
        public isPaid: boolean = false,
        public paidAmount: number = 0,
        public totalAmount: number = 0,
        public contract: Contract,
        public leasehold: Leasehold,
        public renter: Renter,
        public property: Property) {
    }
}

export class ContractVM {
    constructor(
        public $key: string,
        public leaseholdId: string,
        public renterId: string,
        public initialDuration: number,
        public realDuration: number,
        public contractAmount: number,
        public guarantee: number,
        public isActive: boolean,
        public startDate: string,
        public endDate: string,
        public leasehold: Leasehold,
        public renter: Renter,
        public payments: any,
        public totalPayments:number) {
    }

    static fromJson({$key, leaseholdId, renterId, initialDuration, realDuration, contractAmount, quaranty, isActive, startDate, endDate}) {
        return new Contract($key, leaseholdId, renterId, initialDuration, realDuration, contractAmount, quaranty, isActive, startDate, endDate);
    }

    static fromJsonArray(json: any[]): Contract[] {
        return json.map(Contract.fromJson);
    }
}