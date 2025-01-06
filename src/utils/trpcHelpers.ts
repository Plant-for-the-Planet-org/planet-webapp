import type { SerializedError } from '@planet-sdk/common';
import type { SetState } from '../features/common/types/common';
import type {
  TrpcQueryResult,
  TrpcQueryResultError,
} from '../features/common/types/trpc';

import { handleError, APIError } from '@planet-sdk/common';

export const updateStateWithTrpcData = <
  T,
  E extends TrpcQueryResultError = TrpcQueryResultError
>(
  trpcProcedure: TrpcQueryResult<T, E>,
  stateUpdaterFunction: SetState<T | undefined>,
  setErrors: SetState<SerializedError[] | null>
): void => {
  if (!trpcProcedure.isLoading) {
    if (trpcProcedure.error) {
      setErrors(
        handleError(
          new APIError(
            trpcProcedure.error?.data?.httpStatus as number,
            trpcProcedure.error
          )
        )
      );
    } else {
      stateUpdaterFunction(trpcProcedure.data);
    }
  }
};
