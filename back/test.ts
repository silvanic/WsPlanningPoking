import { assertEquals } from "https://deno.land/std@0.110.0/testing/asserts.ts";
import {Room} from './models/Room.ts';
import { User, StatusRoom, Vote } from './models/type.ts';
import { RoomService } from './services/room.service.ts';

Deno.test('Test Room', async (t)=>{
    const roomService = new RoomService();
    const roomTest = new Room("test",['1','2','3','4','5','6']);
    roomService.set(roomTest);

    const user : User = {
      id: '1',
      target: undefined,
      name: 'test',
      vote: ''
    };    

    const vote : Vote = { 
        userId: user.id??'', 
        vote: '1'
    };

    await t.step('Initialisation', () => {
        const room = roomService.get(roomTest.id);
        assertEquals(room?.users.length, 0);
        assertEquals(room?.status, StatusRoom.PREPARATION);
    })    
    
    await t.step('Ajouter utilisateur', () => {
        roomService.addUser(roomTest.id, user);
        const room = roomService.get(roomTest.id);

        assertEquals(room?.users.length, 1);
        assertEquals(room?.users[0].vote, '');        
    });

    await t.step('Verification avant lancement vote', () => {
        roomService.setVote(roomTest.id, vote);
        assertEquals(roomService.get(roomTest.id)?.users[0].vote, '');
    });
    
    await t.step('Verification apres lancement vote', () => {
        roomService.updateStatus(roomTest.id);
        roomService.setVote(roomTest.id, vote);
        assertEquals(roomService.get(roomTest.id)?.status, StatusRoom.EN_COURS)
        assertEquals(roomService.get(roomTest.id)?.users[0].vote, '1');
    })
    
    await t.step('Finalisation vote', () => {
        roomService.updateStatus(roomTest.id);
        roomService.setVote(roomTest.id, {userId: vote.userId, vote : '2'});
        assertEquals(roomService.get(roomTest.id)?.status, StatusRoom.VOTE)
        assertEquals(roomService.get(roomTest.id)?.users[0].vote, '1');
    })

    await t.step('Finalisation vote', () => {
        roomService.updateStatus(roomTest.id);
        assertEquals(roomService.get(roomTest.id)?.status, StatusRoom.PREPARATION)
        assertEquals(roomService.get(roomTest.id)?.users[0].vote, '');
    })
})