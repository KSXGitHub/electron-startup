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

const traverse = (path, pre = YIELD_RESOLVE_NOTHING, post = YIELD_RESOLVE_NOTHING, container = {}) => ({
  path: path =>
    traverse(path, pre, post, container),
  before: pre =>
    traverse(path, pre, post, container),
  after: post =>
    traverse(path, pre, post, container),
  container: container =>
    traverse(path, pre, post, container),
  get: () => co(function * () {
    const {name, ext, base, dir} = parse(path)
    const attr = yield stat(path)
    const is = getis(attr, path)
    let con = true
    const prevent = () => { con = false }
    const nextcontainer = {path, name, ext, base, dir, is, container, prevent}
    const before = yield pre(nextcontainer)
    if (is === 'dir' && con) {
      const list = yield readdir(path)
      yield Promise.all(
        list
          .map(
            item =>
              join(path, item)
          )
          .map(
            path =>
              traverse(path, pre, post, nextcontainer).get()
          )
      )
    }
    const after = yield post(nextcontainer, before)
    return after
  }),
  __proto__: null
})

module.exports = {traverse}
