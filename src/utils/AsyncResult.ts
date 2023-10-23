export type AsyncResult<TResult, TError = unknown> =
  | AsyncEmpty
  | AsyncInProgress
  | AsyncSuccess<TResult>
  | AsyncFailure<TError>;

interface AsyncEmpty {
  type: "empty";
}

interface AsyncInProgress {
  type: "inProgress";
}

interface AsyncSuccess<TResult> {
  type: "success";
  value: TResult;
}

interface AsyncFailure<TError> {
  type: "failure";
  error: TError;
}

export const asAsyncSuccess = <TResult>(
  value: TResult
): AsyncSuccess<TResult> => ({ type: "success", value });

export const asAsyncFailure = <TError>(
  error: TError
): AsyncFailure<TError> => ({ type: "failure", error });

export const ASYNC_IN_PROGRESS: AsyncInProgress = { type: "inProgress" };

export const ASYNC_EMPTY: AsyncEmpty = { type: "empty" };

export const fromOpenApiFetch = <TData, TError>(
  response: { data: TData; error?: never } | { data?: never; error: TError }
) =>
  response.data !== undefined
    ? asAsyncSuccess(response.data)
    : asAsyncFailure(response.error);
