import webdriver from 'selenium-webdriver-3'

const capabilities = {
  'os_version' : '10',
  'resolution' : '1920x1080',
  'browserName' : 'Chrome',
  'browser_version' : 'latest',
  'os' : 'Windows',
  "browserstack.networkLogs" : 'true',
  'name': process.env.BROWSERSTACK_PROJECT_NAME, // test name
  'build': process.env.BROWSERSTACK_BUILD_NAME, // CI/CD job or build name
  'browserstack.user': process.env.BROWSERSTACK_USERNAME,
  'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
  'browserstack.debug': 'true',
}

export const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .usingServer('https://hub-cloud.browserstack.com/wd/hub')
  .withCapabilities(capabilities)
  .build();
  
driver.manage().window().maximize() 

export const defaultTimeout = 10e9;
