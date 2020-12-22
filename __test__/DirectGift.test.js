const { By, until } = require('selenium-webdriver');
const { driver } = require('./helper');
const { load } = require('./Pages');

describe('direct gift', () => {
  // beforeEach(async () => {
  //   await load();
  // });
  it('should direct gift', async () => {
    load().then(async () => {
      const url = await driver.getCurrentUrl();
      await driver.navigate().to(`${url}s/sagar-aryal`);
      // const val = donateButton().then(async () => {
      //   await val.click(); 
      // });
      await driver.wait(until.elementLocated(By.className('donateButton'))).click();
      await driver.switchTo().activeElement();
      await driver.wait(until.elementLocated(By.id('treeDonateContinue')), 10000).click();
      await driver.findElement(By.name('firstName')).sendKeys('Bright');
      await driver.findElement(By.name('lastName')).sendKeys('Amidiagbe');
      await driver.findElement(By.name('email')).sendKeys('captainamiedi1@gmail.com');
      await driver.findElement(By.name('address')).sendKeys('43 block');
      await driver.findElement(By.name('city')).sendKeys('surulere');
      const country = await driver.findElement(By.name('countrydropdown'));
      await country.click();
      await country.clear();
      await country.sendKeys('Netherlands');
      await driver.findElement(By.name('zipCode')).sendKeys('94203'); // for netherland 6176 ZG
      const val3 = await driver.findElement(By.xpath("//*[text()='Continue']"));
      await val3.click();
      await driver.switchTo().activeElement();
      await driver.wait(until.elementLocated(By.xpath("//div[@id='cardNumber']/div/input"))).sendKeys('4242424242424242');
      await driver.wait(until.elementLocated(By.xpath("//div[@id='expiry']/div/input"))).sendKeys('1123');
      await driver.wait(until.elementLocated(By.xpath("//div[@id='cvc']/div/input"))).sendKeys('1111');
      await driver.wait(until.elementLocated(By.className('PaymentDetails_continueButton__2eFJF'))).click();
      driver.wait(until.elementLocated(By.xpath("//*[text()='Thank You']")), 50000).getText().then((title) => {
        expect(title).toBe('Thank You');
        if (title.includes('Thank You')) {
          driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title contains header!"}}');
        } else {
          driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Title does not contain header!"}}');
        }
      });
    });
  });
});
