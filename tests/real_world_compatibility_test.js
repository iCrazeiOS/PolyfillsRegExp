// Test that the polyfill passes real-world RegExp checking code like is-regex library
require('./setup');
require('../scripts-priority/RegExp.js');

const isRegex = require('is-regex');

function hasOwnLastIndexDataProperty(value) {
    const descriptor = Object.getOwnPropertyDescriptor(value, 'lastIndex');
    return !!(descriptor && Object.prototype.hasOwnProperty.call(descriptor, 'value'));
}

console.log('Testing with real is-regex and lastIndex checks...\n');

const tests = [
    { name: 'Native RegExp', regex: /test/g },
    { name: 'Polyfilled RegExp (no lookbehind)', regex: new RegExp('test', 'g') },
    { name: 'Polyfilled RegExp (with lookbehind)', regex: new RegExp('(?<=foo)bar', 'g') },
    { name: 'Polyfilled RegExp (with replacement)', regex: new RegExp('(?<!\\.)@example\\.com', 'g') },
    { name: 'Polyfilled RegExp (complex pattern)', regex: new RegExp('(?<! cu)bot|(?<! (ya|yandex))search', 'i') }
];

let passed = 0;
let total = tests.length;

tests.forEach(test => {
    const isRegexResult = isRegex(test.regex);
    const lastIndexResult = hasOwnLastIndexDataProperty(test.regex);
    const pass = isRegexResult && lastIndexResult;
    console.log(`${test.name}: ${pass ? '✓' : '✗'} ${pass ? 'PASS' : 'FAIL'}`);
    if (pass) passed++;

    console.log(`  is-regex: ${isRegexResult}`);
    console.log(`  own lastIndex data property: ${lastIndexResult}`);
    console.log(`  instanceof RegExp: ${test.regex instanceof RegExp}`);
    console.log(`  Object.prototype.toString: ${Object.prototype.toString.call(test.regex)}`);
    console.log(`  .test() works: ${test.regex.test('test')}`);
    console.log('');
});

console.log(`Summary: ${passed}/${total} tests passed`);
if (passed !== total) {
    process.exit(1);
}

const fake = {};
Object.setPrototypeOf(fake, RegExp.prototype);
if (isRegex(fake)) {
    console.log('✗ spoofed RegExp.prototype object incorrectly passed is-regex');
    process.exit(1);
}

console.log('✅ Polyfilled RegExp instances pass is-regex and lastIndex checks');
