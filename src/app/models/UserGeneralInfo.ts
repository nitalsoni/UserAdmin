export class UserGeneralInfo {
    userId: string;
    hostName: string;
    lastAccess: Date;
    screenList: string[];
    availableScreens: string[];

    constructor() {
        this.availableScreens = [];
        this.screenList = [];
    }
}