export type StateParams = {
    currentUser: object | null;
    inactiveUsers: string[];
    activeUsers: string[];
};

export type UserUnreadMessages = {
    username: string;
    unreadMessages: number;
};
