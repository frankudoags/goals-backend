const errorHandler = (err: any, _req: any, res: any, _next: any) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message:`${err.name}: ${err.message}`,
    // stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export default errorHandler;