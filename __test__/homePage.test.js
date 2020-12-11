import {
  driver
} from './helper';

describe('hompage', () => {
  let testStatus = false;
  afterEach(() => {
    if (testStatus) {
      driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Yaay! my sample test passed"}}');
    } else {
      driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Test failed!"}}');
    }
    testStatus = false;
  });
  //   });
  it('should load homepage', () => {
    driver.get('https://www.trilliontreecampaign.org/').then(function () {
      driver.getTitle().then(function (title) {
        expect(title).toBe("Together let's plant a Trillion Trees!");
        testStatus = true
        // driver.quit();
      });
    });
  })
})
// HTTP Server should be running on 8099 port of GitHub runner
// driver.get('https://www.trilliontreecampaign.org/').then(function () {
//   driver.getTitle().then(function (title) {
//     console.log(title);
//     expect(title).toBe("Together let's plant a Trillion Trees!");
//     driver.quit();
//   });
// });