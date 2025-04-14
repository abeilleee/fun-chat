import { FooterView } from './view/footer/footer';
import { HeaderView } from './view/header/header';

export class App {
    public header: HeaderView | null; //изменить идентификатор
    private footer: FooterView | null;

    constructor() {
        this.header = null;
        this.footer = null;
        this.createView();
    }

    private createView(): void {
        this.header = new HeaderView();
        this.footer = new FooterView();
        document.body.append(this.header.getHTMLElement(), this.footer.getHTMLElement());
    }
}
