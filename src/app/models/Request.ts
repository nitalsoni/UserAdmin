export class Request {
    payload: any;
    header: RequestHeader = new RequestHeader();
}

export class RequestHeader {
    region: string;
    environment: string;
    userID: string;
    constructor() {
        this.environment = 'DEV';
        this.region = 'EMEA'
        this.userID = 'nital.soni@gmail.com';
    }

    GetHeader() {
        // let header = {};
        // header[this.region] = this.region;
        // header['environment'] = this.environment;
        // header['userID'] = this.userID;
        // return { 'headers' : header };

        let reqParams = {};
        Object.keys(this).map(k => {
            reqParams[k] = this[k];
        });

        reqParams['headers'] = reqParams;
        return reqParams;
    }
}