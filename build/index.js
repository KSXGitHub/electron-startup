'use strict'

const {join, dirname} = require('path')
const {exit} = require('process')
const {writeFile, readFile, mkdir} = require('fs-promise')
const co = require('co')
const {remove} = require('./lib/remove-fs.js')
const {traverse} = require('./lib/traverse-fs.js')
const {info, error} = global.console
const PROJECT_DIR = dirname(__dirname)
const SRC_DIR = join(PROJECT_DIR, 'src')
const APP_DIR = join(PROJECT_DIR, 'app')

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
  yield remove(APP_DIR)
  yield traverse(SRC_DIR)
    .before(
      function * ({path, base, is, prevent}) {
        if (is === 'dir') {
          const appdir = join(APP_DIR, path)
          yield mkdir(appdir)
          return Promise.resolve(appdir)
        }
      }
    )
    .after(
      function * ({name, ext, base, file}, appdir) {
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
