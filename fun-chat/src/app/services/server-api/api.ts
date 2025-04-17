import { WebSocketConnection } from '../web-socket-connection/web-socket-connection';
import { SessionStorage } from '../storage/storage';
import { USER_MESSAGE_TYPE } from './constants';

export class ClientApi {
    private webSocket: WebSocketConnection;
    private storage: SessionStorage;

    constructor(webSocket: WebSocketConnection) {
        this.webSocket = webSocket;
        this.storage = new SessionStorage();
    }

    public userLogin(type: USER_MESSAGE_TYPE.LOGIN) {
        const currentUser = this.storage.getData();
    }

    // userAuth = () => {
    //     const { currentUser } = state.getState();
    //     sendMessageToServer('USER_LOGIN', { user: currentUser });
    // };
}
