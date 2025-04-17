import { APP_ERROR, MESSAGE_ACTIONS, USER_MESSAGE_TYPE } from '../constants';

export type Message = {
    id: string;
    from: string;
    to: string;
    text: string;
    datetime: number;
    status: MessageStatus;
};

export type MessageStatus = {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
};

export type UserRequest = {
    id: string;
    type: USER_MESSAGE_TYPE | MESSAGE_ACTIONS | APP_ERROR;
    payload: Payload | null;
};

export type User = {
    login: string | null;
    password?: string | null;
    isLogined?: boolean;
};

export type Payload = {
    user?: User;
    users?: User[];
    message?: Message;
    messages?: Message[];
    error?: string;
} | null;
