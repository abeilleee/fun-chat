import type { User } from './user';
import type { APP_ERROR, MESSAGE_ACTIONS, USER_STATUS } from '../constants';

export type ServerMessage = {
    id: string;
    type: MESSAGE_ACTIONS | USER_STATUS | APP_ERROR;
    payload: {
        error?: string;
        user?: User;
        users?: User[];
    } | null;
};
