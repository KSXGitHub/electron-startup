'use strict'
const {eval} = require('coffee-script')
const {stringify} = JSON
const ext = '.json'
const compile = buffer => ({buffer: stringify(eval(buffer.toString('utf8'))), ext})
module.exports = compile
