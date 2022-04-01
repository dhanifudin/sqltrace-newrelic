require('dotenv').config();

const puppeteer = require('puppeteer');
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const headless = false;
const baseUrl = 'https://one.newrelic.com';
const queryUrl = process.env.QUERY_URL;

(async () => {

  const browser = await puppeteer.launch({
    product: 'chrome',
    headless,
    defaultViewport: null,
    ignoreHTTPSErrors: true,
    acceptInsecureCerts: true,
  });

  console.log('initialized browser')

  const page = await browser.newPage();

  const login = async (username, password) => {
    console.log('logging in')
    try {
      await page.goto(baseUrl);
      await page.waitForTimeout(3000);
      await page.type('#login_email', username);
      await page.click('#login_submit');
      await page.waitForTimeout(3000);
      await page.type('#login_password', password);
      await page.click('#login_submit');
    } catch (error) {
      console.error(error);
    }
  };

  const queryData = async () => {
    try {
      await page.waitForTimeout(10000);
      await page.goto(queryUrl);
      await page.waitForTimeout(6000);
      const query = `SELECT * FROM SqlTrace order by timestamp asc SINCE '2022-03-28 23:50:00' UNTIL '2022-03-28 23:59:59' WITH TIMEZONE 'Asia/Jakarta'`
      const existingQuery = 'SELECT';
      for (let i = 0; i < existingQuery.length; i++) {
        await page.keyboard.press('Backspace');
      }
      await page.type('textarea.ace_text-input', query);
      const [runButton] = await page.$x('//button[contains(., "Run")]');
      if (runButton) {
        await runButton.click();
        const moreButton = await page.waitForSelector('button#dropdown-6');
        moreButton.click();
      }
    } catch (error) {
      console.error(error);
    }
  }

  await login(username, password);
  await queryData();
})();