import {
  noop,
  response,
  customErrorMessage,
  INTERNAL_SERVER_ERROR
} from './utils';
import errorHandler from '../src';

describe('Status codes', () => {
  const { res, resetResponse } = response();

  beforeEach(() => {
    resetResponse();
  });

  test('default', () => {
    const handler = errorHandler(noop);

    handler(new Error(customErrorMessage), {}, res, noop);

    const [[jsonArgs]] = res.json.mock.calls;

    expect(jsonArgs).toMatchObject({ statusCode: INTERNAL_SERVER_ERROR });
    expect(res.status).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR);
  });

  test('Status code specified ', () => {
    const handler = errorHandler(noop);
    const statusCode = 404;

    handler({ ...new Error(customErrorMessage), statusCode }, {}, res, noop);

    const [[jsonArgs]] = res.json.mock.calls;

    expect(jsonArgs).toMatchObject({ statusCode });
    expect(res.status).toHaveBeenCalledWith(statusCode);
  });
});
