import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { APIError } from '@planet-sdk/common';
import { useUserStore } from './userStore';
import { createDeferred, resetAllStores } from '../test-utils';

vi.mock('../utils/apiRequests/getSessionId', () => ({
  default: async () => 'session-id',
}));

const PARAMS = { token: 'token', tenantId: 'ten_1', locale: 'en' };
const abortError = () => new DOMException('Aborted', 'AbortError');

describe('fetchUserProfile sequencing', () => {
  beforeEach(() => {
    resetAllStores();
    vi.stubEnv('API_ENDPOINT', 'https://api.test');
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('aborts a superseded request, so only the newest profile lands', async () => {
    const signals: AbortSignal[] = [];
    const latestResponse = createDeferred<Response>();
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init: Parameters<typeof fetch>[1]) => {
        const signal = init?.signal as AbortSignal;
        signals.push(signal);
        if (signals.length === 1) {
          return signal.aborted
            ? Promise.reject(abortError())
            : new Promise((_, reject) =>
                signal.addEventListener('abort', () => reject(abortError()))
              );
        }
        return latestResponse.promise;
      })
    );

    const { fetchUserProfile } = useUserStore.getState();
    const first = fetchUserProfile(PARAMS);
    await vi.waitFor(() => expect(signals).toHaveLength(1));
    expect(signals[0].aborted).toBe(false);
    const latest = fetchUserProfile(PARAMS);

    await expect(first).rejects.toMatchObject({ name: 'AbortError' });
    expect(signals[0].aborted).toBe(true);

    latestResponse.resolve(
      new Response(JSON.stringify({ slug: 'newest' }), { status: 200 })
    );
    await expect(latest).resolves.toMatchObject({ slug: 'newest' });
    expect(useUserStore.getState().userProfile?.slug).toBe('newest');
    expect(useUserStore.getState().profileApiError).toBeNull();
  });

  it('ignores a failure from a superseded request', async () => {
    // The older request still completes after being superseded, as if its reply was already read before the abort. The store must ignore it.
    const older = createDeferred<Response>();
    const newer = createDeferred<Response>();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockReturnValueOnce(older.promise)
        .mockReturnValueOnce(newer.promise)
    );

    const { fetchUserProfile } = useUserStore.getState();
    const first = fetchUserProfile(PARAMS);
    const second = fetchUserProfile(PARAMS);

    newer.resolve(
      new Response(JSON.stringify({ slug: 'newest' }), { status: 200 })
    );
    await second;
    older.resolve(new Response(JSON.stringify({}), { status: 401 }));
    const error = await first.catch((e: unknown) => e);
    expect(error).toBeInstanceOf(APIError);
    expect(error).toMatchObject({ statusCode: 401 });

    expect(useUserStore.getState().userProfile?.slug).toBe('newest');
    expect(useUserStore.getState().profileApiError).toBeNull();
  });
});
