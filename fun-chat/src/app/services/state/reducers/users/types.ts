import type { User } from '../../../server-api/types/user';

export type AllUsers = {
    inactive: User[];
    active: User[];
    // selectedUser: SelectedUser;
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
