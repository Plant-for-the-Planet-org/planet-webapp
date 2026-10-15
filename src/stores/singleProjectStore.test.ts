import type { ApiRequestFn } from '../hooks/useApi';

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSingleProjectStore } from './singleProjectStore';
import { useErrorHandlingStore } from './errorHandlingStore';
import {
  callsTo,
  createDeferred,
  createGetApi,
  createProject,
  resetAllStores,
} from '../test-utils';

// Time travel looks up imagery from Esri Wayback, which tests must not call.
vi.mock('../utils/mapsV2/timeTravel', () => ({
  getProjectTimeTravelConfig: async () => null,
}));

type Request = {
  slug: string;
  locale: string;
  currency: string;
  tenant: string;
};

const YUCATAN: Request = {
  slug: 'yucatan',
  locale: 'en',
  currency: 'EUR',
  tenant: 'ten_NxJq55pm',
};

const fetchProject = (getApi: ApiRequestFn, { slug, ...params }: Request) =>
  useSingleProjectStore
    .getState()
    .fetchProject(
      getApi,
      { queryParams: { _scope: 'extended', ...params } },
      slug
    );

const projectRequests = (getApi: ReturnType<typeof createGetApi>) =>
  callsTo(getApi, '/app/projects/');

const heldSlug = () => useSingleProjectStore.getState().singleProject?.slug;

describe('singleProjectStore.fetchProject', () => {
  let getApi: ReturnType<typeof createGetApi>;

  beforeEach(() => {
    resetAllStores();
    getApi = createGetApi();
  });

  it('skips a repeat request for the same slug, locale, currency and tenant', async () => {
    getApi.mockResolvedValue(createProject());

    await fetchProject(getApi, YUCATAN);
    await fetchProject(getApi, YUCATAN);

    expect(projectRequests(getApi)).toHaveLength(1);
    expect(heldSlug()).toBe('yucatan');
  });

  it('skips a duplicate of the request already in flight', async () => {
    const response = createDeferred<unknown>();
    getApi.mockReturnValue(response.promise);

    const first = fetchProject(getApi, YUCATAN);
    const second = fetchProject(getApi, YUCATAN);
    response.resolve(createProject());
    await Promise.all([first, second]);

    expect(projectRequests(getApi)).toHaveLength(1);
  });

  it.each<[string, Partial<Request>]>([
    ['slug', { slug: 'koenigswald-ontananga' }],
    ['locale', { locale: 'de' }],
    ['currency', { currency: 'USD' }],
    ['tenant', { tenant: 'ten_other' }],
  ])('refetches when the %s changes', async (_, change) => {
    getApi.mockResolvedValue(createProject());

    await fetchProject(getApi, YUCATAN);
    await fetchProject(getApi, { ...YUCATAN, ...change });

    expect(projectRequests(getApi)).toHaveLength(2);
  });

  it('drops a superseded response, so a slow earlier request cannot overwrite newer data', async () => {
    const older = createDeferred<unknown>();
    const newer = createDeferred<unknown>();
    getApi
      .mockReturnValueOnce(older.promise)
      .mockReturnValueOnce(newer.promise);

    const first = fetchProject(getApi, YUCATAN);
    const second = fetchProject(getApi, {
      ...YUCATAN,
      slug: 'koenigswald-ontananga',
    });
    newer.resolve(createProject({ slug: 'koenigswald-ontananga' }));
    await second;
    older.resolve(createProject());
    await first;

    expect(heldSlug()).toBe('koenigswald-ontananga');
  });

  it('ignores a failure from a superseded request', async () => {
    const older = createDeferred<unknown>();
    const newer = createDeferred<unknown>();
    getApi
      .mockReturnValueOnce(older.promise)
      .mockReturnValueOnce(newer.promise);

    const first = fetchProject(getApi, YUCATAN);
    const second = fetchProject(getApi, {
      ...YUCATAN,
      slug: 'koenigswald-ontananga',
    });
    newer.resolve(createProject({ slug: 'koenigswald-ontananga' }));
    await second;
    older.reject(new Error('network error'));
    await first;

    expect(heldSlug()).toBe('koenigswald-ontananga');
    expect(useSingleProjectStore.getState().fetchError).toBe(false);
    expect(useErrorHandlingStore.getState().errors).toBeNull();
  });

  it('retries the same request after a failure', async () => {
    getApi
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce(createProject());

    await fetchProject(getApi, YUCATAN);
    expect(useSingleProjectStore.getState().fetchError).toBe(true);

    await fetchProject(getApi, YUCATAN);

    expect(projectRequests(getApi)).toHaveLength(2);
    expect(heldSlug()).toBe('yucatan');
    expect(useSingleProjectStore.getState().fetchError).toBe(false);
  });
});
