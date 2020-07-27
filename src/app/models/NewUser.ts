export class NewUser {
    userId: string;
    cloneUserId: string;
    copySector: boolean;

    public constructor(init?: Partial<NewUser>) {
        Object.assign(this, init);
    }
}