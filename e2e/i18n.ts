import type englishAllProjects from '../public/static/locales/en/allProjects.json';

import { readFileSync } from 'node:fs';
import path from 'node:path';

// The language the specs open the site in. UI text comes from the app's own message files for this locale, so the specs do not depend on English wording.
export const LOCALE = 'en';

type AllProjectsText = (typeof englishAllProjects)['AllProjects'];

const readMessages = (locale: string, file: string) =>
  JSON.parse(
    readFileSync(
      path.join(__dirname, '../public/static/locales', locale, `${file}.json`),
      'utf8'
    )
  );

// Like the app, a string the locale does not translate falls back to English.
export const allProjectsText: AllProjectsText = {
  ...readMessages('en', 'allProjects').AllProjects,
  ...readMessages(LOCALE, 'allProjects').AllProjects,
};
