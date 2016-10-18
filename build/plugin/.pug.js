'use strict'
const pug = require('pug')
const compile = buffer => {
  const create = pug.compile(buffer.toString('utf8'))
  return create()
}
module.exports = compile
