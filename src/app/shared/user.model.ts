export class User {
    constructor(public email: string, public id: string, private _token: string, private _tokenED: Date) {}

    get token() {
        if (!this._tokenED || new Date() > this._tokenED) {
            return null;
        }
        return this._token;
    }
}

export interface AuthResponseData {
    message: string;
    userId: string;
    access_token: string;
    email: string;
    expiresIn: string;
}