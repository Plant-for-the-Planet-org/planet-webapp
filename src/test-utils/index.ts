import type { Mock } from 'vitest';
import type { NextRouter } from 'next/router';
import type { ApiConfigBase, ApiRequestFn } from '../hooks/useApi';
import type {
  ExtendedProject,
  MapProject,
  MapProjectProperties,
} from '../features/common/types/projectv2';

import { vi } from 'vitest';
import * as stores from '../stores';

type ResettableStore = {
  getInitialState: () => unknown;
  setState: (state: unknown, replace: true) => void;
};

const isResettableStore = (value: unknown): value is ResettableStore =>
  typeof value === 'function' &&
  'getInitialState' in value &&
  'setState' in value;

/**
 * Resets every Zustand store to its initial state. Stores are module singletons, so without this state leaks between tests.
 * Resets all of them rather than the one under test, since store actions write into other stores (a project fetch updates the intervention, map and error stores).
 */
export const resetAllStores = () => {
  for (const store of Object.values(stores)) {
    if (isResettableStore(store)) store.setState(store.getInitialState(), true);
  }
};

/** A ready router at the given query. Pass it to `vi.mocked(useRouter).mockReturnValue`. */
export const createMockRouter = (overrides: Partial<NextRouter> = {}) =>
  ({
    isReady: true,
    query: {},
    pathname: '/',
    asPath: '/',
    push: vi.fn(),
    replace: vi.fn(),
    ...overrides,
  } as unknown as NextRouter);

/** A `vi.fn` that can be passed wherever the app expects `getApi`. */
export const createGetApi = () => {
  const getApi =
    vi.fn<(url: string, config?: ApiConfigBase) => Promise<unknown>>();
  return getApi as typeof getApi & ApiRequestFn;
};

/** `/app/projects/<slug>`, but not the project list or a sub-path such as `/app/projects/<slug>/sites`. */
export const SINGLE_PROJECT_PATH = /^\/app\/projects\/[^/]+$/;

/** The calls to a mocked `getApi` for `path`, so unrelated requests such as interventions do not skew a count. A string matches the exact path; use a pattern for a path with a changing part, such as a slug. */
export const requestsTo = (getApi: Mock, path: string | RegExp) =>
  getApi.mock.calls.filter(
    ([calledPath]) =>
      typeof calledPath === 'string' &&
      (typeof path === 'string' ? calledPath === path : path.test(calledPath))
  );

/** A promise the test settles by hand, to control the order responses arrive in. */
export const createDeferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

/** The smallest project the stores accept, defaulting to the Yucatán project from issue #3016's fixtures. */
export const createProject = (overrides: Partial<ExtendedProject> = {}) =>
  ({
    id: 'proj_WZkyugryh35sMmZMmXCwq7YY',
    slug: 'yucatan',
    purpose: 'trees',
    geoLocation: { type: 'Point', coordinates: [-89.62, 20.97] },
    sites: [],
    ...overrides,
  } as unknown as ExtendedProject);

/** The smallest project site with a shape, so it counts as selectable. */
export const createSite = (id: string) =>
  ({
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: [] },
    properties: { id },
  } as unknown as NonNullable<ExtendedProject['sites']>[number]);

/** The smallest project list entry, as returned by `/app/projects`. */
export const createMapProject = (
  slug: string,
  overrides: Partial<MapProjectProperties> = {}
) =>
  ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [0, 0] },
    properties: {
      id: `proj_${slug}`,
      slug,
      purpose: 'trees',
      isTopProject: false,
      ...overrides,
    },
  } as unknown as MapProject);
