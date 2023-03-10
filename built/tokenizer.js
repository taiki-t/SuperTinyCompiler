"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenizer = void 0;
function tokenizer(input) {
    let current = 0;
    let tokens = [];
    while (current < input.length) {
        let char = input[current] ?? '';
        if (char === '(') {
            tokens.push({
                type: 'paren',
                value: '('
            });
            current++;
            continue;
        }
        if (char === ')') {
            tokens.push({
                type: 'paren',
                value: ')',
            });
            current++;
            continue;
        }
        const WHITESPACE = /\s/;
        if (WHITESPACE.test(char)) {
            current++;
            continue;
        }
        const NUMBERS = /[0-9]/;
        if (NUMBERS.test(char)) {
            let value = '';
            while (NUMBERS.test(char)) {
                value += char;
                char = input[++current] ?? '';
            }
            tokens.push({ type: 'number', value });
            continue;
        }
        if (char === '"') {
            let value = '';
            // skip opening double quote
            char = input[++current] ?? '';
            while (char !== '"') {
                value += char;
                char = input[++current] ?? '';
            }
            tokens.push({ type: 'string', value });
            // skip the closing double quote
            char = input[++current] ?? '';
            continue;
        }
        const LETTERS = /[a-z]/i;
        if (LETTERS.test(char)) {
            let value = '';
            while (LETTERS.test(char)) {
                value += char;
                char = input[++current] ?? '';
            }
            tokens.push({ type: 'name', value });
            continue;
        }
        throw new TypeError('I dont know what this character is: ' + char);
    }
    return tokens;
}
exports.tokenizer = tokenizer;
