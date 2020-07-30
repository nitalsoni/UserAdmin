import { HttpRequest, HttpHeaders } from "@angular/common/http";
import { GlobalVars as G } from "../services/app.global";

export class HttpHelper {
    public static GetRequestHeader(request: HttpRequest<any>): any {
        const customHeader = new HttpHeaders({
            'region': G.instance.region.toString(),
            'environment': G.instance.env.toString(),
            'userId': G.instance.userId,
            'contenType': 'application/json'
        });
        return request.clone({ headers: customHeader });
    }
}