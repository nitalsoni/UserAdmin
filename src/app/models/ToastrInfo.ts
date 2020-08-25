export class ToastrInfo {
    type: string;
    message: string;
    title: string;

    public constructor(type: string, message: string, title?: string) {
        this.type = type;
        this.message = message;
        this.title = title;
    }
}