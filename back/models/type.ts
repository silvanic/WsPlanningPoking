
export interface User {
    id: string | null,
    name: string,
    vote: string,
    type?: string,
    socket?: WebSocket,
}

export interface Rooms {
    room: Array<IRoom>;
}

export interface Vote {
    userId: string;
    vote: string;
}

export interface IRoom {
    id: number,
    status: 'PREPARATION' | 'EN_COURS' | 'VOTE',
    clients: Array<User>,
    url?: string,
    description?: string
}

export enum StatusRoom {
    'PREPARATION', 'EN_COURS', 'VOTE'
}