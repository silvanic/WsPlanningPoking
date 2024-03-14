import { cryptoRandomString } from "https://deno.land/x/crypto_random_string@1.0.0/cryptoRandomString.ts";
import { User, Vote, StatusRoom } from "./type.ts";

export class Room {

    id: string;
    name: string;
    status: StatusRoom;
    users: Array<User>;
    styleCard : Array<string>;
    url?: string;
    description?: string;
    lastUpdated:number;

    constructor(name: string, suit: Array<string>) {
        this.id = cryptoRandomString({length: 10}) ;
        this.name = name;
        this.status = StatusRoom.PREPARATION;
        this.users = [];
        this.styleCard = suit;
        this.url= '';
        this.description= '';
        this.lastUpdated=Date.now();
    }

    searchUserById(id : string){
        return this.users.findIndex(search => search.id === id);
    }

    getUser(id:string){
        const index = this.searchUserById(id);
        if(index==-1){
            return null;
        }
        return this.users[index];
    }

    addUser(user: User): User{        
        if(user.id){
            const indexUser = this.searchUserById(user.id);
            if(indexUser===-1){
                this.users.push(user);
            }else{
                this.users[indexUser].socket=user.socket;
            }
        }else{
            const idUser = cryptoRandomString({ length: 10 });
            user.id = idUser;
            this.users.push(user);
        }
        delete user.socket;
        this.updated();
        return user;
    }

    setUser(user: User): User|null{
        let userUpdated : User|null= null;
        if(user.id){
            const indexUser = this.searchUserById(user.id);
            if(indexUser!==-1){
                this.users[indexUser]=user;
                userUpdated=this.users[indexUser];
            }
        }
        return userUpdated;
    }

    removeUser(userId: string){
        const indexUser = this.users.findIndex(search=> userId === search.id);
        if(indexUser!=-1){
            this.users.splice(indexUser,1);
            this.updated();
        }
    }

    setVote(voteUser: Vote){
        if(this.status===StatusRoom.EN_COURS){
            const index = this.users.findIndex(user=>user.id===voteUser.userId);
            if(index!=-1){
                this.users[index].vote=voteUser.vote;
            }
            this.updated();
        }
    }

    resetRoom(){
        for (let i=0; i<this.users.length;i++) {
            this.users[i].vote='';
        }
        this.status = StatusRoom.PREPARATION
        this.updated();
    }

    updateStatus(){
        switch (this.status) {
            case StatusRoom.PREPARATION:
                this.status = StatusRoom.EN_COURS
                break;
            case StatusRoom.EN_COURS:
                this.status = StatusRoom.VOTE
                break;
            case StatusRoom.VOTE:
                this.resetRoom();
                break;
        }
        this.updated();
    }

    update(name: string,description?: string, url?: string){
        this.name=name;
        this.description = description??this.description
        this.url = url??this.url;
        this.updated();
    }

    lancerVote(){
        this.status = StatusRoom.EN_COURS;
    }

    finirVote(){
        this.status = StatusRoom.VOTE
    }

    sendJSON(){
        const obj: any =  {
            id: this.id,
            name: this.name,
            status: this.status,
            url: this.url,
            description: this.description,
            styleCard: this.styleCard,
            lastUpdated: this.lastUpdated,
            users: this.users.map(user=> ({
                id: user.id,
                name: user.name,
                vote: user.vote, 
                type: user.type
            }))
        };
        return obj;
    }

    updated(){
        this.lastUpdated=Date.now();
    }
    
}