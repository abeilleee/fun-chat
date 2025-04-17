import type { User } from '../server-api/types/user-actions';

export class SessionStorage {
    protected STORAGE_NAME: string = 'abeilleee_fun-chat';

    constructor() {}

    public setData(data: User): void {
        sessionStorage.setItem(this.STORAGE_NAME, JSON.stringify(data));
    }

    public getData(): string | null {
        const data = sessionStorage.getItem(this.STORAGE_NAME);
        if (data && typeof JSON.parse(data) === 'string') {
            return JSON.parse(data);
        }
        return null;
    }
}
