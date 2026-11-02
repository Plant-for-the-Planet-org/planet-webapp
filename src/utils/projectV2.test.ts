import type {
  ConservationProjectConcise,
  CountryCode,
  Tpo,
  TreeProjectConcise,
} from '@planet-sdk/common';
import type { MapProject } from '../features/common/types/projectv2';

import { describe, expect, it } from 'vitest';
import { filterByClassification, filterBySearch } from './projectV2';
import { createMapProject } from '../test-utils';

const COUNTRY_NAMES: Partial<Record<CountryCode, string>> = {
  DE: 'Deutschland',
  IT: 'Italien',
};

// Stands in for the app's translated country names, so a match proves the label was searched and not the code.
const getCountryLabel = (code: CountryCode) => COUNTRY_NAMES[code] ?? code;

const tpo = (name: string) => ({ name } as Tpo);

const treeProject = (
  slug: string,
  overrides: Partial<TreeProjectConcise> = {}
) =>
  createMapProject(slug, {
    purpose: 'trees',
    name: slug,
    classification: 'agroforestry',
    location: null,
    country: 'DE',
    tpo: tpo('Green Org'),
    ...overrides,
  });

const conservationProject = (
  slug: string,
  overrides: Partial<ConservationProjectConcise> = {}
) =>
  createMapProject(slug, {
    purpose: 'conservation',
    name: slug,
    country: 'DE',
    tpo: tpo('Green Org'),
    ...overrides,
  });

const slugsOf = (projects: MapProject[] | undefined) =>
  projects?.map((project) => project.properties.slug);

describe('filterByClassification', () => {
  const mangroves = treeProject('mangroves', { classification: 'mangroves' });
  const agroforestry = treeProject('agroforestry', {
    classification: 'agroforestry',
  });
  const urban = treeProject('urban', { classification: 'urban-planting' });
  const conservation = conservationProject('conservation');
  const projects = [mangroves, agroforestry, urban, conservation];

  it('keeps only the tree projects of the selected classifications', () => {
    expect(
      slugsOf(filterByClassification(projects, ['mangroves', 'urban-planting']))
    ).toEqual(['mangroves', 'urban']);
  });

  it('returns every project, conservation included, when no classification is selected', () => {
    expect(slugsOf(filterByClassification(projects, []))).toEqual([
      'mangroves',
      'agroforestry',
      'urban',
      'conservation',
    ]);
  });

  // Intended: classifications describe tree projects only, so a conservation project can never match one.
  it('leaves out conservation projects once any classification is selected', () => {
    expect(slugsOf(filterByClassification(projects, ['mangroves']))).toEqual([
      'mangroves',
    ]);
  });
});

describe('filterBySearch', () => {
  const search = (projects: MapProject[], keyword: string) =>
    slugsOf(filterBySearch(projects, keyword, getCountryLabel));

  it.each([
    ['an accent left out', 'yucatan', 'Yucatán Restoration'],
    ['upper case', 'YUCATÁN', 'Yucatán Restoration'],
    ['an umlaut typed without its dots', 'munchen', 'München Forest'],
    ['an umlaut typed as two letters', 'muenchen', 'München Forest'],
    ['two letters typed as an umlaut', 'münchen', 'Muenchen Forest'],
    ['ß typed as ss', 'strasse', 'Straße Trees'],
    ['letters with a stroke typed plainly', 'lodz', 'Łódź Park'],
    ['spaces where the name has hyphens', 'plant for ghana', 'Plant-for-Ghana'],
    ['hyphens where the name has spaces', 'plant-for-ghana', 'Plant for Ghana'],
  ])('finds a project name with %s: "%s" finds "%s"', (_, keyword, name) => {
    const projects = [
      treeProject('match', { name }),
      treeProject('other', { name: 'Unrelated Project' }),
    ];

    expect(search(projects, keyword)).toEqual(['match']);
  });

  it('finds a project by the name of its organisation (TPO)', () => {
    const projects = [
      treeProject('match', { tpo: tpo('Eden Reforestation') }),
      treeProject('other'),
    ];

    expect(search(projects, 'eden')).toEqual(['match']);
  });

  it('finds a project by its country name in the current language', () => {
    const projects = [
      treeProject('match', { country: 'IT' }),
      treeProject('other', { country: 'DE' }),
    ];

    expect(search(projects, 'italien')).toEqual(['match']);
  });

  it('finds a tree project by its location, but not a conservation project', () => {
    const projects = [
      treeProject('tree', { location: 'Chiapas' }),
      // The location is not part of the conservation type, so the API data is cast to test that it is ignored.
      conservationProject('conservation', {
        location: 'Chiapas',
      } as Partial<ConservationProjectConcise>),
    ];

    expect(search(projects, 'chiapas')).toEqual(['tree']);
  });
});
