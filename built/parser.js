"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
function parser(tokens) {
    let current = 0;
    function incrementCurrent() {
        current++;
    }
    function currentToken() {
        const token = tokens[current];
        if (token == null) {
            throw Error(`No token at: ${current}`);
        }
        return token;
    }
    let ast = {
        type: 'Program',
        body: [],
    };
    while (current < tokens.length) {
        let token = tokens[current];
        if (token == null) {
            break;
        }
        ;
        ast.body.push(walk(token, incrementCurrent, currentToken));
    }
    return ast;
}
exports.parser = parser;
function walk(token, incrementCurrent, currentToken) {
    if (token == null) {
        throw new TypeError(token);
    }
    ;
    if (token.type === 'number') {
        incrementCurrent();
        return {
            type: 'NumberLiteral',
            value: token.value,
        };
    }
    if (token.type == 'string') {
        incrementCurrent();
        return {
            type: 'StringLiteral',
            value: token.value,
        };
    }
    if (token.type === 'paren' &&
        token.value === '(') {
        incrementCurrent();
        token = currentToken();
        if (token == null) {
            throw new Error("Token does not exist");
        }
        let node = {
            type: 'CallExpression',
            name: token.value,
            params: [],
        };
        incrementCurrent();
        token = currentToken();
        while (token?.type !== 'paren' ||
            token?.type === 'paren' && token.value !== ')') {
            node.params.push(walk(token, incrementCurrent, currentToken));
            token = currentToken();
        }
        incrementCurrent();
        return node;
    }
    throw new TypeError(`Unknown token type: ${token.type}`);
}
