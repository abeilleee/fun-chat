import type { User } from '../services/server-api/types/user';
import type { AllUsers } from '../services/state/reducers/users/types';
import { getAllUsers } from '../services/state/reducers/users/user-states-reducer';

function filterContacts(searchStr: string): AllUsers {
    const users = getAllUsers();
    users.active.filter((user: User) => user.login.toLowerCase().includes(searchStr.toLowerCase()));
    users.inactive.filter((user: User) => user.login.toLowerCase().includes(searchStr.toLowerCase()));
    return users;
}
