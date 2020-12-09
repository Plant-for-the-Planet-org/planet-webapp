import { By } from 'selenium-webdriver';
import { root } from './index';

const headerSelector = { css: '.theme-light' };

export const donateButton = () => root().findElement(By.css('div.donateButton'));

export const header = () => root().findElement(headerSelector);

