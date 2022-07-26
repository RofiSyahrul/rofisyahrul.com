const INTERNAL_SERVER_ERROR_STATUS = 500;
const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error';

export class FetchError extends Error {
  response: Response;

  constructor(response: Response) {
    super(`${response.status} ${response.statusText}`);
    this.response = response;
  }
}

export async function parseError<TError extends Error = Error>(
  error: TError,
) {
  if (!(error instanceof FetchError)) {
    return {
      status: INTERNAL_SERVER_ERROR_STATUS,
      data: {
        message: error?.message || INTERNAL_SERVER_ERROR_MESSAGE,
      },
    };
  }

  try {
    const { response } = error;
    const { status } = response;
    if (response.headers.get('Content-Type')?.includes('text')) {
      const message = await response.text();
      return {
        status,
        data: {
          message,
        },
      };
    }

    return {
      status,
      data: await response.json(),
    };
  } catch (err) {
    return {
      status: INTERNAL_SERVER_ERROR_STATUS,
      data: {
        message: INTERNAL_SERVER_ERROR_MESSAGE,
      },
    };
  }
}
