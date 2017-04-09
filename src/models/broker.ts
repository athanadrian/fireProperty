export class Broker {

    constructor(
        public $key: string,
        public firstName: string,
        public lastName: string,
        public title: string,
        public mobile: string,
        public phone: string,
        public email: string,
        public image: string,
        public isActive: boolean) {
    }

    static fromJson({$key, firstName, lastName, title, mobile, phone, email, image, isActive}) {
        return new Broker($key, firstName, lastName, title, mobile, phone, email, image, isActive);
    }

    static fromJsonArray(json: any[]): Broker[] {
        return json.map(Broker.fromJson);
    }
}