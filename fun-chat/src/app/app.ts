import { HeaderView } from './view/header/header';

export class App {
    public header: HeaderView | null; //изменить идентификатор

    constructor() {
        this.header = null;
        this.createView();
    }

    private createView(): void {
        this.header = new HeaderView();
        document.body.append(this.header.getHTMLElement());
    }
}
