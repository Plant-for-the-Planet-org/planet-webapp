const { By, until, Key } = require('selenium-webdriver-3');
const { driver } = require('./helper');
const { load } = require('./Pages');

describe('manage-project', () => {
  beforeEach(async () => {
    await load();
  });
  it('should create a project', async () => {
    const url = await driver.getCurrentUrl();
    await driver.navigate().to(`${url}/login`);
    (await driver).sleep(200);
    //Login Process
    await driver.findElement(By.id('username')).sendKeys('test-tpo@plant-for-the-planet.org');
    await driver.findElement(By.name('action')).click();
    await driver.findElement(By.id('password')).sendKeys('CcCFg2enJ@C7XrV3ukqHbYYbaN-2hBW7hh6_Ye8kBorZAwczZfdM*TJnMLdgpbi');
    await driver.findElement(By.name('action')).click();
    (await driver).sleep(200);

    //Start Project Creation
    await driver.findElement(By.id('addProjectBut')).click();
    await driver.findElement(By.name('name')).sendKeys('Test Project 200');
    await driver.findElement(By.name('slug')).sendKeys('test-project-200');

		await element(by.name("name")).sendKeys('Test Project 200');
		await element(by.name("slug")).click();
		await element(by.name("slug")).sendKeys('test-project-200');
		await element(by.xpath("//div[@id='menu-classification']/div[3]/ul/li")).click();
		await element(by.name("countTarget")).click();
		await element(by.name("countTarget")).sendKeys('50000');
		await element(by.name("website")).click();
		await element(by.name("website")).sendKeys('https://plant-for-the-planet.org');
		await element(by.name("description")).click();
		await element(by.name("description")).sendKeys('This is a test project.');
		await element(by.xpath("//div[@id='__next']/div/div[2]/div/div/div/div/div/div/div/form/div/div[6]/div/div/div[2]/div")).click();
		await element(by.xpath("(//input[@value=''])[8]")).click();
		(await driver).sleep(100);
    await element(by.id("basicDetailsCont")).click();
    await driver.wait(until.elementLocated(By.id('donateContinueButton')), 10000).click();
    await driver.wait(until.elementLocated(By.xpath("//*[text()='Thank You']")), 50000).getText().then((title) => {
      expect(title).toBe('Thank You');
      if (title.includes('Thank You')) {
        driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title contains header!"}}');
      } else {
        driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Title does not contain header!"}}');
      }
    });
    await driver.quit();
  });
});
