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
        public property:Property,
        public owner:Owner,
        public contracts:any,
        public renters:any,
        public ownerId: string) {
    }
}