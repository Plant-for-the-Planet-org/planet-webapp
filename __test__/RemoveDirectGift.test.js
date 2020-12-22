const { By } = require('selenium-webdriver');
const { driver } = require('./helper');
const { load } = require('./Pages');
const { donateButton } = require('./Pages/homePage');

describe('remove', () => {
  beforeEach(async () => {
    await load();
  });
  it('should remove gift direct', async () => {
    // load().then(() => {
      const url = driver.getCurrentUrl().then(() => {
        driver.navigate().to(`${url}s/sagar-aryal`).then(() => {
          const val = donateButton().then(() => {
            val.click().then(() => {
              driver.switchTo().activeElement().then(() => {
                driver.findElement(By.xpath("//*[text()='Remove']")).click().then(() => {
                  driver.findElement(By.name('checkedA')).click().then(() => {
                    driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Action successful"}}');
                  });
                });
              });
            });
          });
        });
      });
    // });
  });
});
