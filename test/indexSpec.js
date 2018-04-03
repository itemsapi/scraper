'use strict';

var assert = require('assert');
const puppeteer = require('puppeteer');
const service = require('./../service')
const Promise = require('bluebird');
const PORT = 3080;

const express = require('express')
const app = express()

describe('service', function() {

  before(async function() {

    app.get('/', (req, res) => {
      res.send('<p>Hello World!</p>');
    })

    app.get('/rows', (req, res) => {
      res.send('<p>one</p><p>two</p>');
    })

    await new Promise(resolve => {
      app.listen(PORT, () => {
        return resolve();
      })
    })
  })

  after(async function() {
    //await browser.close();
  })

  it('open page and check results', async function test() {

    var result = await service.start({
      urls: [`http://127.0.0.1:${PORT}`],
      page_function: function($) {
        return {
          hello: $('p').text()
        }
      },
      delay: 0,
      login_time: 0
    })

    assert.deepEqual(result, [{
      hello: 'Hello World!',
      given_url: `http://127.0.0.1:${PORT}`
    }]);
  })

  it('open page and check results', async function test() {

    var result = await service.start({
      urls: [`http://127.0.0.1:${PORT}`],
      page_function: function($) {
        return $('p').text();
      },
      delay: 0,
      login_time: 0
    })

    assert.deepEqual(result, [{
      result: 'Hello World!',
      given_url: `http://127.0.0.1:${PORT}`
    }]);
  })

  it('multiple rows', async function test() {

    var result = await service.start({
      urls: [`http://127.0.0.1:${PORT}/rows`],
      page_function: function($) {
        var result = [];
        $("p").each(function() {
          result.push({
            name: $(this).text(),
          });
        });

        return result;
      },
      delay: 0,
      login_time: 0
    })
    console.log(result);

    assert.deepEqual(result, [ {
      name: 'one', given_url: 'http://127.0.0.1:3080/rows'
    }, {
      name: 'two', given_url: 'http://127.0.0.1:3080/rows'
    }]);
  })

  it('multiple rows and multi urls', async function test() {

    var result = await service.start({
      urls: [
        `http://127.0.0.1:${PORT}/rows`,
        `http://127.0.0.1:${PORT}/rows`
      ],
      page_function: function($) {
        var result = [];
        $("p").each(function() {
          result.push({
            name: $(this).text(),
          });
        });

        return result;
      },
      delay: 0,
      login_time: 0
    })

    assert.deepEqual(result.length, 4);
  })

  it('multiple rows and multi urls', async function test() {

    var result = await service.start({
      urls: [
        `http://127.0.0.1:${PORT}/rows`,
        `http://127.0.0.1:${PORT}/rows`
      ],
      page_function: function($) {
        var result = [];
        $("p").each(function() {
          result.push($(this).text());
        });

        return result;
      },
      delay: 0,
      login_time: 0
    })

    console.log(result);

    assert.deepEqual(result.length, 4);

    assert.deepEqual(result, [{
      result: 'one', given_url: 'http://127.0.0.1:3080/rows'
    }, {
      result: 'two', given_url: 'http://127.0.0.1:3080/rows'
    }, {
      result: 'one', given_url: 'http://127.0.0.1:3080/rows'
    }, {
      result: 'two', given_url: 'http://127.0.0.1:3080/rows'
    }
    ]);


  })

  it('scrap with bug in function', async function test() {

    var result = await service.start({
      urls: [
        `http://127.0.0.1:${PORT}`,
      ],
      page_function: function($) {
        var aaa;
        return aaa.bbb;
      },
      delay: 0,
      login_time: 0
    })

    //console.log(result);
    assert.deepEqual(result, []);
  })
})
