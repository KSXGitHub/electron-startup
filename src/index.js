'use strict'

const {join} = require('path')
const {app, BrowserWindow} = require('electron')
const location = join(__dirname, 'page', 'index.xml')

app.on('ready', createWindow)
app.on('activate', () => win || createWindow())
app.on('windows-all-closed', () => app.quit())

let win = null
function createWindow () {
  win = new BrowserWindow({
    autoHideMenuBar: true
  })
  win.on('closed', () => { win = null })
  win.on('ready-to-show', () => win.show())
  win.loadURL(location)
  win.focus()
}
