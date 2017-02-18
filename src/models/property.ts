export class Property {

    constructor(
        public $key: string,
        public title: string,
        public type: string,
        public address: string,
        public lat?: number,
        public lng?: number,
        public icon?: string) {
    }

    static fromJson({$key, title, type, address, lat, lng, icon}) {
        return new Property($key, title, type, address, lat, lng, icon);
    }

    static fromJsonArray(json:any[]):Property[] {
        return json.map(Property.fromJson);
    }
}