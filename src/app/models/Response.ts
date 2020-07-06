export class Response {
    data: any;
    statusCode: StatusCode;
    message: String;
    constructor(_data: any, _statusCode: StatusCode, _message: String){
        this.data = _data;
        this.statusCode = _statusCode;
        this.message = _message;
    }
}

export enum StatusCode {
    Ok,
    Error
  }