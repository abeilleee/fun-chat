export type Route = {
    path: string;
    callback: (request: string) => void;
};

export type RouterHandlerOptions = {
    locationKey: string;
    event: string;
};

export type UserRequest = {
    path: string;
    resource: string;
};

export enum PAGES {
    AUTH = 'auth',
    MAIN = 'main',
    LOGIN = 'login',
    ABOUT = 'about',
    NOT_FOUND = 'not-found',
}
