import type { RouterHandlerOptions, UserRequest } from './types.js';

export class HistoryRoutesHandler {
    private callback: (arg: UserRequest) => void;
    private handler: (url: string | PopStateEvent | Event) => void;
    private options: RouterHandlerOptions;

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
        const result: UserRequest = { path: '', resource: '' };

        if (typeof url === 'string') {
            this.pushHistory(url);
            result.path = url;
        } else {
            const urlPath = window.location.pathname.slice(1);
            const path = urlPath.split('/')[0];
            result.path ||= path;
        }

        this.callback(result);
    }

    public pushHistory(url: string): void {
        window.history.pushState(null, '', `/${url}`);
    }
}
