import type { User } from '../server-api/types/user-actions';

export const STORAGE_NAME: string = 'abeilleee_fun-chat';

export function setData(data: User): void {
    sessionStorage.setItem(STORAGE_NAME, JSON.stringify(data));
}

export function getStorageData(): object | null {
    const data = sessionStorage.getItem(STORAGE_NAME);
    if (data) {
        return JSON.parse(data);
    }
    return null;
}

export function getCurrentUsername(): string | undefined {
    const data = getStorageData();
    if (data && 'login' in data) {
        return String(data.login);
    }
}
