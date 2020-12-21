import "@testing-library/jest-dom/extend-expect";
// import "@testing-library/react/cleanup-after-each";
import dotenv from 'dotenv';
import { driver } from "./__test__/helper";

dotenv.config({ path: '.env' });
jest.setTimeout(300000);

afterAll(async () => {
    await driver.quit()
})