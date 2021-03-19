import { until } from 'selenium-webdriver-3';
import { driver } from '../helper';

const rootSelector = { css: '.theme-light' };

export const root = () => driver.findElement(rootSelector);

export const load = async () => {
  await driver.get(`${__baseUrl__}`);
  await driver.manage().window().maximize();
  await driver.wait(until.elementLocated(root));
};
