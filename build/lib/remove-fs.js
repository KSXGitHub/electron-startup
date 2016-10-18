'use strict'

const {rmdir, unlink} = require('fs-promise')
const {traverse} = require('./traverse-fs.js')

const rm = {dir: rmdir, file: unlink}

const remove = path =>
  traverse(path).after(({path, is}) => rm[is](path)).get()

module.exports = {remove}
