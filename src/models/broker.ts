export class Broker {

    constructor(
        public $key: string,
        public title: string,
        public firstName: string,
        public lastName: string,
        public phoneCell: string,
        public phoneOffice: string,
        public email: string,
        public website: string,
        public image: string,
        public isActive: boolean,) {
    }

    static fromJson({$key, title, firstName, lastName,  phoneCell, phoneOffice, email, website, image, isActive}) {
        return new Broker($key, title, firstName, lastName, phoneCell, phoneOffice, email, website, image, isActive);
    }

    static fromJsonArray(json: any[]): Broker[] {
        return json.map(Broker.fromJson);
    }

    get fullName() {
        return this.firstName + ' ' + this.lastName;
    }
}