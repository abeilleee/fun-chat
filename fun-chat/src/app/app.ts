import { AboutView } from './view/about/about';
import { LoginPageView } from './view/auth/login';
import { FooterView } from './view/footer/footer';
import { HeaderView } from './view/header/header';
import { NotFoundView } from './view/not-found/not-found';

export class App {
    public header: HeaderView | null; //изменить идентификатор
    // private auth: LoginPageView | null;
    // private about: AboutView | null;
    private notFound: NotFoundView | null;
    private footer: FooterView | null;

    constructor() {
        this.header = null;
        // this.auth = null;
        // this.about = null;
        this.notFound = null;
        this.footer = null;
        this.createView();
    }

    private createView(): void {
        this.header = new HeaderView();
        // this.auth = new LoginPageView();
        // this.about = new AboutView();
        this.notFound = new NotFoundView();
        this.footer = new FooterView();
        document.body.append(
            this.header.getHTMLElement(),
            this.notFound.getHTMLElement(),
            this.footer.getHTMLElement()
        );
    }
}
