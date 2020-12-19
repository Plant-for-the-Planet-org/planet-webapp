const { By, until } = require('selenium-webdriver');
const { driver } = require('./helper');
const { load } = require('./Pages');
const { donateButton } = require('./Pages/homePage');

describe('direct gift', () => {
  beforeEach(async () => {
    await load();
  });
  it('should direct gift', async () => {
    const url = await driver.getCurrentUrl();
    await driver.navigate().to(`${url}s/sagar-aryal`);
    const val = await donateButton();
    await val.click();
    await driver.switchTo().activeElement();
    await driver.wait(until.elementLocated(By.id('treeDonateContinue')), 10000).click();
    await driver.findElement(By.name('firstName')).sendKeys('Bright');
    await driver.findElement(By.name('lastName')).sendKeys('Amidiagbe');
    await driver.findElement(By.name('email')).sendKeys('captainamiedi1@gmail.com');
    await driver.findElement(By.name('address')).sendKeys('43 block');
    await driver.findElement(By.name('city')).sendKeys('surulere');
    await driver.findElement(By.name('zipCode')).sendKeys('94203'); // for netherland 6176 ZG
    const val3 = await driver.findElement(By.xpath("//*[text()='Continue']"));
    await val3.click();
    await driver.switchTo().activeElement();
    driver.wait(until.elementLocated(By.xpath("//div[@id='cardNumber']/div/input"))).isEnabled().then((value) => {
      value.sendKeys('4242424242424242');
    })
    driver.wait(until.elementLocated(By.xpath("//div[@id='expiry']/div/input"))).isEnabled().then((value) => {
      value.sendKeys('1123');
    });
    driver.wait(until.elementLocated(By.xpath("//div[@id='cvc']/div/input"))).isEnabled().then((value) => {
      value.sendKeys('1111');
    });
    driver.wait(until.elementLocated(By.className('PaymentDetails_continueButton__2eFJF'))).isDisplayed().then((value) => {
      value.click();
    });
    driver.wait(until.elementLocated(By.xpath("//*[text()='Thank You']")), 50000).getText().then((title) => {
      expect(title).toBe('Thank You');
      if (title.includes('Thank You')) {
        driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title contains header!"}}');
      } else {
        driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Title does not contain header!"}}');
      }
    });
  })
});
