"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
function parser(tokens) {
    let current = 0;
    function walk() {
        let token = tokens[current];
        if (token == null) {
            throw new TypeError(token);
        }
        ;
        if (token.type === 'number') {
            current++;
            return {
                type: 'NumberLiteral',
                value: token.value,
            };
        }
        if (token.type == 'string') {
            current++;
            return {
                type: 'StringLiteral',
                value: token.value,
            };
        }
        if (token.type === 'paren' &&
            token.value === '(') {
            token = tokens[++current];
            if (token == null) {
                throw new Error(`Token does not exist for the index: ${current}`);
            }
            let node = {
                type: 'CallExpression',
                name: token.value,
                params: [],
            };
            token = tokens[++current];
            while (token?.type !== 'paren' ||
                token?.type === 'paren' && token.value !== ')') {
                node.params.push(walk());
                token = tokens[current];
            }
            current++;
            return node;
        }
        throw new TypeError(`Unknown token type: ${token.type}`);
    }
    let ast = {
        type: 'Program',
        body: [],
    };
    while (current < tokens.length) {
        ast.body.push(walk());
    }
    return ast;
}
exports.parser = parser;
