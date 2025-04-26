import type { User } from '../../../client-api/types/user';

export type AllUsers = {
    inactive: User[];
    active: User[];
};

export type SelectedUser = {
    username: string;
    status: string;
};

export type PendingRequest = {
    username: string;
    requestId: string;
    unreadMessagesNumber?: number;
};
