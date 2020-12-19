import webdriver, { By, until } from 'selenium-webdriver';
import {
  driver,
} from './helper';
import {
  donateButton, header, donateContinue, firstName,
} from './Pages/homePage';
import { load } from './Pages/index';

describe('hompage', () => {
  beforeEach(async () => {
    await load();
  });
  // let testStatus = false;
  // afterEach(() => {
  //   if (testStatus) {
  //     driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Yaay! my sample test passed"}}');
  //   } else {
  //     driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Test failed!"}}');
  //   }
  //   testStatus = false;
  // });
  // // });
  // it('should load homepage', () => {
  //   // driver.get('https://www.trilliontreecampaign.org/').then(() => {
  //     driver.getTitle().then((title) => {
  //       expect(title).toBe("Plant trees around the world - Plant-for-the-Planet");
  //       testStatus = true;
  //       // driver.quit();
  //     });
  //   // });
  // });
  it('shoulc click on donate', async () => {
    load().then(async () => {
      const val = await donateButton();
      await val.click();
      await driver.switchTo().activeElement();
      await driver.wait(until.elementLocated(By.id('treeDonateContinue')), 20000).click();
      await driver.findElement(By.name('firstName')).sendKeys('Bright');
      await driver.findElement(By.name('lastName')).sendKeys('Amidiagbe');
      await driver.findElement(By.name('email')).sendKeys('captainamiedi1@gmail.com');
      await driver.findElement(By.name('address')).sendKeys('43 block');
      await driver.findElement(By.name('city')).sendKeys('surulere');
      await driver.findElement(By.name('zipCode')).sendKeys('94203'); // for netherland 6176 ZG
      const val1 = await driver.findElement(By.xpath("//*[text()='Continue']"));
      await val1.click();
      await driver.switchTo().activeElement();
      const cardNumber = driver.wait(until.elementLocated(By.xpath("//div[@id='cardNumber']/div/input"))).isEnabled().then((value) => {
        cardNumber.sendKeys('4242424242424242');
      });
      const expiryDate = driver.wait(until.elementLocated(By.xpath("//div[@id='expiry']/div/input"))).isEnabled().then((value) => {
        expiryDate.sendKeys('1123');
      });
      const cvc = driver.wait(until.elementLocated(By.xpath("//div[@id='cvc']/div/input"))).isEnabled().then((value) => {
        cvc.sendKeys('1111');
      });
      driver.wait(until.elementLocated(By.className('PaymentDetails_continueButton__2eFJF'))).isDisplayed().then((value) => {
        value.click();
      });
      await driver.wait(until.elementLocated(By.xpath("//*[text()='Thank You']")), 50000).getText().then((title) => {
        expect(title).toBe('Thank You');
        if (title.includes('Thank You')) {
          driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title contains header!"}}');
        } else {
          driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Title does not contain header!"}}');
        }
      });
    });
  });
  it('should direct gift', async () => {
    load().then(async () => {
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
      const cardNumber = driver.wait(until.elementLocated(By.xpath("//div[@id='cardNumber']/div/input"))).isEnabled().then((value) => {
        cardNumber.sendKeys('4242424242424242');
      });
      const expiryDate = driver.wait(until.elementLocated(By.xpath("//div[@id='expiry']/div/input"))).isEnabled().then((value) => {
        expiryDate.sendKeys('1123');
      });
      const cvc = driver.wait(until.elementLocated(By.xpath("//div[@id='cvc']/div/input"))).isEnabled().then((value) => {
        cvc.sendKeys('1111');
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
    });
  });
  it ('should gift form', async () => {
    await load();
    const val = await donateButton();
    await val.click();
    await driver.switchTo().activeElement();
    const val1 = await driver.findElement(By.name('checkedA'));
    await val1.click();
    await driver.findElement(By.name('recipientName')).sendKeys('Gift simon');
    await driver.findElement(By.name('email')).sendKeys('bright.amidiagbe@plant-for-the-planet.org');
    await driver.findElement(By.name('giftMessage')).sendKeys('Special gift to you my friend');
    await driver.wait(until.elementLocated(By.id('treeDonateContinue')), 10000).click();
    await driver.findElement(By.name('firstName')).sendKeys('Bright');
    await driver.findElement(By.name('lastName')).sendKeys('Amidiagbe');
    await driver.findElement(By.name('email')).sendKeys('captainamiedi1@gmail.com');
    await driver.findElement(By.name('address')).sendKeys('43 block');
    await driver.findElement(By.name('city')).sendKeys('surulere');
    await driver.findElement(By.name('zipCode')).sendKeys('94203'); //for netherland 6176 ZG
    const val3 = await driver.findElement(By.xpath("//*[text()='Continue']"));
    await val3.click();
    await driver.switchTo().activeElement();
    driver.wait(until.elementLocated(By.xpath("//div[@id='cardNumber']/div/input"))).isEnabled().then((value) => {
      value.sendKeys('4242424242424242');
    });
    driver.wait(until.elementLocated(By.xpath("//div[@id='expiry']/div/input"))).isEnabled().then((value) => {
      value.sendKeys('1123');
    });
    driver.wait(until.elementLocated(By.xpath("//div[@id='cvc']/div/input"))).isEnabled().then((value) => {
      value.sendKeys('1111');
    });
    driver.wait(until.elementLocated(By.className('PaymentDetails_continueButton__2eFJF'))).isDisplayed().then((value) => {
      value.click();
    });
    await driver.wait(until.elementLocated(By.xpath("//*[text()='Thank You']")), 50000).getText().then((title) => {
      expect(title).toBe('Thank You');
      if (title.includes('Thank You')) {
        driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title contains header!"}}');
      } else {
        driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Title does not contain header!"}}');
      }
    });
    // console.log(val3);
  });
});
