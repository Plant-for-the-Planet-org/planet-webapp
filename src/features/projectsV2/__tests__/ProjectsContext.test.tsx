import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/router';
import { useApi } from '../../../hooks/useApi';
import { ProjectsProvider, useProjects } from '../ProjectsContext';
import type { MapProject } from '../../common/types/projectv2';

// The search-normalization logic under test (normalizeForSearch,
// expandGermanDigraphs, normalizeDigraph) is not exported from
// ProjectsContext.tsx, so it is exercised indirectly through the public
// `filteredProjects` / `debouncedSearchValue` API exposed by the provider.

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../hooks/useApi', () => ({
  useApi: jest.fn(),
}));

const messages = {
  Country: {
    us: 'United States',
    de: 'Germany',
    mx: 'México',
    fr: 'France',
  },
};

type TreeProjectOverrides = {
  id: string;
  name: string;
  location?: string;
  tpoName?: string;
  country?: string;
};

type ConservationProjectOverrides = {
  id: string;
  name: string;
  tpoName?: string;
  country?: string;
};

const createTreeProject = (overrides: TreeProjectOverrides): MapProject =>
  ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [0, 0] },
    properties: {
      id: overrides.id,
      _scope: 'map',
      name: overrides.name,
      slug: overrides.id,
      purpose: 'trees',
      classification: 'mangroves',
      isApproved: true,
      isFeatured: false,
      isPublished: true,
      isTopProject: false,
      allowDonations: true,
      location: overrides.location ?? '',
      country: overrides.country ?? 'US',
      currency: 'USD',
      unitType: 'tree',
      unitCost: 10,
      image: 'image.jpg',
      tpo: {
        id: `tpo_${overrides.id}`,
        name: overrides.tpoName ?? 'Default TPO',
        slug: `tpo-${overrides.id}`,
      },
      reviews: [],
    },
  } as unknown as MapProject);

const createConservationProject = (
  overrides: ConservationProjectOverrides
): MapProject =>
  ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [0, 0] },
    properties: {
      id: overrides.id,
      _scope: 'map',
      name: overrides.name,
      slug: overrides.id,
      purpose: 'conservation',
      allowDonations: true,
      country: overrides.country ?? 'US',
      currency: 'USD',
      unitType: 'm2',
      unitCost: 10,
      image: 'image.jpg',
      tpo: {
        id: `tpo_${overrides.id}`,
        name: overrides.tpoName ?? 'Default TPO',
        slug: `tpo-${overrides.id}`,
      },
      reviews: [],
    },
  } as unknown as MapProject);

const setupMocks = (projects: MapProject[]) => {
  (useRouter as jest.Mock).mockReturnValue({
    isReady: true,
    query: {},
    push: jest.fn(),
  });
  (useApi as jest.Mock).mockReturnValue({
    getApi: jest.fn().mockResolvedValue(projects),
  });
};

const SearchHarness = () => {
  const { filteredProjects, debouncedSearchValue, setDebouncedSearchValue } =
    useProjects();
  return (
    <div>
      <input
        aria-label="search"
        value={debouncedSearchValue}
        onChange={(e) => setDebouncedSearchValue(e.target.value)}
      />
      <ul>
        {filteredProjects?.map((project) => (
          <li key={project.properties.id}>{project.properties.name}</li>
        ))}
      </ul>
    </div>
  );
};

const renderHarness = () =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ProjectsProvider page="project-list">
        <SearchHarness />
      </ProjectsProvider>
    </NextIntlClientProvider>
  );

const search = (value: string) => {
  fireEvent.change(screen.getByLabelText('search'), {
    target: { value },
  });
};

const getListedNames = () =>
  screen.getAllByRole('listitem').map((el) => el.textContent);

describe('ProjectsContext - search filtering (accent, digraph, hyphen handling)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lists all projects when the search value is empty', async () => {
    const projects = [
      createTreeProject({ id: 'p1', name: 'Plant for Ghana' }),
      createTreeProject({ id: 'p2', name: 'Forest for Kenya' }),
    ];
    setupMocks(projects);
    renderHarness();

    expect(await screen.findByText('Plant for Ghana')).toBeInTheDocument();
    expect(screen.getByText('Forest for Kenya')).toBeInTheDocument();
  });

  it('matches project names irrespective of accents (Yucatán ~ Yucatan)', async () => {
    const projects = [
      createTreeProject({
        id: 'p1',
        name: 'Reforestation project',
        location: 'Yucatán',
      }),
      createTreeProject({ id: 'p2', name: 'Unrelated project' }),
    ];
    setupMocks(projects);
    renderHarness();
    await screen.findByText('Reforestation project');

    search('Yucatan');

    expect(getListedNames()).toEqual(['Reforestation project']);
  });

  it('treats hyphens as spaces so "Plant-for-Ghana" matches "Plant for Ghana"', async () => {
    const projects = [
      createTreeProject({ id: 'p1', name: 'Plant-for-Ghana' }),
      createTreeProject({ id: 'p2', name: 'Unrelated project' }),
    ];
    setupMocks(projects);
    renderHarness();
    await screen.findByText('Plant-for-Ghana');

    search('Plant for Ghana');

    expect(getListedNames()).toEqual(['Plant-for-Ghana']);
  });

  it('matches a hyphenated search keyword against a space-separated name', async () => {
    const projects = [
      createTreeProject({ id: 'p1', name: 'Plant for Ghana' }),
      createTreeProject({ id: 'p2', name: 'Unrelated project' }),
    ];
    setupMocks(projects);
    renderHarness();
    await screen.findByText('Plant for Ghana');

    search('Plant-for-Ghana');

    expect(getListedNames()).toEqual(['Plant for Ghana']);
  });

  it('collapses repeated hyphens/spaces produced by normalization', async () => {
    const projects = [
      createTreeProject({ id: 'p1', name: 'Plant-for-Ghana' }),
      createTreeProject({ id: 'p2', name: 'Unrelated project' }),
    ];
    setupMocks(projects);
    renderHarness();
    await screen.findByText('Plant-for-Ghana');

    search('Plant   for---Ghana');

    expect(getListedNames()).toEqual(['Plant-for-Ghana']);
  });

  it('is case-insensitive', async () => {
    const projects = [createTreeProject({ id: 'p1', name: 'Plant for Ghana' })];
    setupMocks(projects);
    renderHarness();
    await screen.findByText('Plant for Ghana');

    search('PLANT for ghana');

    expect(getListedNames()).toEqual(['Plant for Ghana']);
  });

  it('matches the TPO name field with accent-insensitive search', async () => {
    const projects = [
      createTreeProject({
        id: 'p1',
        name: 'Some project',
        tpoName: 'Łódź Forestry',
      }),
      createTreeProject({ id: 'p2', name: 'Other project' }),
    ];
    setupMocks(projects);
    renderHarness();
    await screen.findByText('Some project');

    search('lodz');

    expect(getListedNames()).toEqual(['Some project']);
  });

  it('matches the translated country field with accent-insensitive search', async () => {
    const projects = [
      createTreeProject({ id: 'p1', name: 'Mexican project', country: 'MX' }),
      createTreeProject({ id: 'p2', name: 'French project', country: 'FR' }),
    ];
    setupMocks(projects);
    renderHarness();
    await screen.findByText('Mexican project');

    search('Mexico');

    expect(getListedNames()).toEqual(['Mexican project']);
  });

  it('does not search the location field for non-tree (conservation) projects', async () => {
    const treeProject = createTreeProject({
      id: 'p1',
      name: 'Tree project',
      location: 'Unique Location Alpha',
    });
    const conservationProject = createConservationProject({
      id: 'p2',
      name: 'Conservation project',
    });
    setupMocks([treeProject, conservationProject]);
    renderHarness();
    await screen.findByText('Tree project');

    search('Unique Location Alpha');

    expect(getListedNames()).toEqual(['Tree project']);
  });

  it('still matches conservation projects by name and TPO with accent-insensitive search', async () => {
    const conservationProject = createConservationProject({
      id: 'p1',
      name: 'Ocean Guardians',
      tpoName: 'Océan Vivant',
    });
    setupMocks([conservationProject]);
    renderHarness();
    await screen.findByText('Ocean Guardians');

    search('ocean vivant');

    expect(getListedNames()).toEqual(['Ocean Guardians']);
  });

  it('returns no results when the keyword does not match any field', async () => {
    const projects = [
      createTreeProject({ id: 'p1', name: 'Plant for Ghana' }),
      createTreeProject({ id: 'p2', name: 'Forest for Kenya' }),
    ];
    setupMocks(projects);
    renderHarness();
    await screen.findByText('Plant for Ghana');

    search('nonexistent keyword');

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('returns no results when the keyword is only whitespace', async () => {
    const projects = [createTreeProject({ id: 'p1', name: 'Plant for Ghana' })];
    setupMocks(projects);
    renderHarness();
    await screen.findByText('Plant for Ghana');

    search('   ');

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  describe('German umlaut/digraph cross-search', () => {
    it('matches a digraph search keyword ("Muenchen") against an umlaut name ("München")', async () => {
      const projects = [
        createTreeProject({ id: 'p1', name: 'München Greening Initiative' }),
        createTreeProject({ id: 'p2', name: 'Unrelated project' }),
      ];
      setupMocks(projects);
      renderHarness();
      await screen.findByText('München Greening Initiative');

      search('Muenchen');

      expect(getListedNames()).toEqual(['München Greening Initiative']);
    });

    it('matches an umlaut search keyword ("München") against a digraph name ("Muenchen")', async () => {
      const projects = [
        createTreeProject({ id: 'p1', name: 'Muenchen Greening Initiative' }),
        createTreeProject({ id: 'p2', name: 'Unrelated project' }),
      ];
      setupMocks(projects);
      renderHarness();
      await screen.findByText('Muenchen Greening Initiative');

      search('München');

      expect(getListedNames()).toEqual(['Muenchen Greening Initiative']);
    });

    it('matches an accent-stripped keyword ("Munchen") against an umlaut name ("München")', async () => {
      const projects = [
        createTreeProject({ id: 'p1', name: 'München Greening Initiative' }),
      ];
      setupMocks(projects);
      renderHarness();
      await screen.findByText('München Greening Initiative');

      search('Munchen');

      expect(getListedNames()).toEqual(['München Greening Initiative']);
    });

    it('does not cross-match unrelated digraph text', async () => {
      const projects = [
        createTreeProject({ id: 'p1', name: 'München Greening Initiative' }),
        createTreeProject({ id: 'p2', name: 'Bonn Restoration Project' }),
      ];
      setupMocks(projects);
      renderHarness();
      await screen.findByText('München Greening Initiative');

      search('Muenchen');

      expect(getListedNames()).toEqual(['München Greening Initiative']);
      expect(screen.queryByText('Bonn Restoration Project')).not.toBeInTheDocument();
    });
  });

  describe('LATIN_FOLD stroke/ligature letter table', () => {
    const cases: Array<{ raw: string; folded: string }> = [
      { raw: 'ø', folded: 'o' },
      { raw: 'ł', folded: 'l' },
      { raw: 'đ', folded: 'd' },
      { raw: 'ð', folded: 'd' },
      { raw: 'ß', folded: 'ss' },
      { raw: 'æ', folded: 'ae' },
      { raw: 'œ', folded: 'oe' },
      { raw: 'þ', folded: 'th' },
      { raw: 'ı', folded: 'i' },
    ];

    it.each(cases)(
      'folds "$raw" to "$folded" when matching project names',
      async ({ raw, folded }) => {
        const name = `Test${raw}Word`;
        const projects = [createTreeProject({ id: 'p1', name })];
        setupMocks(projects);
        renderHarness();
        await screen.findByText(name);

        search(`Test${folded}Word`);

        expect(getListedNames()).toEqual([name]);
      }
    );
  });
});