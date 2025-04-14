import { AboutView } from './view/about/about';
import { LoginPageView } from './view/auth/login';
import { FooterView } from './view/footer/footer';
import { HeaderView } from './view/header/header';

export class App {
    public header: HeaderView | null; //изменить идентификатор
    // private auth: LoginPageView | null;
    private about: AboutView | null;
    private footer: FooterView | null;

    constructor() {
        this.header = null;
        // this.auth = null;
        this.about = null;
        this.footer = null;
        this.createView();
    }

    private createView(): void {
        this.header = new HeaderView();
        // this.auth = new LoginPageView();
        this.about = new AboutView();
        this.footer = new FooterView();
        document.body.append(this.header.getHTMLElement(), this.about.getHTMLElement(), this.footer.getHTMLElement());
    }
}
