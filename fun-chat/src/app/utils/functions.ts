export function formatTime(date: number): string {
    const dateObject: Date = new Date(date);
    const result = new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'short',
        timeStyle: 'short',
    })
        .format(dateObject)
        .replace('/', '.')
        .replace('/', '.');
    return result;
}
