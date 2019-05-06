import statuses from 'statuses';

import { noop, response } from './utils';
import errorHandler from '../src';

jest.mock('in-production', () => true);

describe('Production environment', () => {
  const { res } = response();

  test('Do not Log 400s in PROD', () => {
    const logger = jest.fn();

    const err = new Error();
    err.statusCode = statuses(404);

    errorHandler(logger)(err, {}, res, noop);

    expect(logger).not.toHaveBeenCalled();
  });

  test('Log 500s and above', () => {
    const logger = jest.fn();

    const err = new Error();
    err.statusCode = statuses(500);

    errorHandler(logger)(err, {}, res, noop);

    expect(logger).toHaveBeenCalled();
  });
});
