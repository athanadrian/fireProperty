export class Renter {

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
        public totalDeptAmount: number) {
    }

    static fromJson({$key, 
        title,
        type,
        name,
        phoneCell, phoneOffice, email, activeRent, isActive, website, image, totalDeptAmount}) {
        return new Renter($key,
        title,
        type,
        name,
        phoneCell, phoneOffice, email, activeRent, isActive, website, image, totalDeptAmount);
    }

    static fromJsonArray(json: any[]): Renter[] {
        return json.map(Renter.fromJson);
    }

    calcDeptAmount(rentAmount: number) {
        this.totalDeptAmount += rentAmount;
    }
}