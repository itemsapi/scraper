const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

const express = require('express')
const api = express()
const service = require('./service');
const bodyParser = require('body-parser');
const _ = require('lodash');
const PORT = process.env.PORT || 3007;
const json2csv = require('json2csv');

api.use('/assets', express.static('assets'));

api.use(bodyParser.json({limit: '10mb'}));
api.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

api.get('/', (req, res) => res.send('Hello World!'))

api.all('/scraping', async (req, res) => {

  //console.log(req.body);

  var urls = _.chain(req.body.urls).split('\n').map(v => {
    return v.replace('\r', '');
  }).value();

  var page_function;
  try {
    page_function = eval(`(${req.body.function})`);
  } catch (x) {
  }

  var params = {
    urls: urls,
    delay: parseInt(req.body.delay) || 100,
    user_agent: req.body.user_agent,
    login_time: parseInt(req.body.login_time) || 1000,
    page_function: page_function
  }

  console.log(params);

  var result = await service.start(params);

  console.log(result);
  //var datestring = momentdate.format('DD-MM-YY_HH-mm');

  var csv = json2csv({
    data: result
  })

  var filename = 'export.csv';
  res.attachment(filename);
  return res.status(200).send(csv);

  return res.json({
  });
  //return res.send('Hello World!<a href="http://localhost:3000/">aaa</a>');
})

console.log('start');
api.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1200, height: 900})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
