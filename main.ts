/*
 * This is an example of a server that utilizes the router.
 */

// Importing some console colors
import { bold, cyan, green, yellow } from "jsr:@std/fmt@0.218/colors";

import { Application, Router, Status, send } from "jsr:@oak/oak@14";

import { RoomService } from "./back/services/room.service.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

export const roomService = new RoomService();

const router = new Router();

const TIME_OUT_VOTE = 3000;

/**
 * différents events :
 * - login
 * - changement de status
 * - voter
 * - mise à jour info salle
 */

const broadcastRoom = (id: string) => {
  const room = roomService.get(id);
  if (room) {
    for (const user of room.users) {
      user.socket?.send(JSON.stringify(room.sendJSON()));
    }
  }
};

router
  .post("/login", async (ctx) => {
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
      name: data.username,
    });
    ctx.response.status = 200;
    ctx.response.body = {
      userId: user?.id,
      room: room.sendJSON(),
    };
  })
  .get("/ws/:roomId/:userId", async (ctx) => {
    if (ctx.isUpgradable) {
      const socket = await ctx.upgrade();
      const roomId = ctx.params.roomId;
      const userId = ctx.params.userId;
      const room = roomService.get(ctx.params.roomId);
      if (room) {
        const user = roomService.getUser(roomId, userId);
        user.socket = socket;
        roomService.setUser(roomId, user);
        socket.onopen = () => {
          broadcastRoom(roomId);
        };

        socket.onmessage = (e: MessageEvent) => {
          const data = JSON.parse(e.data);
          switch (data.event) {
            case "update_status":
              roomService.updateStatus(roomId);
              break;
            case "vote":
              roomService.setVote(roomId,{
                userId: userId,
                vote: data.vote
              });
              break;
            case "update_info":
              roomService.updateInfo(roomId,
                data.name,
                data.description,
                data.url
              )
          }
          broadcastRoom(roomId);
        };

        socket.onclose = () => {
          roomService.removeUser(roomId, userId);
          broadcastRoom(roomId);
        };
      } else {
        socket.close(1008, "Room doesn't exist");
      }
    } else {
      ctx.response.status = Status.OK;
      ctx.response.body = { message: "Can't connect." };
      return;
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
        room: {},
      };
    }
  })
  .get("/rooms", (ctx) => {
    ctx.response.status = 200;
    const result: Array<any> = [];
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
        //eventemitter.emit("send", room, "voter");
        ctx.response.status = 200;
      }
    }
  })
  .get("/testing/:roomId", (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = roomService.get(ctx.params.roomId)?.sendJSON();
  })
  .get("/:file?", async (ctx) => {
    if (ctx.params.file?.indexOf(".") == -1) {
      ctx.request.url.pathname = ctx.request.url.pathname.replace(
        ctx.params.file,
        ""
      );
    }
    await send(ctx, ctx.request.url.pathname, {
      root: `${Deno.cwd()}/front/dist/sse/browser`,
      index: "index.html",
    });
  });

const app = new Application();

// Logger
app.use(async (context, next) => {
  await next();
  console.log(
    `${green(context.request.method)} ${cyan(
      context.request.url.pathname
    )}`
  );
});

// Use the router
app.use(router.routes());
app.use(router.allowedMethods());

app.use(
  oakCors({
    origin: "*",
  })
);

app.addEventListener("listen", ({ hostname, port, serverType }) => {
  console.log(bold("Start listening on ") + yellow(`${hostname}:${port}`));
  console.log(bold("  using HTTP server: " + yellow(serverType)));
});

await app.listen({ port: 8000 });
