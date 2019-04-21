import { mockRequest, mockResponse } from 'mock-req-res';
import errorHandler from '../src';

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
