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
    payload: {
        error?: string;
        user?: User;
        users?: User[];
        message?: Message;
        messages?: Message[];
    } | null;
};

export type User = {
    login: string | null;
    password?: string | null;
    isLogined?: boolean;
};
