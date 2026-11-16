import type { Tpo, TreeProjectConcise } from '@planet-sdk/common';

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFilteredProjects } from './useFilteredProjects';
import { useProjectStore } from '../stores';
import { createMapProject, resetAllStores } from '../test-utils';

// Country labels are the translation keys here, which is enough since search rules are covered in projectV2.test.ts.
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const project = (slug: string, overrides: Partial<TreeProjectConcise> = {}) =>
  createMapProject(slug, {
    name: slug,
    classification: 'mangroves',
    allowDonations: true,
    country: 'DE',
    tpo: { name: 'Green Org' } as Tpo,
    ...overrides,
  });

// Each project other than `match` fails exactly one filter, so dropping any one filter lets a project through.
const PROJECTS = [
  project('match', { name: 'Coastal Mangroves' }),
  project('not-donatable', { name: 'Coastal Delta', allowDonations: false }),
  project('wrong-type', {
    name: 'Coastal Forest',
    classification: 'agroforestry',
  }),
  project('wrong-name', { name: 'River Delta' }),
];

const renderFilteredProjects = () => {
  const { result } = renderHook(() => useFilteredProjects());
  return () => ({
    slugs: result.current.filteredProjects.map(
      (project) => project.properties.slug
    ),
    count: result.current.filteredProjectCount,
  });
};

describe('useFilteredProjects', () => {
  beforeEach(() => {
    resetAllStores();
    useProjectStore.setState({ projects: PROJECTS });
  });

  it('returns every project when no filter or search is set', () => {
    const current = renderFilteredProjects();

    expect(current().count).toBe(PROJECTS.length);
  });

  it('keeps only the projects that pass the donation, classification and search filters together', () => {
    const current = renderFilteredProjects();

    act(() => {
      const store = useProjectStore.getState();
      store.setShowDonatableProjects(true);
      store.setSelectedClassification(['mangroves']);
      store.setDebouncedSearchValue('coastal');
    });

    expect(current()).toEqual({ slugs: ['match'], count: 1 });
  });

  it('treats a spaces-only search as no search', () => {
    const current = renderFilteredProjects();

    act(() => {
      useProjectStore.getState().setDebouncedSearchValue('   ');
    });

    expect(current().count).toBe(PROJECTS.length);
  });
});
