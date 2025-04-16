export type Message = {
    id: string | null;
    from: string | null;
    to: string | null;
    text: string;
    datetime: number;
    status: MessageStatus;
};

export type MessageStatus = {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
};
