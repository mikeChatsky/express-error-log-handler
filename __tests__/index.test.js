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

  test('Call express response function once', () => {
    const handler = errorHandler(noop);

    handler(new Error(customErrorMessage), {}, res, noop);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
  });

  describe('Logging', () => {
    test('Log with all given params', () => {
      const logger = jest.fn();
      const handler = errorHandler(logger);

      const errorDetails = {
        statusCode: 404,
        message: customErrorMessage,
        stack: stackTrace
      };

      const req = {};

      const err = { ...new Error(), ...errorDetails };

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
