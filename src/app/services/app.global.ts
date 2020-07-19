import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVars {
    static instance: GlobalVars;
    readonly baseAppUrl: string = 'http://localhost:3000/';

    env: Environment = Environment.DEV;
    region: Region = Region.EMEA;
    userId: string = 'nsoni5';
}

export enum Environment {
    DEV,
    PROD
}

export enum Region {
    APAC,
    EMEA,
    AMER
}