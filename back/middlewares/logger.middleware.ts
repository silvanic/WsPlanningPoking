const loggerMiddleware = async (ctx: any, next: any) => {
  await next();
  const status = ctx.response.status;
  console.log(
    `${ctx.request.method} ${ctx.request.url.pathname} - status: ${status}`,
  );
};

export { loggerMiddleware };