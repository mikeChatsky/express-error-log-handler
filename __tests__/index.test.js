import statuses from 'statuses';

import { noop, customErrorMessage, stackTrace, response } from './utils';
import errorHandler from '../src';

describe('Middleware structure', () => {
  test('handler is a function', () => {
    expect(errorHandler instanceof Function).toBeTruthy();
  });

  test('handler returns a function', () => {
    const returned = errorHandler(noop);

    expect(returned instanceof Function).toBeTruthy();
  });
});

describe('Functionality', () => {
  const { res, resetResponse } = response();

  beforeEach(() => {
    resetResponse();
  });

  test('Call express response functions once', () => {
    const handler = errorHandler(noop);

    const err = new Error(customErrorMessage);
    err.statusCode = statuses(500);

    handler(err, {}, res, noop);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
  });

  describe('Logging', () => {
    test('Call logger once', () => {
      const logger = jest.fn();
      const handler = errorHandler(logger);

      const err = new Error(customErrorMessage);
      err.statusCode = statuses(500);

      handler(err, {}, res, noop);

      expect(logger).toHaveBeenCalledTimes(1);
    });

    test('Log with all given params', () => {
      const logger = jest.fn();
      const handler = errorHandler(logger);

      const errorDetails = {
        statusCode: statuses(404),
        message: customErrorMessage,
        stack: stackTrace
      };

      const err = new Error(errorDetails.message);

      err.statusCode = errorDetails.statusCode;
      err.stack = errorDetails.stack;

      const req = {};

      handler(err, req, res, noop);

      expect(logger).toHaveBeenCalledWith({ req, res, ...errorDetails });
    });

    test('Do not log if no logger passed', () => {
      const handler = errorHandler();

      expect(() => {
        handler(new Error(customErrorMessage), {}, res, noop);
      }).not.toThrow();
    });
  });
});
