import { allUsers } from '../state/reducers/users/user-states';

export const allUsersChange = new CustomEvent('onAllUsersChange');
export const selectedUserChanged = new CustomEvent('onselectedUserChanged');
