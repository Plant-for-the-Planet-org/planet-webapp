import { driver } from './helper';
import { load } from './Pages/index';

describe('homepage', () => {
  let testStatus = false;
  afterEach(() => {
    if (testStatus) {
      driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Yaay! my sample test passed"}}');
    } else {
      driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Test failed!"}}');
    }
    testStatus = false;
  });
  it('should show the right title', async () => {
    await load();
    expect(await driver.getTitle()).toBe("Together let's plant a Trillion Trees!");
    testStatus = true;
  });
});
