export class Leasehold {

    constructor(
        public $key: string,
        public title: string,
        public extraSpace:string,
        public type: string,
        public code: string,
        public size: number,
        public extraSize:number,
        public rentAmount: number = 0,
        public isRented: boolean = false,
        public propertyId: string,
        public ownerId: string) {
    }

    static fromJson({$key, title, extraSpace, type, code, size, extraSize, rentAmount, isRented, propertyId, ownerId}) {
        return new Leasehold($key, title, extraSpace, type, code, size, extraSize, rentAmount, isRented, propertyId, ownerId);
    }

    static fromJsonArray(json: any[]): Leasehold[] {
        return json.map(Leasehold.fromJson);
    }

    get isOccupied() {
        return this.isRented = true;
    }
}