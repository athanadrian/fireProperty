export class Payment {

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
        public totalAmount: number = 0) {
    }

    static fromJson({$key, contractId, title, type, deptDate, dueDate, paidDate, isPaid, paidAmount, totalAmount}) {
        return new Payment($key, contractId, title, type, deptDate, dueDate, paidDate, isPaid, paidAmount, totalAmount);
    }

    static fromJsonArray(json: any[]): Payment[] {
        return json.map(Payment.fromJson);
    }
}