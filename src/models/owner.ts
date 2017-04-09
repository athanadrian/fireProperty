export class Owner {

    constructor(
        public $key: string,
        public title: string,
        public type: string,
        public afm:string,
        public phone:string,
        public quota: string,
        public image: string,
        public isActive:boolean) {
    }

    static fromJson({$key, title, type, afm, phone, quota, image, isActive}) {
        return new Owner($key, title, type, afm, phone, quota, image, isActive);
    }

    static fromJsonArray(json: any[]): Owner[] {
        return json.map(Owner.fromJson);
    }
}