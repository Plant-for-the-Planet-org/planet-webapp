import type { ApiRequestFn } from '../hooks/useApi';

import { beforeEach, describe, expect, it } from 'vitest';
import { useProjectStore } from './projectStore';
import { useErrorHandlingStore } from './errorHandlingStore';
import {
  callsTo,
  createDeferred,
  createGetApi,
  createMapProject,
  resetAllStores,
} from '../test-utils';

type Request = { locale: string; currency: string; tenant: string };

const DEFAULT: Request = {
  locale: 'en',
  currency: 'EUR',
  tenant: 'ten_NxJq55pm',
};

const fetchProjects = (getApi: ApiRequestFn, params: Request) =>
  useProjectStore
    .getState()
    .fetchProjects(getApi, { queryParams: { _scope: 'map', ...params } });

const listRequests = (getApi: ReturnType<typeof createGetApi>) =>
  callsTo(getApi, '/app/projects');

const heldSlugs = () =>
  useProjectStore
    .getState()
    .projects?.map((project) => project.properties.slug);

describe('projectStore.fetchProjects', () => {
  let getApi: ReturnType<typeof createGetApi>;

  beforeEach(() => {
    resetAllStores();
    getApi = createGetApi();
  });

  it('skips a repeat request for the same locale, currency and tenant', async () => {
    getApi.mockResolvedValue([createMapProject('yucatan')]);

    await fetchProjects(getApi, DEFAULT);
    await fetchProjects(getApi, DEFAULT);

    expect(listRequests(getApi)).toHaveLength(1);
    expect(heldSlugs()).toEqual(['yucatan']);
  });

  it('skips a duplicate of the request already in flight', async () => {
    const response = createDeferred<unknown>();
    getApi.mockReturnValue(response.promise);

    const first = fetchProjects(getApi, DEFAULT);
    const second = fetchProjects(getApi, DEFAULT);
    response.resolve([createMapProject('yucatan')]);
    await Promise.all([first, second]);

    expect(listRequests(getApi)).toHaveLength(1);
  });

  it.each<[string, Partial<Request>]>([
    ['locale', { locale: 'de' }],
    ['currency', { currency: 'USD' }],
    ['tenant', { tenant: 'ten_other' }],
  ])('refetches when the %s changes', async (_, change) => {
    getApi.mockResolvedValue([createMapProject('yucatan')]);

    await fetchProjects(getApi, DEFAULT);
    await fetchProjects(getApi, { ...DEFAULT, ...change });

    expect(listRequests(getApi)).toHaveLength(2);
  });

  it('drops a superseded response, so a slow earlier request cannot overwrite newer data', async () => {
    const older = createDeferred<unknown>();
    const newer = createDeferred<unknown>();
    getApi
      .mockReturnValueOnce(older.promise)
      .mockReturnValueOnce(newer.promise);

    const first = fetchProjects(getApi, DEFAULT);
    const second = fetchProjects(getApi, { ...DEFAULT, currency: 'USD' });
    newer.resolve([createMapProject('newer')]);
    await second;
    older.resolve([createMapProject('older')]);
    await first;

    expect(heldSlugs()).toEqual(['newer']);
  });

  it('ignores a failure from a superseded request', async () => {
    const older = createDeferred<unknown>();
    const newer = createDeferred<unknown>();
    getApi
      .mockReturnValueOnce(older.promise)
      .mockReturnValueOnce(newer.promise);

    const first = fetchProjects(getApi, DEFAULT);
    const second = fetchProjects(getApi, { ...DEFAULT, currency: 'USD' });
    newer.resolve([createMapProject('newer')]);
    await second;
    older.reject(new Error('network error'));
    await first;

    expect(heldSlugs()).toEqual(['newer']);
    expect(useProjectStore.getState().isProjectsError).toBe(false);
    expect(useErrorHandlingStore.getState().errors).toBeNull();
  });

  it('retries the same request after a failure', async () => {
    getApi
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce([createMapProject('yucatan')]);

    await fetchProjects(getApi, DEFAULT);
    expect(useProjectStore.getState().isProjectsError).toBe(true);

    await fetchProjects(getApi, DEFAULT);

    expect(listRequests(getApi)).toHaveLength(2);
    expect(heldSlugs()).toEqual(['yucatan']);
    expect(useProjectStore.getState().isProjectsError).toBe(false);
  });
});
