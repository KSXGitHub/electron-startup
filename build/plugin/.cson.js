'use strict'
const {eval} = require('coffee-script')
const pretty = require('../def/pretty.js') ? 2 : undefined
const {stringify} = JSON
const ext = '.json'
const compile = buffer => ({buffer: stringify(eval(buffer.toString('utf8')), undefined, pretty) + '\n', ext})
module.exports = compile
