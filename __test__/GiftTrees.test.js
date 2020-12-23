const { By, until, Key } = require('selenium-webdriver');
const { driver } = require('./helper');
const { load } = require('./Pages');
const { donateButton } = require('./Pages/homePage');

describe('Gift Trees', () => {
  beforeEach(async () => {
    await load();
  });
  it('should gift form', async () => {
    // load().then(async () => {
    const url = await driver.getCurrentUrl();
    await driver.navigate().to(`${url}s/sagar-aryal`);
    // const val = await donateButton();
    // await val.click();
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
    const cardEnable = await driver.wait(until.elementIsEnabled(cardNumber));
    (await driver).sleep(1000);
    await cardEnable.sendKeys('424242424242424242');
    // }
    const cardNo = '4';
    for (let i = 0; i < cardNo.length; i++) {
      cardEnable.sendKeys(cardNo.charAt(i));
    }
    (await driver).sleep(100);
    const expiry = await driver.wait(until.elementLocated(By.xpath("//div[@id='expiry']/div/input")), 10000);
    const expiryDate = await driver.wait(until.elementIsEnabled(expiry));
    const cardExpiry = '445';
    for (let i = 0; i < cardExpiry.length; i++) {
      expiryDate.sendKeys(cardExpiry.charAt(i));
    }
    await expiryDate.sendKeys('4444');
    (await driver).sleep(100);
    const cvc = await driver.wait(until.elementLocated(By.xpath("//div[@id='cvc']/div/input")), 10000);
    await cvc.sendKeys('1111');
    (await driver).sleep(100);
    await driver.wait(until.elementLocated(By.className('PaymentDetails_continueButton__2eFJF')), 10000).click();
    driver.wait(until.elementLocated(By.xpath("//*[text()='Thank You']")), 50000).getText().then((title) => {
      expect(title).toBe('Thank You');
      if (title.includes('Thank You')) {
        driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title contains header!"}}');
      } else {
        driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Title does not contain header!"}}');
      }
    });
    // });
    // console.log(val3);
  });
  // it('should remove gift direct', async() => {
  //   const url = await driver.getCurrentUrl();
  //   await driver.navigate().to(`${url}s/sagar-aryal`);
  //   const val = await donateButton();
  //   await val.click();
  //   await driver.switchTo().activeElement();
  //   await driver.findElement(By.name('checkedA')).click();
  //   await driver.findElement(By.xpath("//*[text()='Remove']")).click();
  //   await driver.quit();
  //   driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Action successful"}}');
  //   // await val;
  //   // console.log(val1);
  // });
  // it('should direct gift', async () => {
  //   const url = await driver.getCurrentUrl();
  //   await driver.navigate().to(`${url}s/sagar-aryal`);
  //   const val = await donateButton();
  //   await val.click();
  //   await driver.switchTo().activeElement();
  //   await driver.wait(until.elementLocated(By.id('treeDonateContinue')), 10000).click();
  //   await driver.findElement(By.name('firstName')).sendKeys('Bright');
  //   await driver.findElement(By.name('lastName')).sendKeys('Amidiagbe');
  //   await driver.findElement(By.name('email')).sendKeys('captainamiedi1@gmail.com');
  //   await driver.findElement(By.name('address')).sendKeys('43 block');
  //   await driver.findElement(By.name('city')).sendKeys('surulere');
  //   await driver.findElement(By.name('zipCode')).sendKeys('6176 ZG'); //for netherland
  //   const val3 = await driver.findElement(By.xpath("//*[text()='Continue']"));
  //   await val3.click();
  //   // await driver.findElement(By.xpath("//div[@id='cardNumber']/div/input")).clear();
  //   // await driver.findElement(By.xpath("//div[@id='cardNumber']/div/input")).click();
  //   await driver.findElement(By.xpath("//div[@id='cardNumber']/div/input")).sendKeys('42424242424242424242');
  //   await driver.findElement(By.xpath("//div[@id='expiry']/div/input")).sendKeys('11234');
  //   await driver.findElement(By.xpath("//div[@id='cvc']/div/input")).sendKeys('1111');
  //   // const val2 = await driver.wait(until.elementLocated(By.className('PaymentDetails_continueButton__2eFJF')), 10000);
  //   const val2 = await driver.findElement(By.className('PaymentDetails_continueButton__2eFJF'));
  //   await val2.click();
  //   await driver.wait(until.elementLocated(By.xpath("//*[text()='Thank You']")), 50000).getText().then((title) => {
  //     expect(title).toBe('Thank You');
  //     if (title.includes('Thank You')) {
  //       driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title contains header!"}}');
  //     } else {
  //       driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Title does not contain header!"}}');
  //     }
  //   });
  // })
});

// describe('remove', () => {
//   beforeEach(async () => {
//     await load();
//   });
//   it('should remove gift direct', async() => {
//     const url = await driver.getCurrentUrl();
//     await driver.navigate().to(`${url}s/sagar-aryal`);
//     const val = await donateButton();
//     await val.click();
//     await driver.switchTo().activeElement();
//     await driver.findElement(By.name('checkedA')).click();
//     await driver.findElement(By.xpath("//*[text()='Remove']")).click();
//     await driver.quit();
//     driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Action successful"}}');
//     // await val;
//     // console.log(val1);
//   });
// })
