require('./setup');
require('../scripts-priority/RegExp.js');

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

function reactStringReplace(input, pattern, replacer) {
	const isString = function (value) {
		return typeof value === 'string';
	};

	let regex = pattern;
	if (!(regex instanceof RegExp)) {
		let escaped = regex;
		const specialChars = /[\\^$.*+?()[\]{}|]/g;
		const specialCharsRegex = RegExp(specialChars.source);
		escaped =
			escaped && specialCharsRegex.test(escaped)
				? escaped.replace(specialChars, '\\$&')
				: escaped;
		regex = new RegExp('(' + escaped + ')', 'gi');
	}

	let matchIndex = 0;
	let offset = 0;

	if (input === '') {
		return input;
	}
	if (!input || !isString(input)) {
		throw new TypeError(
			'First argument to react-string-replace#replaceString must be a string'
		);
	}

	const parts = input.split(regex);
	for (let index = 1; index < parts.length; index += 2) {
		if (parts[index] !== undefined && parts[index - 1] !== undefined) {
			matchIndex = parts[index].length;
			offset += parts[index - 1].length;
			parts[index] = replacer(parts[index], index, offset);
			offset += matchIndex;
		}
	}

	return parts;
}

const literalRegex = /(__FUTURE_MAYBE_JSX_VALUE_\d+__)/g;
const constructedRegex = new RegExp('(__FUTURE_MAYBE_JSX_VALUE_\\d+__)', 'g');
const input = 'x __FUTURE_MAYBE_JSX_VALUE_1__ y';

assert(literalRegex instanceof RegExp, 'Native regex literal must satisfy instanceof RegExp');
assert(constructedRegex instanceof RegExp, 'Constructed regex must satisfy instanceof RegExp');

const literalResult = reactStringReplace(input, literalRegex, () => 'Z').join('');
const constructedResult = reactStringReplace(input, constructedRegex, () => 'Z').join('');

assert(literalResult === 'x Z y', 'Literal regex should follow regex path and replace correctly');
assert(constructedResult === 'x Z y', 'Constructed regex should replace correctly');

console.log('react-string-replace compatibility regression passed');
