'use strict'

const {rmdir, unlink} = require('fs-promise')
const {traverse} = require('./traverse-fs.js')
const rm = {dir: rmdir, file: unlink}
const {YIELD_RESOLVE_NOTHING} = require('./yield-resolve-nothing.js')

const remove = (path, before = YIELD_RESOLVE_NOTHING) =>
  traverse(path).before(before).after(({actualPath, is}) => rm[is](actualPath)).get()

module.exports = {remove}
