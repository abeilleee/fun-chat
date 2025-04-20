import { APP_ERROR, MESSAGE_ACTIONS, USER_STATUS } from '../constants';
import { Message } from './chat';

export type UserRequest = {
    id: string;
    type: USER_STATUS | MESSAGE_ACTIONS | APP_ERROR;
    payload: Payload | null;
};

export type User = {
    login: string | null;
    password?: string | null;
    isLogined?: boolean;
    id?: string;
};

export type Payload = {
    user?: User;
    users?: User[];
    message?: Message;
    messages?: Message[];
    error?: string;
} | null;
