import { mockResponse } from 'mock-req-res';

import { noop } from './utils';
import errorHandler from '../src';

jest.mock('in-production', () => true);

describe('Production environment', () => {
  test('Do not Log 400s in PROD', () => {
    const logger = jest.fn();

    const res = mockResponse();

    const err = { ...new Error(), statusCode: 404 };

    errorHandler(logger)(err, {}, res, noop);

    expect(logger).not.toHaveBeenCalled();
  });
});
