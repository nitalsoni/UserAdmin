export class Request {
    payload: any;
    header: RequestHeader = new RequestHeader();
}

export class RequestHeader {
    region: string;
    environment: string;
    userID: string;
    contenType: string
    constructor() {
        this.environment = 'DEV';
        this.region = 'EMEA'
        this.userID = 'nital.soni@gmail.com';
        this.contenType = 'application/json';
    }

    GetHeader() {
        let reqParams = {};
        Object.keys(this).map(k => {
            reqParams[k] = this[k];
        });

        //reqParams['headers'] = reqParams;
        return {'headers' : reqParams};
    }
}
