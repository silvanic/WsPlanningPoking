const loggerMiddleware = async (ctx: any, next: any) => {
  await next();
  const status = ctx.response.status;
  console.log(
    `${ctx.request.method} ${ctx.request.url} - status: ${status}`,
  );
};

export { loggerMiddleware };