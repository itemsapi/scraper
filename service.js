const puppeteer = require('puppeteer');
const Promise = require('bluebird');
const _ = require('lodash');
const cheerio = require('cheerio');
const defaultCheerioOptions = {
  normalizeWhitespace: false,
  xmlMode: false,
  decodeEntities: true
};

module.exports.start = async function(data) {

  var browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    //executablePath: '/home/cigolpl/Downloads/chrome-linux/chrome',
    userDataDir: './profiles',
  });

  console.log(data);

  var pages = await browser.pages()
  var page = pages[0];

  await page.setViewport({
    width: 1920,
    height: 1080
  });

  var userAgent = data.user_agent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
  await page.setUserAgent(userAgent);

  var i = 1;
  var result = [];

  await Promise.all(data.urls)
  .map(async url => {
    await page.goto(url);

    if (i < 2) {
      await page.waitFor(data.login_time);
    } else {
      await page.waitFor(data.delay);
    }

    ++i;

    var html = await page.content();

    if (data.page_function) {
      var $ = cheerio.load(html, defaultCheerioOptions);
      var local;

      try {
        local = data.page_function($);
      } catch (e) {
        console.log('bug happened');
        console.log(e);
        return;
      }

      if (_.isArray(local)) {
        local.forEach(v => {

          if (!_.isObject(v)) {
            v = {
              result: v
            }
          }

          v.given_url = url;
          result.push(v);
        })
      } else {

        if (!_.isObject(local)) {
          local = {
            result: local
          }
        }

        local.given_url = url;
        result.push(local);
      }

    }
  }, {concurrency: 1})

  var cookies = await page.cookies()
  //console.log(cookies);
  //console.log(_.map(cookies, 'name'));
  //console.log(_.map(cookies, 'value'));

  await page.close();
  await browser.close();

  return result;
}
