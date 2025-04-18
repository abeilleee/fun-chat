import { User } from '../../../server-api/types/user-actions';

export type AllUsers = {
    inactive: User[];
    active: User[];
};
