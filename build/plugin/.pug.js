'use strict'
const pug = require('pug')
const ext = '.xml'
const compile = buffer => {
  const create = pug.compile(buffer.toString('utf8'))
  return {buffer: create(), ext}
}
module.exports = compile
