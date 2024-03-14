export interface MessageSSE {
    target: any,
    isTrusted: boolean,
    data: string,
    origin: string,
    lastEventId: string
}