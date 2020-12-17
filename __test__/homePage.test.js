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
    const val = await donateButton();
    await val.click();
    await driver.switchTo().activeElement();
    await driver.wait(until.elementLocated(By.id('treeDonateContinue')), 20000).click();
    await driver.findElement(By.name('firstName')).sendKeys('Bright');
    await driver.findElement(By.name('lastName')).sendKeys('Amidiagbe');
    await driver.findElement(By.name('email')).sendKeys('captainamiedi1@gmail.com');
    await driver.findElement(By.name('address')).sendKeys('43 block');
    await driver.findElement(By.name('city')).sendKeys('surulere');
    await driver.findElement(By.name('zipCode')).sendKeys('99501'); //for netherland 6176 ZG
    const val1 = await driver.findElement(By.xpath("//*[text()='Continue']"));
    await val1.click();
    // await driver.findElement(By.xpath("//div[@id='cardNumber']/div/input")).clear();
    // await driver.findElement(By.xpath("//div[@id='cardNumber']/div/input")).click();
    await driver.findElement(By.xpath("//div[@id='cardNumber']/div/input")).sendKeys('42424242424242424242');
    await driver.findElement(By.xpath("//div[@id='expiry']/div/input")).sendKeys('11234');
    await driver.findElement(By.xpath("//div[@id='cvc']/div/input")).sendKeys('1111');
    // const val2 = await driver.wait(until.elementLocated(By.className('PaymentDetails_continueButton__2eFJF')), 10000);
    // await driver.sleep(100);
    const val2 = await driver.findElement(By.className('PaymentDetails_continueButton__2eFJF'));
    await val2.click();
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