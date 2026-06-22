#!/usr/bin/env node

require('./setup');
require('../scripts-priority/RegExp.js');

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
        return true;
    } catch (error) {
        console.log(`✗ ${name}: ${error.message}`);
        return false;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

console.log('Testing additional built-in regex pattern replacements...\n');

let passed = 0;
let total = 0;

total++;
passed += test('Email validation pattern is replaced internally', () => {
    const emailPattern = new RegExp('(?<!\\.)@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', 'g');
    const expectedReplacement = '(?:[^.]|^)@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';

    assert(
        emailPattern.source === '(?<!\\.)@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
        'Original source should be preserved'
    );
    assert(
        emailPattern._regexp.source === expectedReplacement,
        `Expected internal source ${expectedReplacement}, got ${emailPattern._regexp.source}`
    );

    const testText = 'Contact us at support@example.com or admin@test.org';
    const matches = testText.match(emailPattern);
    assert(matches && matches.length === 2, 'Should find 2 email matches');
});

total++;
passed += test('Password validation pattern is replaced internally', () => {
    const passwordPattern = new RegExp('(?<!^\\d).{8,}');
    const expectedReplacement = '(?![0-9]).{8,}';

    assert(
        passwordPattern.source === '(?<!^\\d).{8,}',
        'Original source should be preserved'
    );
    assert(
        passwordPattern._regexp.source === expectedReplacement,
        `Expected internal source ${expectedReplacement}`
    );

    assert(passwordPattern.test('password123'), 'Should match password starting with letter');
    assert(passwordPattern.test('MySecurePass'), 'Should match password with mixed case');
    assert(passwordPattern.test('123password'), 'Replacement uses native pattern semantics');
    assert(!passwordPattern.test('short'), 'Should not match short password');
});

total++;
passed += test('Original user-agent pattern replacement still works', () => {
    const originalPattern = "(?<! cu)bot|(?<! (ya|yandex))search";
    const userAgentRegex = new RegExp(originalPattern, 'i');

    assert(
        userAgentRegex.source === originalPattern,
        'Original source should be preserved'
    );
    assert(
        userAgentRegex._regexp.source === 'bot|search',
        'Internal pattern should use the replacement'
    );

    assert(userAgentRegex.test('Googlebot'), 'Should match bot user agents');
    assert(userAgentRegex.test('search engine'), 'Should match search engines');
});

total++;
passed += test('Registry is accessible and contains built-in patterns', () => {
    assert(globalThis.__lookbehind_regex_replacements, 'Global registry should exist');
    assert(Array.isArray(globalThis.__lookbehind_regex_replacements), 'Registry should be an array');
    assert(globalThis.__lookbehind_regex_replacements.length >= 3, 'Should contain at least 3 built-in patterns');

    const patterns = globalThis.__lookbehind_regex_replacements;
    assert(patterns.find(p => p.original.includes('(?<!\\.)@')), 'Should contain email validation pattern');
    assert(patterns.find(p => p.original.includes('(?<!^\\d)')), 'Should contain password validation pattern');
    assert(patterns.find(p => p.original.includes('(?<! cu)bot')), 'Should contain user-agent pattern');
});

total++;
passed += test('Pattern replacements respect flag specifications', () => {
    const emailGlobal = new RegExp('(?<!\\.)@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', 'g');
    const emailNoFlag = new RegExp('(?<!\\.)@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');

    assert(
        emailGlobal._regexp.source === '(?:[^.]|^)@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
        'Email pattern with g flag should be replaced internally'
    );
    assert(
        emailNoFlag._regexp.source === '@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
        'Email pattern without g flag should use the lookbehind polyfill path'
    );
    assert(emailNoFlag._lookbehindInfo, 'Lookbehind metadata should be present');
});

console.log(`\nResults: ${passed}/${total} tests passed`);

if (passed === total) {
    console.log('All additional built-in pattern tests passed! ✓');
    process.exit(0);
} else {
    console.log('Some tests failed! ✗');
    process.exit(1);
}
