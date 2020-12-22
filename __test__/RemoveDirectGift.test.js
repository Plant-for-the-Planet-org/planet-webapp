const { By, until } = require('selenium-webdriver');
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
    await driver.wait(until.elementLocated(By.className('donateButton'))).click();
    await driver.switchTo().activeElement();
    await driver.findElement(By.xpath("//*[text()='Remove']")).click();
    // await driver.findElement(By.name('checkedA')).click();
    // load().then(() => {
      // const url = driver.getCurrentUrl().then(() => {
      //   driver.navigate().to(`${url}s/sagar-aryal`).then(() => {
      //     const val = donateButton().then(() => {
      //       val.click().then(() => {
      //         driver.switchTo().activeElement().then(() => {
      //           driver.findElement(By.xpath("//*[text()='Remove']")).click().then(() => {
                  driver.findElement(By.name('checkedA')).click().then(() => {
                    driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Action successful"}}');
                  });
      //           });
      //         });
      //       });
      //     });
      //   });
      // });
    // });
  });
});
