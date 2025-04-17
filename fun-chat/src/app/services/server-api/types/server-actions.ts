import { User } from './user-actions';
import { APP_ERROR, MESSAGE_ACTIONS, USER_MESSAGE_TYPE } from '../constants';

export type ServerResponse = {
    id: string;
    type: MESSAGE_ACTIONS | USER_MESSAGE_TYPE | APP_ERROR;
    payload: {
        error?: string;
        user?: User;
        users?: User[];
    } | null;
};
