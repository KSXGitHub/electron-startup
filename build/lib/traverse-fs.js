'use strict'

const {join, parse} = require('path')
const {readdir, stat} = require('fs-promise')
const {CategoryError} = require('./error.js')
const spread = require('./spread-array.js')
const co = require('co')
const RESOLVE_NOTHING = Promise.resolve()
const YIELD_RESOLVE_NOTHING = function * () {yield RESOLVE_NOTHING}

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
    const nextcontainer = {path, name, ext, base, dir, is}
    let con = true
    const before = yield pre(nextcontainer, {container, prevent: () => con = false})
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
    const after = yield post(nextcontainer, {container, before})
  }),
  __proto__: null
})


module.exports = {traverse}
