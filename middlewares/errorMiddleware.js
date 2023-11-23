export const errorHandler = (err, req, res, next) => {
  // by providing err parameter first express knows that this is custom middleware
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  // One more specific type of error is called CastError v need resolve this to get all errors handled
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = `Resource Not Found`;
  }
  res.status(res.statusCode).json({
    message,
    stack: err.stack,
  });
};
