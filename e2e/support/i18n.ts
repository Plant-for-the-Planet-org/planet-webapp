import type englishAllProjects from '../../public/static/locales/en/allProjects.json';
import type englishCountry from '../../public/static/locales/en/country.json';
import type englishProject from '../../public/static/locales/en/project.json';

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createTranslator } from 'next-intl';

// The language the specs open the site in. UI text comes from the app's own message files for this locale, so the specs do not depend on English wording.
export const LOCALE = 'en';

type AllProjectsText = (typeof englishAllProjects)['AllProjects'];
type CountryText = (typeof englishCountry)['Country'];
type ProjectText = (typeof englishProject)['Project'];

const readMessages = (locale: string, file: string) =>
  JSON.parse(
    readFileSync(
      path.join(
        __dirname,
        '../../public/static/locales',
        locale,
        `${file}.json`
      ),
      'utf8'
    )
  );

// Like the app, a string the locale does not translate falls back to English.
const readWithEnglishFallback = (file: string, namespace: string) => ({
  ...readMessages('en', file)[namespace],
  ...readMessages(LOCALE, file)[namespace],
});

export const allProjectsText: AllProjectsText = readWithEnglishFallback(
  'allProjects',
  'AllProjects'
);

// Country names, keyed by lowercase country code, as the project cards show them.
export const countryText: CountryText = readWithEnglishFallback(
  'country',
  'Country'
);

// Labels on project cards, such as the project type.
export const projectText: ProjectText = readWithEnglishFallback(
  'project',
  'Project'
);

// Fills a message's placeholders, plurals included, the same way the app does.
export const formatMessage = (
  message: string,
  values: Record<string, string | number>
) =>
  createTranslator({ locale: LOCALE, messages: { message } })(
    'message',
    values
  );
