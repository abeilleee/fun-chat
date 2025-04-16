export function generateId(): string {
    return self.crypto.randomUUID();
}
