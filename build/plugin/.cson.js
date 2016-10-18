'use strict'
const {eval} = require('coffee')
const compile = buffer => eval(buffer.toString('utf8'))
module.exports = compile
