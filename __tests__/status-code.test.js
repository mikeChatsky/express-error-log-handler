import statuses from 'statuses';

import { noop, response, customErrorMessage } from './utils';
import errorHandler from '../src';

describe('Status codes', () => {
  const { res, resetResponse } = response();
  const logger = jest.fn();

  beforeEach(() => {
    resetResponse();
    logger.mockReset();
  });

  test('default', () => {
    const handler = errorHandler(logger);
    const statusCode = statuses(500);

    handler(new Error(customErrorMessage), {}, res, noop);

    const [[jsonArgs]] = res.json.mock.calls;
    const [[logArgs]] = logger.mock.calls;

    expect(jsonArgs).toMatchObject({ statusCode });
    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(logArgs).toMatchObject({ statusCode });
  });

  test('Status code specified ', () => {
    const handler = errorHandler(logger);
    const statusCode = statuses(404);

    const err = new Error();
    err.statusCode = statusCode;

    handler(err, {}, res, noop);

    const [[jsonArgs]] = res.json.mock.calls;
    const [[logArgs]] = logger.mock.calls;

    expect(jsonArgs).toMatchObject({ statusCode });
    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(logArgs).toMatchObject({ statusCode });
  });

  test('Implied status code name in message', () => {
    const handler = errorHandler(logger);
    const statusCode = statuses(403);

    handler(new Error(statuses[statusCode]), {}, res, noop);

    const [[jsonArgs]] = res.json.mock.calls;
    const [[logArgs]] = logger.mock.calls;

    expect(jsonArgs).toMatchObject({ statusCode });
    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(logArgs).toMatchObject({ statusCode });
  });

  test('Accept `status` alias', () => {
    const handler = errorHandler(logger);
    const statusCode = statuses(504);

    const err = new Error();
    err.status = statusCode;

    handler(err, {}, res, noop);

    const [[jsonArgs]] = res.json.mock.calls;
    const [[logArgs]] = logger.mock.calls;

    expect(jsonArgs).toMatchObject({ statusCode });
    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(logArgs).toMatchObject({ statusCode });
  });
});
