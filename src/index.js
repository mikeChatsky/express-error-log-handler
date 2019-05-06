import status from 'statuses';
import inProduction from 'in-production';

// eslint-disable-next-line no-unused-vars
export default log => (err, req, res, next) => {
  const INTERNAL_SERVER_ERROR = 500;

  const internalMessage = err.message || status[INTERNAL_SERVER_ERROR];

  const statusCode =
    err.status ||
    err.statusCode ||
    status[err.message] ||
    status(INTERNAL_SERVER_ERROR);

  const body = {
    statusCode
  };

  if (!inProduction) {
    body.stack = err.stack;
  }

  body.message = status[statusCode];

  if (!inProduction || statusCode >= INTERNAL_SERVER_ERROR) {
    if (log) {
      log({
        req,
        res,
        statusCode,
        stack: err.stack,
        message: internalMessage
      });
    }
  }

  res.status(statusCode);

  res.json(body);
};
