const { By, until, Key } = require('selenium-webdriver-3');
const { driver } = require('./helper');
const { load } = require('./Pages');

describe('manage-project', () => {
  beforeEach(async () => {
    await load();
  });
  it('should create a project and update data for a project.', async () => {
    const url = await driver.getCurrentUrl();
    await driver.navigate().to(`${url}/login`);
    (await driver).sleep(200);
    //Login Process
    await driver.findElement(By.id('username')).sendKeys('test-tpo@plant-for-the-planet.org');
    await driver.findElement(By.name('action')).click();
    await driver.findElement(By.id('password')).sendKeys('CcCFg2enJ@C7XrV3ukqHbYYbaN-2hBW7hh6_Ye8kBorZAwczZfdM*TJnMLdgpbi');
    await driver.findElement(By.name('action')).click();
    (await driver).sleep(200);

    //Start Project Creation
    await driver.findElement(By.id('addProjectBut')).click();
    await driver.findElement(By.name('name')).sendKeys('Test Project 200');
    await driver.findElement(By.name('slug')).sendKeys('test-project-200');
    await driver.findElement(By.name('countTarget')).sendKeys('50000');
    await driver.findElement(By.name('website')).sendKeys('https://plant-for-the-planet.org');
    await driver.findElement(By.name('description')).sendKeys('This is a test descrtiption for a test Project.');

    // Skip acceptDonation change this after project is sent for review
    await driver.findElement(By.name('projectCoords.latitude')).sendKeys('21.819612325842368');
    await driver.findElement(By.name('projectCoords.longitude')).sendKeys('25.52054272496909');
    // Skip publish project and allow Site Visit
    // Submit Project
    await driver.findElement(By.id('basicDetailsCont')).click();
    (await driver).sleep(200);

    await driver.findElement(By.name('youtubeURL')).sendKeys('https://www.youtube.com/watch?v=svNcrAowh2s');
    //Todo add images
    await driver.findElement(By.id('SaveAndCont')).click();
    (await driver).sleep(200);

    // Skipping Year of Abandonment
    // Skipping First Tree Planted
    await driver.findElement(By.name('plantingDensity')).sendKeys('200');
    await driver.findElement(By.name('employeesCount')).sendKeys('10');
    await driver.findElement(By.name('employeesCount')).sendKeys('10');

    //Todo add identifiers in planting seasons.

    await driver.findElement(By.name('mainChallenge')).sendKeys('Our Main Challenge is example');
    await driver.findElement(By.name('motivation')).sendKeys('Our Motivation is example');

    //Todo add identifiers for site owner selection

    await driver.findElement(By.name('siteOwnerName')).sendKeys('Project Site Owner');

    //Skipping Acquisition Year and Degredation Year
    await driver.findElement(By.name('degradationCause')).sendKeys('Deforestation');
    await driver.findElement(By.name('longTermPlan')).sendKeys('Increase Survival Rate');

    //Skipping Certification
    (await driver).sleep(100);
    //Todo Button is missing identifier/name

    //Skip Project Sites
    //Todo Submit for Review (btn missing identifiers)

    //Todo Fix the conditions below.
    //Expect: Your project is under review, kindly wait. ( if true, pass the test.)
    await element(by.id("basicDetailsCont")).click();
    await driver.wait(until.elementLocated(By.id('donateContinueButton')), 10000).click();
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
