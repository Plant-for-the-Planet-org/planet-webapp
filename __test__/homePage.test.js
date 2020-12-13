import webdriver from 'selenium-webdriver';
import {
  driver,
} from './helper';
import {donateButton, header, donateContinue, firstName} from './Pages/homePage'
import {load} from './Pages/index'

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
  //   });
  // it('should load homepage', () => {
  //   driver.get('https://www.trilliontreecampaign.org/').then(() => {
  //     driver.getTitle().then((title) => {
  //       expect(title).toBe("Together let's plant a Trillion Trees!");
  //       testStatus = true;
  //       // driver.quit();
  //     });
  //   });
  // });
  it('shoulc click on donate', async () => {
    // driver.get('https://www.trilliontreecampaign.org/').then(async () => {
      // const value = await header();
      //   console.log(value, 'donate');
        const val = await donateButton();
       await val.click();
       const val1 = await donateContinue();
      //  await val1.click();
      //  const firstNameValue = await firstName().sendKeys('Bright');
        console.log(val1);
        // expect(donate).toBeTruthy();
        // driver.findElement(By.className('continueButton')).click().then((cutt) => {
        //   console.log(cutt)
        // })
      // })
      // const cont = await driver.findElement(By.className('continueButton')).click();
      // console.log(donate, cont);
    // });
  });
});
// HTTP Server should be running on 8099 port of GitHub runner
// driver.get('https://www.trilliontreecampaign.org/').then(function () {
//   driver.getTitle().then(function (title) {
//     console.log(title);
//     expect(title).toBe("Together let's plant a Trillion Trees!");
//     driver.quit();
//   });
// });
