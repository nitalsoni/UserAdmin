export class UserConfig {

    userId: string;
    controlName: string;
    item: string;
    dataValue: string;
    updatedBy: string;
    hostName: string;

    public constructor(init?: Partial<UserConfig>) {
        Object.assign(this, init);
    }
    // constructor(_userId?: string, _controlName?: string, _item?: string, _dataValue?: string) {
    //     this.userId = _userId;
    //     this.controlName = _controlName;
    //     this.item = _item;
    //     this.dataValue = _dataValue;
    // }
}