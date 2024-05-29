//TEMPORARY FILE: TO BE REMOVED
export interface TrpcQueryResultError {
  data?: {
    httpStatus: number;
  } | null;
}

export interface TrpcQueryResult<
  T,
  E extends TrpcQueryResultError = TrpcQueryResultError
> {
  isLoading: boolean;
  error: E | null;
  data?: T;
}
