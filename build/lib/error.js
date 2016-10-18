'use strict'

class XError extends Error {
  constructor (message, info) {
    super(message)
    return {info, __proto__: this}
  }
}

class CategoryError extends XError {}

module.exports = {XError, CategoryError}
