export function handleUserSelect(targetElement: HTMLElement, list: HTMLElement): void {
    const elements = list.children;
    Array.from(elements).forEach((child) => {
        child.classList.remove('user-selected');
    });
    const userBox = targetElement.classList.contains('user-box') ? targetElement : targetElement.closest('.user-box');

    if (userBox) {
        userBox.classList.toggle('user-selected');
    }
}
