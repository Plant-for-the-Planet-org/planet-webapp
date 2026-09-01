import type { User } from '@planet-sdk/common';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { APIError } from '@planet-sdk/common';
import { useUserStore } from './userStore';

// Only the fields each test reads/asserts on are needed - not a full User.
const asUser = (profile: Record<string, unknown>) => profile as unknown as User;

// fetchUserProfile only reads `ok`, `status`, and `json()` off the response,
// so the mock only needs to cover that shape.
const fetchResponse = (status: number, body: unknown) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response);

const BASE_PARAMS = { token: 'test-token', tenantId: 'tenant-1', locale: 'en' };

describe('userStore.fetchUserProfile', () => {
  beforeEach(() => {
    process.env.API_ENDPOINT = 'https://api.example.test';
    useUserStore.setState({ userProfile: null });
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('commits the profile to the store and resolves with it on success', async () => {
    const profile = { id: 'user-1', email: 'user@example.com' };
    vi.mocked(fetch).mockResolvedValue(fetchResponse(200, profile));

    const result = await useUserStore.getState().fetchUserProfile(BASE_PARAMS);

    expect(result).toEqual(profile);
    expect(useUserStore.getState().userProfile).toEqual(profile);
  });

  it('rejects with a matching APIError but keeps the existing profile on a 500', async () => {
    const existingProfile = asUser({ id: 'user-1', email: 'user@example.com' });
    useUserStore.setState({ userProfile: existingProfile });
    vi.mocked(fetch).mockResolvedValue(fetchResponse(500, {}));

    const rejection: APIError = await useUserStore
      .getState()
      .fetchUserProfile(BASE_PARAMS)
      .catch((error) => error);

    expect(rejection.statusCode).toBe(500);
    // APIError.message is always "Something went wrong" - callers read the
    // real cause off `.errors` instead (see I7).
    expect(rejection.errors).toMatchObject({
      code: 500,
      message: 'Failed to fetch user profile',
    });
    expect(useUserStore.getState().userProfile).toEqual(existingProfile);
  });

  it('clears the profile on a 401, since the session is no longer valid', async () => {
    useUserStore.setState({ userProfile: asUser({ id: 'user-1' }) });
    vi.mocked(fetch).mockResolvedValue(fetchResponse(401, {}));

    await expect(
      useUserStore.getState().fetchUserProfile(BASE_PARAMS)
    ).rejects.toMatchObject({ statusCode: 401 });
    expect(useUserStore.getState().userProfile).toBeNull();
  });

  it('clears the profile on a 303, since signup is not finished', async () => {
    useUserStore.setState({ userProfile: asUser({ id: 'user-1' }) });
    vi.mocked(fetch).mockResolvedValue(fetchResponse(303, {}));

    await expect(
      useUserStore.getState().fetchUserProfile(BASE_PARAMS)
    ).rejects.toMatchObject({ statusCode: 303 });
    expect(useUserStore.getState().userProfile).toBeNull();
  });

  // Regression: the caller now owns error handling and reads `statusCode` off
  // the rejection, so a plain network failure must also arrive as an APIError
  // rather than the raw fetch error.
  it('normalizes a network failure into an APIError instead of rejecting with the raw error', async () => {
    const networkError = new TypeError('Failed to fetch');
    vi.mocked(fetch).mockRejectedValue(networkError);

    const rejection: APIError = await useUserStore
      .getState()
      .fetchUserProfile(BASE_PARAMS)
      .catch((error) => error);

    expect(rejection).toBeInstanceOf(APIError);
    expect(rejection.statusCode).toBe(0);
    expect(rejection.cause).toBe(networkError);
    expect(rejection.errors).toMatchObject({
      code: 0,
      message: 'Failed to fetch',
    });
  });

  it('rejects with the original 403 and leaves the profile untouched when starting an impersonation attempt', async () => {
    const existingProfile = asUser({ id: 'agent-1' });
    useUserStore.setState({ userProfile: existingProfile });
    vi.mocked(fetch).mockResolvedValue(fetchResponse(403, {}));

    await expect(
      useUserStore.getState().fetchUserProfile({
        ...BASE_PARAMS,
        impersonationData: { targetEmail: 'x@y.com', supportPin: '1234' },
      })
    ).rejects.toMatchObject({ statusCode: 403 });
    expect(useUserStore.getState().userProfile).toEqual(existingProfile);
  });
});
