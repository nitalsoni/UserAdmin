export class SectorInfo {
    sector: string;
    subSector: string;
    account: string;

    public constructor(init?: Partial<SectorInfo>) {
        Object.assign(this, init);
    }
}