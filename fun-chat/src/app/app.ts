import { AboutView } from './view/about/about';
import { LoginPageView } from './view/auth/login';
import { ChatView } from './view/chat/chat';
import { NotFoundView } from './view/not-found/not-found';

export class App {
    // private auth: LoginPageView | null;
    // private about: AboutView | null;
    private chatPage: ChatView | null;
    // private notFound: NotFoundView | null;

    constructor() {
        // this.auth = null;
        // this.about = null;
        this.chatPage = null;
        // this.notFound = null;
        this.createView();
    }

    private createView(): void {
        // this.auth = new LoginPageView();
        // this.about = new AboutView();
        this.chatPage = new ChatView();
        // this.notFound = new NotFoundView();
        document.body.append(this.chatPage.getHTMLElement());
    }
}
