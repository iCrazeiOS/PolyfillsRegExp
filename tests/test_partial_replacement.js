// Test exact-match replacement functionality

require('./setup');
require('../scripts-priority/RegExp.js');

globalThis.__lookbehind_regex_replacements.push({
    original: '(?<=x)',
    replacement: '(?:(?<=x)|^)',
});

function assertMatch(name, actual, expected) {
    const pass = actual === expected;
    console.log(`${pass ? '✓' : '✗'} ${name}`);
    if (!pass) {
        console.log(`  expected: ${expected}`);
        console.log(`  actual:   ${actual}`);
    }
    return pass;
}

console.log('Testing exact-match replacement functionality...\n');

assertMatch(
    'Exact registry match is replaced',
    new RegExp('(?<=x)').source,
    '(?:(?<=x)|^)'
);

assertMatch(
    'Substring registry match is not replaced',
    new RegExp('start(?<=x)end').source,
    'start(?<=x)end'
);

assertMatch(
    'Built-in substring pattern is not replaced',
    new RegExp('prefix(?<! cu)botsuffix', 'gi').source,
    'prefix(?<! cu)botsuffix'
);

assertMatch(
    'Unregistered pattern is unchanged',
    new RegExp('nomatch(?<=z)nomatch').source,
    'nomatch(?<=z)nomatch'
);

console.log('\nExact-match replacement test completed!');
