import status from 'statuses';
import errorHandler from '../src';
import { INTERNAL_SERVER_ERROR, noop, response } from './utils';

describe('Error message', () => {
  const { res, resetResponse } = response();

  beforeEach(() => {
    resetResponse();
  });

  test('default', () => {
    const handler = errorHandler(noop);

    handler(
      { ...new Error(), statusCode: INTERNAL_SERVER_ERROR },
      {},
      res,
      noop
    );

    const [[args]] = res.json.mock.calls;

    expect(args).toMatchObject({
      message: status[INTERNAL_SERVER_ERROR]
    });
  });
});
