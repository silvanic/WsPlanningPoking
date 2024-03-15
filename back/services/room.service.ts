import { Room } from "../models/Room.ts";
import { User, Vote } from "../../interfaces.ts";

export class RoomService{

    rooms: Map<string, Room>
    
    constructor(){
        this.rooms= new Map();
    }

    set(room: Room){
        this.rooms.set(room.id, room);
    }

    get(id: string){
        return this.rooms.get(id);
    }

    creer(name: string, suit: string){
        const room = new Room(name, suit.split(';'));
        this.set(room);
        return room;
    }

    updateInfo(roomId: string, name: string, description: string, url: string){
        const room = this.get(roomId);
        if(room){
            room.update(name, description, url);
            this.set(room);
        }
    }

    updateStatus(roomId: string){
        const room = this.get(roomId);
        if(room){
            room.updateStatus();
            this.set(room);
        }
    }

    lancerVote(roomId: string){
        const room = this.get(roomId);
        if(room){
            room.lancerVote();
            this.set(room);
        }
    }

    addUser(roomId: string, user: User){
        const room = this.get(roomId);
        let result: any = null;
        if(room){
            result = room.addUser(user);
            this.set(room);
        }
        return result;
    }

    getUser(roomId: string, userId: string){
        const room = this.get(roomId);
        let result: any = null;
        if(room){
            result = room.getUser(userId);
        }
        return result;
    }

    setUser(roomId: string, user: User){
        const room = this.get(roomId);
        let result: any = null;
        if(room){
            result = room.setUser(user);
        }
        return result;
    }
    
    setVote(roomId: string, vote: Vote){
        const room = this.get(roomId);
        if(room){
            room.setVote(vote);
            this.set(room);
        }
    }

    removeRoom(roomId: string){
        this.rooms.delete(roomId);
    }

    removeUser(roomId: string, userId: string){
        const room = this.get(roomId);
        if(room){
            room.removeUser(userId);
            this.set(room);
        }
    }
}