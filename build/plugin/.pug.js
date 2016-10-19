'use strict'
const pug = require('pug')
const pretty = require('../def/pretty.js') && '  '
const ext = '.xml'
const compile = buffer => {
  const create = pug.compile(buffer.toString('utf8'), {pretty, doctype: 'xml'})
  return {buffer: create() + '\n', ext}
}
module.exports = compile
