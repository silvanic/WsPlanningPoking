import { Application, send } from "jsr:@oak/oak@14";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import router from "./routes/room.route.ts";
import * as middlewares from "./middlewares/middlesware.ts"

const app = new Application();

app.use(middlewares.loggerMiddleware);

app.use(
  oakCors({
    origin: "*",
  }),
);

app.use(router.routes());

app.use(async (context) => {
  let pathname = context.request.url.pathname;
  if(pathname.startsWith('/') && pathname.indexOf('.')===-1){
    pathname='/';
  }
  await send(context, 
    pathname,
    {
      root: `${Deno.cwd()}/../front/dist/sse/browser`,
      index: "index.html",
    }
    );
  });
  
  await app.listen({ port: 8080 })
