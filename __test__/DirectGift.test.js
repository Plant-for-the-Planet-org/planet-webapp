const { By, until, Key } = require('selenium-webdriver');
const { driver } = require('./helper');
const { load } = require('./Pages');

describe('direct gift', () => {
  beforeEach(async () => {
    await load();
  });
  it('should direct gift', async () => {
    // load().then(async () => {
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
    await country.sendKeys(Key.CONTROL + "a");;
    await country.sendKeys(Key.DELETE);
    await country.sendKeys('United States of America');
    await country.sendKeys(Key.RETURN);
    await driver.findElement(By.name('zipCode')).sendKeys('85001'); // for netherland 6176 ZG
    const val3 = await driver.findElement(By.xpath("//*[text()='Continue']"));
    await val3.click();
    await driver.switchTo().activeElement();
    (await driver).sleep(100);
    // await driver.wait(until.elementLocated(By.xpath("//div[@id='cardNumber']/div/input"))).sendKeys('4242424242424242');
    const cardNumber = await driver.wait(until.elementLocated(By.xpath("//div[@id='cardNumber']/div/input")), 10000);
    const cardEnabled = await driver.wait(until.elementIsEnabled(cardNumber));
    await cardEnabled.sendKeys('424242424242424242');
    const expiryDate = await driver.wait(until.elementLocated(By.xpath("//div[@id='expiry']/div/input")), 10000);
    const expiryDateEnabled = await driver.wait(until.elementIsEnabled(expiryDate));
    await expiryDateEnabled.sendKeys('444');
    const cvc = await driver.wait(until.elementLocated(By.xpath("//div[@id='cvc']/div/input")), 10000);
    const cvcEnabled = await driver.wait(until.elementIsEnabled(cvc));
    await cvcEnabled.sendKeys('111');
    (await driver).sleep(100);
    await driver.wait(until.elementLocated(By.className('PaymentDetails_continueButton__2eFJF')), 10000).click();
    await driver.wait(until.elementLocated(By.xpath("//*[text()='Thank You']")), 50000).getText().then((title) => {
      expect(title).toBe('Thank You');
      if (title.includes('Thank You')) {
        driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title contains header!"}}');
      } else {
        driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Title does not contain header!"}}');
      }
    });
  });
  // });
});
