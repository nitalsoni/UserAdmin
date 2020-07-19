import { GlobalVars } from '../services/app.global'

export class Request {
    payload: any;
    header: RequestHeader = new RequestHeader();
}

export class RequestHeader {
    region: Number;
    environment: Number;
    userID: string;
    contenType: string
    constructor() {
        this.environment = GlobalVars.instance.env;
        this.region = GlobalVars.instance.region;
        this.userID = GlobalVars.instance.userId;
        this.contenType = 'application/json';
    }

    GetHeader() {
        let reqParams = {};
        Object.keys(this).map(k => {
            reqParams[k] = this[k];
        });

        console.log(reqParams);
        return { 'headers': reqParams };
    }
}
