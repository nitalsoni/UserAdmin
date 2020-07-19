import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVars {
    readonly baseAppUrl: string = 'http://localhost:3000/';
    env: Environment = Environment.DEV;
    region: Region = Region.EMEA;
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