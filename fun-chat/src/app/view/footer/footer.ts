import { ElementCreator } from '../../utils/element-creator';
import type { Options } from '../../utils/types';
import { ContainerView } from '../container/container';
import { View } from '../view';

export class FooterView extends View {
    constructor() {
        const options: Options = {
            tagName: 'footer',
            classes: ['footer'],
        };

        super(options);
        this.configure();
    }

    private configure(): void {
        const container = new ContainerView(['container'], this.getHTMLElement());
        const footerWrapper = new ElementCreator({
            tagName: 'div',
            classes: ['footer-wrapper'],
            parent: container.getHTMLElement(),
        });
        const logoBox = this.setLogo(footerWrapper.getElement());
        const year = this.setYear(footerWrapper.getElement());
        const author = this.setAuthor(footerWrapper.getElement());
    }

    private setLogo(parent: HTMLElement): HTMLElement {
        const logoBox = new ElementCreator({
            tagName: 'div',
            classes: ['logo-box'],
            parent: parent,
        });
        const link = new ElementCreator<HTMLAnchorElement>({
            tagName: 'a',
            classes: ['logo-link'],
            parent: logoBox.getElement(),
        }).getElement();
        if (link instanceof HTMLAnchorElement) {
            link.href = 'https://rs.school/';
            link.target = '_blank';
        }
        const imgBox = new ElementCreator({
            tagName: 'div',
            classes: ['img-box'],
            parent: link,
        });

        const logoImg = new ElementCreator<HTMLImageElement>({
            tagName: 'img',
            classes: ['logo-title'],
            parent: imgBox.getElement(),
        }).getElement();
        if (logoImg instanceof HTMLImageElement) {
            logoImg.src = 'assets/images/logo.svg';
        }

        const title = new ElementCreator({
            tagName: 'h3',
            classes: ['logo-title'],
            parent: logoBox.getElement(),
            textContent: 'RSSchool',
        });

        return logoBox.getElement();
    }

    private setYear(parent: HTMLElement): HTMLElement {
        const year = new ElementCreator({
            tagName: 'p',
            classes: ['year'],
            parent: parent,
            textContent: '2025',
        });
        return year.getElement();
    }

    private setAuthor(parent: HTMLElement): HTMLElement {
        const authorBox = new ElementCreator({
            tagName: 'div',
            classes: ['author-box'],
            parent: parent,
        });
        const link = new ElementCreator<HTMLAnchorElement>({
            tagName: 'a',
            classes: ['logo-link'],
            parent: authorBox.getElement(),
        }).getElement();
        if (link instanceof HTMLAnchorElement) {
            link.href = 'https://github.com/abeilleee';
            link.target = '_blank';
        }
        const imgBox = new ElementCreator({
            tagName: 'div',
            classes: ['img-box'],
            parent: link,
        });

        const logoImg = new ElementCreator<HTMLImageElement>({
            tagName: 'img',
            classes: ['logo-title'],
            parent: imgBox.getElement(),
        }).getElement();
        if (logoImg instanceof HTMLImageElement) {
            logoImg.src = 'assets/images/github.svg';
        }

        const title = new ElementCreator({
            tagName: 'h3',
            classes: ['logo-title'],
            parent: authorBox.getElement(),
            textContent: 'MayyaRagimova',
        });

        return authorBox.getElement();
    }
}
