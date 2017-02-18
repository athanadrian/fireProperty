export class Renter {

    constructor(
        public $key: string,
        public title: string,
        public type: string,
        public name: string,
        public phone: string,
        public email: string,
        public website: string,
        public isActive: boolean,
        public activeRent: number,
        public totalDeptAmount: number) {
    }

    static fromJson({$key, title, type, name, phone, email, activeRent, isActive, website, totalDeptAmount}) {
        return new Renter($key, title, type, name, phone, email, activeRent, isActive, website, totalDeptAmount);
    }

    static fromJsonArray(json: any[]): Renter[] {
        return json.map(Renter.fromJson);
    }

    calcDeptAmount(rentAmount: number) {
        this.totalDeptAmount += rentAmount;
    }
}