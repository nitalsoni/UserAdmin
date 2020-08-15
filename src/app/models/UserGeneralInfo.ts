import { ScreenInfo } from './ScreenInfo';

export class UserGeneralInfo {
    userId: string;
    hostName: string;
    lastAccess: Date;
    screenList: ScreenInfo[];
    availableScreens: ScreenInfo[];

    constructor() {
        this.availableScreens = [];
        this.screenList = [];
    }
}