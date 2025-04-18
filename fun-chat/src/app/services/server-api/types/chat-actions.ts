//check, delete
// export type Message = {
//     id: string | null;
//     from: string | null;
//     to: string | null;
//     text: string;
//     datetime: number;
//     status: MessageStatus;
// };

import { Message } from './user-actions';

export type MessageStatus = {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
};

export type Dialog = {
    id: string | null;
    messages: Message[];
};
