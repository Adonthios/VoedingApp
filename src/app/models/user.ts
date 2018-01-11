export class User {
    uid: string;
    displayName: string;
    email: string;

    constructor(data: any) {
        if (data) {
            this.uid = data.uid;
            this.displayName = data.displayName;
            this.email = data.email;
        }
    }
}
