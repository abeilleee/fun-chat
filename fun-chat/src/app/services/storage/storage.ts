export class SessionStorage {
    protected STORAGE_NAME: string = 'abeilleee_fun-chat';

    constructor() {}

    public setData(data: string) {
        sessionStorage.setItem(this.STORAGE_NAME, JSON.stringify(data));
    }
}
