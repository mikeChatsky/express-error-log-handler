import status from 'statuses';
import inProduction from 'in-production';

// eslint-disable-next-line no-unused-vars
export default log => (err, req, res, next) => {
  const INTERNAL_SERVER_ERROR = 500;

  const statusCode =
    err.status ||
    err.statusCode ||
    status[err.message] || // todo: check err.message for null
    status(INTERNAL_SERVER_ERROR);

  const body = {
    statusCode
  };

  if (!inProduction) {
    body.stack = err.stack;
  }

  if (!inProduction || statusCode > INTERNAL_SERVER_ERROR) {
    if (log) {
      log({ err, req, res, statusCode });
    }
  }

  body.message =
    statusCode > INTERNAL_SERVER_ERROR
      ? status[statusCode]
      : err.message || status[INTERNAL_SERVER_ERROR];

  res.json(body);
};
