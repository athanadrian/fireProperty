export class Owner {

    constructor(
        public $key: string,
        public title: string,
        public afm:string,
        public phone:string,
        public quota: string,
        public isActive:boolean) {
    }

    static fromJson({$key, title, afm, phone, quota, isActive}) {
        return new Owner($key, title, afm, phone, quota, isActive);
    }

    static fromJsonArray(json: any[]): Owner[] {
        return json.map(Owner.fromJson);
    }
}