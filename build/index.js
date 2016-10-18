'use strict'

const {join, dirname} = require('path')
const {exit} = require('process')
const {writeFile, readFile, mkdir} = require('fs-promise')
const co = require('co')
const rmfs = require('./lib/remove-fs.js')
const tvfs = require('./lib/traverse-fs.js')
const {info, error} = global.console
const PROJECT_DIR = dirname(__dirname)
const SRC_DIR = join(PROJECT_DIR, 'src')
const APP_DIR = join(PROJECT_DIR, 'app')

co(main)
  .then(
    () => exit(0)
  )
  .catch(
    () => exit(1)
  )

function * main () {
  yield rmfs(APP_DIR)
  yield tvfs(SRC_DIR)
    .before(
      function * ({subdir}) {
        const appdir = join(APP_DIR, subdir)
        yield mkdir(appdir)
        return Promise.resolve(appdir)
      }
    )
    .after(
      function * ({name, ext, base, file, before: appdir}) {
        const {build, ext: appext = ''} = require(ext)
        const srcbuffer = yield readFile(file)
        const appbuffer = yield build(srcbuffer)
        const appfile = join(appdir, name + appext)
        yield writeFile(appfile, appbuffer)
        return Promise.resolve(appfile)
      }
    )
    .get()
}
