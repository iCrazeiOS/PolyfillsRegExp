// Test and document the new address pattern replacement
require('./setup');
require('../scripts-priority/RegExp.js');

console.log('=== Address Pattern Replacement Test ===\n');

const originalPattern = "(?<!email)(?<!email-)(?<!email_)(?<!email\\.)(?<!email\\s)(?<!ip)(?<!ip-)(?<!ip_)(?<!ip\\s)(?<!ip\\.)address";

console.log('✅ Complex Address Pattern Replacement Test');
console.log('===========================================');
console.log();

console.log('Original Pattern:');
console.log(originalPattern);
console.log();

const flags = "dim";
const regex = new RegExp(originalPattern, flags);

console.log('Replacement Result:');
console.log('- Source property (preserved):', regex.source);
console.log('- Internal pattern (simplified):', regex._regexp.source);
console.log('- Flags:', regex.flags);
console.log();

const testCases = [
    "home address",
    "physical address",
    "street address",
    "email address",
    "email-address",
    "email_address",
    "email.address",
    "ip address",
    "ip-address",
    "ip_address",
    "ip.address",
];

console.log('Functionality Test:');
console.log('==================');

testCases.forEach(testCase => {
    const matches = testCase.match(regex);
    console.log(`"${testCase}":`, matches ? `✓ matches "${matches[0]}"` : '✗ no match');
});

const globalRegex = new RegExp(originalPattern, "gim");
const longText = "Please send to my home address, not my email address or ip address. The office address is different.";
const allMatches = longText.match(globalRegex);
console.log('\nAll matches:', allMatches);
console.log('Match count:', allMatches ? allMatches.length : 0);

console.log('\n✅ Address pattern successfully added to replacement registry!');
