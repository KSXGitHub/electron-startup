'use strict'

const {join, dirname, parse} = require('path')
const {exit} = require('process')
const {writeFile, readFile, mkdir, readdir} = require('fs-promise')
const {remove} = require('fs-extra')
const co = require('co')
const {info, error} = global.console
const PROJECT_DIR = dirname(__dirname)
const SRC_DIR = join(PROJECT_DIR, 'src')
const APP_DIR = join(PROJECT_DIR, 'app')
const ignore = new Set(['node_modules', '.node_modules', '.node_libraries'])

co(main)
  .then(
    () => {
      info('Build succeed.')
      exit(0)
    }
  )
  .catch(
    reason => {
      error('Build failed.')
      info(reason)
      exit(1)
    }
  )

function * main () {
  const legacy = yield readdir(APP_DIR)
  yield Promise.all(
    legacy
      .filter(x => !ignore.has(x))
      .map(item => join(APP_DIR, item))
      .map(
        path => new Promise(
          (resolve, reject) =>
            remove(path, error => error ? reject(error) : resolve())
        )
      )
  )
  yield co(() => traverse(SRC_DIR, APP_DIR))
  function * traverse (src, app) {
    const attr = stat(src)
    if (attr.isFile()) {
      const {ext, name} = parse(sffx)
      const compile = require(join(__dirname, ext + '.js'))
      const srcbuffer = readFile(src)
      const appbuffer = compile(srcbuffer)
      return writeFile(app, appbuffer)
    }
    if (attr.isDirectory()) {
      const list = yield readdir(src)
      return Promise.all(
        list.map(
          item => traverse(join(src, item), join(app, item))
        )
      )
    }
  }
}
