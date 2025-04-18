import { USER_STATUS } from '../../../server-api/constants';
import { User } from '../../../server-api/types/user-actions';

export type AllUsers = {
    inactive: User[];
    active: User[];
    selectedUser: SelectedUser;
};

export type SelectedUser = {
    username: string;
    status: string;
};
