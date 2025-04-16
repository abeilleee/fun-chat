import { APP_ERROR, MESSAGE_ACTIONS, USER_ACTIONS } from '../constants';

export type UserRequest = {
    id: string;
    type: USER_ACTIONS | MESSAGE_ACTIONS | APP_ERROR;
    payload: {
        error?: string;
        user?: User;
        users?: User[];
    };
};

export type User = {
    login: string | null;
    password?: string | null;
    isLogined?: boolean;
};
