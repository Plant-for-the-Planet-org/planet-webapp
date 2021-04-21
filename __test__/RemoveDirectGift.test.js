const { By, until } = require('selenium-webdriver-3');
const { driver } = require('./helper');
const { load } = require('./Pages');

describe('remove', () => {
  beforeEach(async () => {
    await load();
  });
  it('should remove gift direct', async () => {
    const url = await driver.getCurrentUrl();
    await driver.navigate().to(`${url}s/sagar-aryal`);
    await driver.wait(until.elementLocated(By.className('donateButton'))).click();
    await driver.switchTo().activeElement();
    await driver.wait(until.elementLocated(By.id('singleGiftRemoveId')));
    //await driver.findElement(By.xpath("//*[text()='Remove']")).click();
    await driver.findElement(By.id('singleGiftRemoveId')).click();
    await driver.wait(until.elementLocated(By.id('checkedA')));
    await driver.findElement(By.id('checkedA')).click().then(() => {
      driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Action successful"}}');
    });
    await driver.quit();
  });
});
