const { By, until } = require('selenium-webdriver');
const { driver } = require('./helper');
const { load } = require('./Pages');
const { donateButton } = require('./Pages/homePage');

describe('Gift Trees', () => {
  beforeEach(async () => {
    await load();
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
    await driver.findElement(By.name('zipCode')).sendKeys('99501'); //for netherland 6176 ZG
    const val3 = await driver.findElement(By.xpath("//*[text()='Continue']"));
    await val3.click();
    // await driver.findElement(By.xpath("//div[@id='cardNumber']/div/input")).clear();
    // await driver.findElement(By.xpath("//div[@id='cardNumber']/div/input")).click();
    // await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//div[@id='cardNumber']/div/input")))).sendKeys('4242424242424242');
    // (await driver).sleep(20);
    await driver.findElement(By.xpath("//div[@id='cardNumber']/div/input")).sendKeys('4242424242424242');
    await driver.findElement(By.xpath("//div[@id='expiry']/div/input")).sendKeys('11234');
    await driver.findElement(By.xpath("//div[@id='cvc']/div/input")).sendKeys('1111');
    // const val2 = await driver.wait(until.elementLocated(By.className('PaymentDetails_continueButton__2eFJF')), 10000);
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
