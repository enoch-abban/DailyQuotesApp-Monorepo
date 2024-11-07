'use strict';

const sharedData = require('..');
const assert = require('assert').strict;

assert.strictEqual(sharedData(), 'Hello from sharedData');
console.info('sharedData tests passed');
