import { User } from '../server-api/types/user-actions';

export class SessionStorage {
    protected STORAGE_NAME: string = 'abeilleee_fun-chat';

    constructor() {}

    public setData(data: User): void {
        sessionStorage.setItem(this.STORAGE_NAME, JSON.stringify(data));
    }

    public getData(): User | null {
        const data = sessionStorage.getItem(this.STORAGE_NAME);
        if (data) {
            return JSON.parse(data);
        }
        return null;
    }
}
