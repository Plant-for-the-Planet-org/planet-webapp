const { By, until, Key } = require('selenium-webdriver');
const { driver } = require('./helper');
const { load } = require('./Pages');

describe('hompage', () => {
  beforeEach(async () => {
    await load();
  });
  it('should click on donate', async () => {
    await driver.wait(until.elementLocated(By.className('donateButton'))).click();
    await driver.switchTo().activeElement();
    await driver.wait(until.elementLocated(By.id('treeDonateContinue')), 20000).click();
    await driver.findElement(By.name('firstName')).sendKeys('Peter');
    await driver.findElement(By.name('lastName')).sendKeys('Planter');
    await driver.findElement(By.name('email')).sendKeys('peter.planter@gmail.com');
    await driver.findElement(By.name('address')).sendKeys('Am Bahnhof 1');
    await driver.findElement(By.name('city')).sendKeys('Uffing am Staffelsee');
    const country = await driver.findElement(By.name('countrydropdown'));
    await country.click();
    await country.clear();
    await country.sendKeys(Key.CONTROL + "a");;
    await country.sendKeys(Key.DELETE);
    await country.sendKeys('Germany');
    await country.sendKeys(Key.RETURN);
    await driver.findElement(By.name('zipCode')).sendKeys('82449');
    const val1 = await driver.findElement(By.xpath("//*[text()='Continue']"));
    await val1.click();
    await driver.switchTo().activeElement();
    (await driver).sleep(100);

    await driver.wait(until.elementLocated(By.xpath("//*[@id='cardNumber']/div/iframe")));
    await driver.switchTo().frame(driver.findElement(By.xpath("//*[@id='cardNumber']/div/iframe")));
    await driver.wait(until.elementLocated(By.name('cardnumber')));
    const cardNumber = await driver.findElement(By.name('cardnumber'));
    const cardEnabled = await driver.wait(until.elementIsEnabled(cardNumber));
    await cardEnabled.sendKeys('4242424242424242');      
    await driver.switchTo().defaultContent();

    await driver.switchTo().frame(driver.findElement(By.xpath("//*[@id='expiry']/div/iframe"))); 
    const expiryDate = await driver.findElement(By.name('exp-date'));
    const expiryDateEnabled = await driver.wait(until.elementIsEnabled(expiryDate));
    await expiryDateEnabled.sendKeys('424');
    await driver.switchTo().defaultContent();
    
    await driver.switchTo().frame(driver.findElement(By.xpath("//*[@id='cvc']/div/iframe"))); 
    const cvc = await driver.findElement(By.name('cvc'));
    const cvcEnabled = await driver.wait(until.elementIsEnabled(cvc));
    await cvcEnabled.sendKeys('242');
    await driver.switchTo().defaultContent();

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
    await driver.quit();
  });
});
