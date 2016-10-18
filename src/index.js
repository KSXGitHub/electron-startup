'use strict'

const {app} = require('electron')

app.once('ready', main)

function main () {
  app.quit()
}
