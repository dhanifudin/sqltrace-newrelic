const puppeteer = require('puppeteer')
const headless = false
const baseUrl = 'https://one.newrelic.com'

class BrowserHandler {
  constructor(browser, page) {
    this.browser = browser
    this.page = page
    this.login = this.login.bind(this)
  }

  async login(username, password) {
    try {
      await this.page.goto(baseUrl)
      await this.page.waitForTimeout(1000)
      await this.page.type('#login_email', username)
      await this.page.click('#login_submit')
      await this.page.waitForTimeout(1000)
      await this.page.type('#login_password', password)
      await this.page.click('#login_submit')
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = BrowserHandler