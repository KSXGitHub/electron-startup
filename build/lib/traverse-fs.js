'use strict'

const {join, parse} = require('path')
const {readdir, stat} = require('fs-promise')
const co = require('co')
const {CategoryError} = require('./error.js')
const {YIELD_RESOLVE_NOTHING} = require('./yield-resolve-nothing.js')

const getis = (attr, path) => {
  if (attr.isDirectory()) return 'dir'
  if (attr.isFile()) return 'file'
  throw new CategoryError('Unreconizable FS entry', {attr, path})
}

const traverse = (path, pre = YIELD_RESOLVE_NOTHING, main = YIELD_RESOLVE_NOTHING, post = YIELD_RESOLVE_NOTHING, {actualPath: parentActualPath = ''} = {}) => ({
  path: path =>
    traverse(path, pre, main, post, container),
  before: pre =>
    traverse(path, pre, main, post, container),
  main: pre =>
    traverse(path, pre, main, post, container),
  after: post =>
    traverse(path, pre, main, post, container),
  container: container =>
    traverse(path, pre, main, post, container),
  get: () => co(function * () {
    const {name, ext, base, dir} = parse(path)
    const actualPath = join(parentActualPath, path)
    const attr = yield stat(path)
    const is = getis(attr, path)
    let con = true
    const prevent = () => { con = false }
    const nextcontainer = {path, name, ext, base, dir, is, actualPath, {actualPath: parentActualPath}, prevent}
    const before = yield pre(nextcontainer)
    let center
    if (is === 'file') {
      center = yield main(nextcontainer)
    } else if (con) {
      const list = yield readdir(parentActualPath)
      center = yield Promise.all(
        list
          .map(
            item =>
              join(path, item)
          )
          .map(
            path =>
              traverse(path, pre, main, post, nextcontainer).get()
          )
      )
    }
    const after = yield post(nextcontainer, before)
    return Promise.resolve({before, center, after})
  }),
  __proto__: null
})

module.exports = {traverse}
