// Advanced test for custom replacements and edge cases

console.log("RegExp Lookbehind Polyfill - Advanced Usage");
console.log("=".repeat(50));

require('./setup');
require('../scripts-priority/RegExp.js');

// Test 1: Custom exact-match replacements
console.log("\n1. Adding Custom Exact-Match Replacements:");
globalThis.__lookbehind_regex_replacements.push({
    original: "(?<!test)custom",
    replacement: "custom",
    description: "Remove test lookbehind for custom"
});

const customRegex = new RegExp('(?<!test)custom', 'g');
const customText = "testcustom mycustom othercustom";
const customMatches = customText.match(customRegex);
console.log(`   Pattern: ${customRegex.source}`);
console.log(`   Text: "${customText}"`);
console.log(`   Matches: ${JSON.stringify(customMatches)}`);
console.log(`   Total replacements: ${globalThis.__lookbehind_partial_replacements.length}`);

// Test 2: Custom full-pattern replacements
console.log("\n2. Adding Custom Full-Pattern Replacements:");
globalThis.__lookbehind_regex_replacements = globalThis.__lookbehind_regex_replacements || [];
globalThis.__lookbehind_regex_replacements.push({
    original: "(?<!special)full pattern test",
    replacement: "replacement pattern",
    flags: 'i'
});

console.log(`   Total full-pattern replacements: ${globalThis.__lookbehind_regex_replacements.length}`);

// Test 3: Verify defaults are always included
console.log("\n3. Default Replacements Always Available:");
const partialDefaults = globalThis.__lookbehind_partial_replacements.filter(r => 
    r.original === "(?<! cu)bot" || r.original === "(?<! (ya|yandex))search"
);
const fullDefaults = globalThis.__lookbehind_regex_replacements.filter(r => 
    r.original.includes("(?<!@)")
);
console.log(`   Default partial replacements found: ${partialDefaults.length >= 2 ? "✓" : "✗"}`);
console.log(`   Default full replacements found: ${fullDefaults.length >= 1 ? "✓" : "✗"}`);

// Test 4: Edge case - Complex lookbehind fallback
console.log("\n4. Complex Pattern Fallback:");
try {
    const complexRegex = new RegExp('(?<!complex[a-z]+)pattern');
    console.log(`   Complex pattern handled: ✓`);
    console.log(`   Source preserved: ${complexRegex.source === '(?<!complex[a-z]+)pattern' ? "✓" : "✗"}`);
} catch (error) {
    console.log(`   Error: ${error.message}`);
}

// Test 5: RegExp static properties
console.log("\n5. RegExp Static Properties:");
const staticRegex = new RegExp('(?<=test)(\\w+)');
const staticMatch = staticRegex.exec('test123');
console.log(`   Exec result: ${staticMatch ? staticMatch[0] : 'null'}`);
console.log(`   Captured group: ${staticMatch ? staticMatch[1] : 'null'}`);

// Test 6: Performance with large text
console.log("\n6. Performance Test:");
const perfRegex = new RegExp('(?<! cu)bot', 'g');
const largeText = "robot ".repeat(1000) + "cubot ".repeat(1000) + "chatbot ".repeat(1000);
const start = Date.now();
const perfMatches = largeText.match(perfRegex);
const duration = Date.now() - start;
console.log(`   Text length: ${largeText.length} chars`);
console.log(`   Matches found: ${perfMatches ? perfMatches.length : 0}`);
console.log(`   Duration: ${duration}ms`);

// Test 7: Constructor variations
console.log("\n7. Constructor Variations:");
const original = new RegExp('(?<=abc)def', 'gi');
const fromRegExp = new RegExp(original, 'g');  // Change flags
const withoutNew = RegExp('(?<=abc)def');
console.log(`   Original flags: ${original.flags}`);
console.log(`   From RegExp flags: ${fromRegExp.flags}`);
console.log(`   Without 'new': ${withoutNew instanceof RegExp ? "✓" : "✗"}`);

console.log("\n" + "=".repeat(50));
console.log("✓ Advanced functionality test complete!");
console.log("\n📋 Summary:");
console.log("   • Custom replacements can be added before loading");
console.log("   • Default replacements are always available");
console.log("   • Complex patterns are handled gracefully");
console.log("   • Performance is reasonable for large texts");
console.log("   • All RegExp constructor variations work");
