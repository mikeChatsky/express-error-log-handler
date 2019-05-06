import statuses from 'statuses';

import errorHandler from '../src';
import { noop, response, customErrorMessage } from './utils';

describe('Error message', () => {
  const { res, resetResponse } = response();
  const logger = jest.fn();

  beforeEach(() => {
    resetResponse();
    logger.mockRestore();
  });

  test('Default', () => {
    const statusCode = statuses(500);

    const err = new Error();
    err.statusCode = statusCode;

    errorHandler(logger)(err, {}, res, noop);

    const [[jsonArgs]] = res.json.mock.calls;
    const [[logArgs]] = logger.mock.calls;

    const messageObject = {
      message: statuses[statusCode]
    };

    expect(jsonArgs).toMatchObject(messageObject);
    expect(logArgs).toMatchObject(messageObject);
  });

  test('Empty string', () => {
    const statusCode = statuses(500);

    const err = new Error('');
    err.statusCode = statusCode;

    errorHandler(logger)(err, {}, res, noop);

    const [[jsonArgs]] = res.json.mock.calls;
    const [[logArgs]] = logger.mock.calls;

    const messageObject = {
      message: statuses[statusCode]
    };

    expect(jsonArgs).toMatchObject(messageObject);
    expect(logArgs).toMatchObject(messageObject);
  });

  test('Custom error message', () => {
    errorHandler(logger)(new Error(customErrorMessage), {}, res, noop);

    const [[jsonArgs]] = res.json.mock.calls;
    const [[logArgs]] = logger.mock.calls;

    expect(jsonArgs).toMatchObject({
      message: statuses[500]
    });
    expect(logArgs).toMatchObject({ message: customErrorMessage });
  });
});
