'use strict'
const pretty = require('process').env.RELEASE_MODE !== 'TRUE' && '  '
const pug = require('pug')
const ext = '.xml'
const compile = buffer => {
  const create = pug.compile(buffer.toString('utf8'), {pretty, doctype: 'xml'})
  return {buffer: create() + '\n', ext}
}
module.exports = compile
