export class Leasehold {

    constructor(
        public $key: string,
        public title: string,
        public type: string,
        public code: string,
        public size: number,
        public rentAmount: number = 0,
        public isRented: boolean = false,
        public propertyId: string,
        public ownerId: string) {
    }

    static fromJson({$key, title, type, code, size, rentAmount, isRented, propertyId, ownerId}) {
        return new Leasehold($key, title, type, code, size, rentAmount, isRented, propertyId, ownerId);
    }

    static fromJsonArray(json: any[]): Leasehold[] {
        return json.map(Leasehold.fromJson);
    }

    get isOccupied() {
        return this.isRented = true;
    }
}