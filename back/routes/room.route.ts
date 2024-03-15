;
import { User } from "../models/type.ts";
import eventEmitter from "../events/room.events.ts";
import { RoomService } from "../services/room.service.ts"
import { Router } from "https://jsr.io/@oak/oak/14.2.0/router.ts";
import { ServerSentEvent } from "https://deno.land/x/oak@v13.2.5/deps.ts";

const router = new Router();
export const roomService = new RoomService();

router.post("/login", async (ctx) => {
  const data = await ctx.request.body.json();
  let room;
  if (data.roomId) {
    room = roomService.get(data.roomId);
  }
  if (!room) {
    room = roomService.creer(data.roomName, data.suit);
  }
  const user = roomService.addUser(room.id, {
    id: null,
    vote: "",
    name: data.username
  });  
  ctx.response.status = 200;
  ctx.response.body = {
    userId: user?.id,
    room: room.sendJSON(),
  };
})
.get("/events/:roomId/:userId", async (ctx) => {
  const sse = await ctx.sendEvents();
  
  console.log('Connect SSE : ',ctx.params.userId);

  const id = setInterval(()=>{
    const room = roomService.get(ctx.params.roomId);
    if(room){
      const evt = new ServerSentEvent('message',{
        data: JSON.stringify(room.sendJSON())
      });
      sse.dispatchEvent(evt);
    }
  },2000)

  sse.addEventListener("close", () => {
    console.log("SSE disconnect");
    clearInterval(id);
    eventEmitter.emit("disconnect", ctx.params.roomId, user);
  });

  const user: User = {
    id: ctx.params.userId,
    vote: "",
    name: "",
    target: sse,
  };
  


  eventEmitter.emit("connect", ctx.params.roomId, user);
})
.put("/room/:roomId", async (ctx) => {
  const room = roomService.get(ctx.params.roomId);
  if (room) {
    try {
      const json = await ctx.request.body.json();      
      roomService.updateInfo(room.id, json.description, json.url);
    } catch (_e) {      
      roomService.updateStatus(room.id);
    }
    eventEmitter.emit("send", room, "updateRoom");
    ctx.response.status = 200;
  } else {
    ctx.response.status = 401;
  }
})
.get("/room/:id", (ctx) => {
  const room = roomService.get(ctx.params.id);
  if (room) {
    ctx.response.status = 200;
    ctx.response.body = {
      room: {
        id: ctx.params.id,
        name: room.name,
      },
    };
  } else {
    ctx.response.status = 404;
    ctx.response.body = {
      room : {}
    };
  }
})
.get('/rooms', (ctx) => {
  ctx.response.status=200;
  let result = [];
  for (const iterator of roomService.rooms.entries()) {
    result.push(iterator[1].sendJSON());
  }
  ctx.response.body = result;
})
.put("/room/:roomId/voter", async (ctx) => {
  const data = await ctx.request.body.json();
  if (data.userId && data.vote) {
    const room = roomService.get(ctx.params.roomId);
    if (room) {
      roomService.setVote(room.id, {
        userId: data.userId,
        vote: data.vote,
      });
      eventEmitter.emit("send", room, "voter");
      ctx.response.status = 200;
    }
  }
})
.get("/testing/:roomId", (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = roomService.get(ctx.params.roomId)?.sendJSON();
});

export default router;
