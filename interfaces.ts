export interface User extends SimpleUser{
    socket?: WebSocket,
}

export interface SimpleUser{
    id: string | null,
    name: string,
    vote: string,
    type: TypeUser,
}

export enum TypeUser {
    USER='User',
    SPEC='Spectator'
}

export interface Rooms {
    room: Array<IRoom>;
}

export interface Vote {
    userId: string;
    vote: string;
}

export interface IRoom {
    id: string,
    name: string,
    status: StatusRoom,
    url: string,
    description: string,
    styleCard: Array<string>,
    lastUpdated: number,
    users: Array<SimpleUser>
}

export enum StatusRoom {
    PREPARATION, 
    EN_COURS, 
    VOTE
}

export interface LoginResponse{
    room: IRoom,
    user: SimpleUser
}