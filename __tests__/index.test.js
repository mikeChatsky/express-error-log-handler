import { mockRequest, mockResponse } from 'mock-req-res';
import errorHandler from '../src';

const INTERNAL_SERVER_ERROR = 500;

const noop = () => {};

const next = jest.fn();

const logger = jest.fn(err => err);

describe('Middleware structure', () => {
  test('handler is a function', () => {
    expect(errorHandler instanceof Function).toBeTruthy();
  });

  test('handler returns a function', () => {
    const returned = errorHandler(logger);

    expect(returned instanceof Function).toBeTruthy();
  });
});

describe('Status codes', () => {
  const handler = errorHandler(logger);

  test('default', () => {
    const res = mockResponse();

    handler(new Error('Some error'), {}, res, noop);

    expect(
      res.json.calledWithMatch({ statusCode: INTERNAL_SERVER_ERROR })
    ).toBeTruthy();
  });
});
