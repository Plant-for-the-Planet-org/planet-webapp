const { By } = require('selenium-webdriver');
const { driver } = require('./helper');
const { load } = require('./Pages');
const { donateButton } = require('./Pages/homePage');

describe('remove', () => {
  beforeEach(async () => {
    await load();
  });
  it('should remove gift direct', async () => {
    const url = await driver.getCurrentUrl();
    await driver.navigate().to(`${url}s/sagar-aryal`);
    const val = await donateButton();
    await val.click();
    await driver.switchTo().activeElement();
    await driver.findElement(By.xpath("//*[text()='Remove']")).click();
    await driver.findElement(By.name('checkedA')).click();
    // await driver.quit();
    driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Action successful"}}');
    // await val;
    // console.log(val1);
  });
});
