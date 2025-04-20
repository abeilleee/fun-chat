export type Message = {
    id?: string;
    from?: string;
    to?: string;
    text?: string;
    datetime?: number;
    status?: MessageStatus;
};

export type MessageStatus = {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
};

export type Dialog = {
    login: string;
    messages: Message[];
};
