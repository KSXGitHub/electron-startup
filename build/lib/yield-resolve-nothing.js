'use strict'
const RESOLVE_NOTHING = Promise.resolve()
const YIELD_RESOLVE_NOTHING = function * () { yield RESOLVE_NOTHING }
module.exports = {RESOLVE_NOTHING, YIELD_RESOLVE_NOTHING}
