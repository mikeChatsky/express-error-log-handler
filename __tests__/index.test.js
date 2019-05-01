import { mockResponse } from 'mock-req-res';

import { noop } from './utils';

import errorHandler from '../src';

const INTERNAL_SERVER_ERROR = 500;

const customErrorMessage = 'Some error';
const stackTrace = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

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
  describe('Status codes', () => {
    test('default', () => {
      const handler = errorHandler(noop);
      const res = mockResponse();

      handler(new Error(customErrorMessage), {}, res, noop);

      expect(
        res.json.calledWithMatch({ statusCode: INTERNAL_SERVER_ERROR })
      ).toBeTruthy();
    });

    test('Status code specified ', () => {
      const handler = errorHandler(noop);
      const res = mockResponse();
      const statusCode = 404;

      handler({ ...new Error(customErrorMessage), statusCode }, {}, res, noop);

      expect(res.json.calledWithMatch({ statusCode })).toBeTruthy();
    });
  });

  describe('Logging', () => {
    test('Log with all params given', () => {
      const logger = jest.fn();
      const handler = errorHandler(logger);

      const errorDetails = {
        statusCode: 404,
        message: customErrorMessage,
        stack: stackTrace
      };

      const req = {};
      const res = mockResponse();

      const err = { ...new Error(), ...errorDetails };

      handler(err, req, res, noop);

      expect(logger).toHaveBeenCalledWith({ req, res, ...errorDetails });
    });
  });
});
