import { By } from 'selenium-webdriver';
import { root } from './index';

const headerSelector = { css: '.theme-light' };

export const donateButton = () => root().findElement(By.className('donateButton'));
export const donateContinue = () => root().findElement(By.id('treeDonateContinue'));
export const firstName = () => root().findElement(By.name('firstname'));

export const header = () => root().findElement(headerSelector);

