export class Contract {

    constructor(
        public $key: string,
        public leaseholdId: string,
        public renterId: string,
        public initialDuration: number,
        public realDuration: number,
        public contractAmount: number,
        public guarantee:number,
        public isActive: boolean,
        public startDate: string,
        public endDate: string) {
    }

    static fromJson({$key, leaseholdId, renterId, initialDuration, realDuration, contractAmount, guarantee, isActive, startDate, endDate}) {
        return new Contract($key, leaseholdId, renterId, initialDuration, realDuration, contractAmount, guarantee, isActive, startDate, endDate);
    }

    static fromJsonArray(json: any[]): Contract[] {
        return json.map(Contract.fromJson);
    }
}