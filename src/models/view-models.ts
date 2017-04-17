import { Property, Owner } from './models'

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
        public owners:any,
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
        public totalLeaseholds:number,
        public totalContracts:number,
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
        public totalLeaseholds:number,
        public totalContracts:number,
        public leaseholds: any,
        public contracts: any) {
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
        public leaseholds: any,) {
    }
}