export type StateParams = {
    currentUser: object | null;
    inactiveUsers: string[];
    activeUsers: string[];
};

export type UserUnreadMessages = {
    username: string;
    unreadMessages: number;
};

export enum ERRORS {
    NOT_RECIPIENT = 'user not recipient cannot be executed',
    DOUBLE_LOGIN = 'a user with this login is already authorized',
    DOUBLE_USER = 'another user is already authorized in this connection',
    INCORRECT_PASSWORD = 'incorrect password',
}
