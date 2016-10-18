'use strict'

const {app, BrowserWindow} = require('electron')

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
  win.focus()
}
