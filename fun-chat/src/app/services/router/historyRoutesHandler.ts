import type { RouterHandlerOptions, UserRequest } from './types.ts';

export class HistoryRoutesHandler {
    callback: (arg: UserRequest) => void;
    handler: (url: string | PopStateEvent | Event) => void;
    options: RouterHandlerOptions;

    constructor(callback: (arg: UserRequest) => void) {
        this.options = {
            locationKey: 'pathname',
            event: 'popstate',
        };
        this.handler = this.navigate.bind(this);
        this.callback = callback;
        window.addEventListener(this.options.event, this.handler);
    }

    public navigate(url: string | PopStateEvent | Event): void {
        if (typeof url === 'string') {
            this.pushHistory(url);
        }
        const urlPath = window.location.pathname.slice(1);
        const result: UserRequest = { path: '', resource: '' };
        const path = urlPath.split('/');
        [result.path = ''] = path;
        this.callback(result);
    }

    public pushHistory(url: string): void {
        window.history.pushState(null, '', `/${url}`);
    }
}
