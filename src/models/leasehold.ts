export class Leasehold {

    constructor(
        public $key: string,
        public title: string,
        public extraSpace:string,
        public type: string,
        public code: string,
        public size: number,
        public offices: number,
        public bathrooms: number,
        public extraSize:number,
        public rentAmount: number = 0,
        public isRented: boolean = false,
        public propertyId: string) {
    }

    static fromJson({$key, title, extraSpace, type, code, size, offices, bathrooms, extraSize, rentAmount, isRented, propertyId }) {
        return new Leasehold($key, title, extraSpace, type, code, size, offices, bathrooms, extraSize, rentAmount, isRented, propertyId );
    }

    static fromJsonArray(json: any[]): Leasehold[] {
        return json.map(Leasehold.fromJson);
    }

    get isOccupied() {
        return this.isRented = true;
    }
}