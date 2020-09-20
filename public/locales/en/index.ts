import { ILocaleObject } from './../localeInterfaces';
import common from './common';
import donate from './donate';
import me from './me';

const en: ILocaleObject = {
  ...donate,
  ...common,
  ...me,
};
export default en;
