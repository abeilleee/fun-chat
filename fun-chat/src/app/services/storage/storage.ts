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

export function getPassword(): string | undefined {
    const data = getStorageData();
    if (data && 'password' in data) {
        return String(data.password);
    }
}

export function isLogined(): boolean | undefined {
    const data = getStorageData();
    if (data && 'isLogined' in data && typeof data.isLogined === 'boolean') {
        return data.isLogined;
    }
}

export function toggleIsLogined(): void {
    const data = getStorageData();
    if (data && 'login' in data && 'password' in data) {
        const login = data.login;
        const password = data.password;

        if (data && 'isLogined' in data && typeof login === 'string' && typeof password === 'string') {
            const isLogined = !data.isLogined;

            const user: User = {
                login: login,
                password: password,
                isLogined: isLogined,
            };
            setData(user);
        }
    }
}
