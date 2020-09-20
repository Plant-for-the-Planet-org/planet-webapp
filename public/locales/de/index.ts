import { ILocaleObject } from './../localeInterfaces';
import common from './common';
import donate from './donate';
import me from './me';

const de: ILocaleObject = {
  ...donate,
  ...common,
  ...me,
};
export default de;
