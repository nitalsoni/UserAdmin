export class SectorInfo {
    sector: string;
    subSector: string;
    account: string;
    userid: string;

    public constructor(init?: Partial<SectorInfo>) {
        Object.assign(this, init);
    }
}