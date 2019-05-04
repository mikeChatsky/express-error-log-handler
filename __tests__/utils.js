export const noop = () => {};

export const INTERNAL_SERVER_ERROR = 500;

export const customErrorMessage = 'Some error';

export const stackTrace =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

export function response() {
  const res = { json: jest.fn(), status: jest.fn() };
  return {
    res,
    resetResponse: () => {
      res.json.mockReset();
      res.status.mockReset();
    }
  };
}
