import webdriver from 'selenium-webdriver'
import dotenv from 'dotenv';
dotenv.config({path: '../.env.local'})

const capabilities = {
  'os_version' : '10',
  'resolution' : '1920x1080',
  'browserName' : 'Chrome',
  'browser_version' : 'latest',
  'os' : 'Windows',
  'name': process.env.BROWSERSTACK_PROJECT_NAME, // test name
  'build': process.env.BROWSERSTACK_BUILD_NAME, // CI/CD job or build name
  'browserstack.user' : process.env.BROWSERSTACK_USERNAME,
  'browserstack.key' : process.env.BROWSERSTACK_ACCESS_KEY,
}


export const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .usingServer('https://hub-cloud.browserstack.com/wd/hub')
  .withCapabilities(capabilities)
  .build();
  
driver.manage().window().maximize() 
afterAll(async () => {
  // Cleanup `process.on('exit')` event handlers to prevent a memory leak caused by the combination of `jest` & `tmp`.
  for (const listener of process.listeners('exit')) {
    listener();
    process.removeListener('exit', listener);
  }
  await driver.quit();
});
export const defaultTimeout = 10e9;