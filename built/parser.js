"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
class WrappedToken {
    type;
    value;
    constructor(token) {
        this.type = token.type;
        this.value = token.value;
    }
    toLiteralNode() {
        const tokenTypeToAstType = {
            number: 'NumberLiteral',
            string: 'StringLiteral',
        };
        if (this.type === 'number' || this.type === 'string') {
            return {
                type: tokenTypeToAstType[this.type],
                value: this.value,
            };
        }
        throw new TypeError(`Invalid token: ${this.type} is invalid.`);
    }
    toExpressionNode() {
        return {
            type: 'CallExpression',
            name: this.value,
            params: []
        };
    }
    isLiteral() {
        return this.isNumber() || this.isString();
    }
    isNumber() {
        return this.type === 'number';
    }
    isString() {
        return this.type === 'string';
    }
    isOpeningParen() {
        return this.type === 'paren' && this.value === '(';
    }
    isClosingParen() {
        return this.type === 'paren' && this.value === ')';
    }
}
class Parser {
    static parser = (tokens) => { return new Parser(tokens).parse(); };
    current;
    tokens;
    constructor(tokens) {
        this.current = 0;
        this.tokens = tokens;
    }
    parse() {
        let ast = {
            type: 'Program',
            body: [],
        };
        while (this.current < this.tokens.length) {
            ast.body.push(this.walk());
        }
        return ast;
    }
    walk() {
        let token = this.getToken();
        if (token.isLiteral()) {
            this.current++;
            return token.toLiteralNode();
        }
        if (token.isOpeningParen()) {
            token = this.getNextToken();
            let node = token.toExpressionNode();
            token = this.getNextToken();
            while (!token.isClosingParen()) {
                node.params.push(this.walk());
                token = this.getToken();
            }
            this.current++;
            return node;
        }
        throw new TypeError(`Unknown token type: ${token.type}`);
    }
    getNextToken() {
        this.current++;
        return this.getToken();
    }
    getToken() {
        const token = this.tokens[this.current];
        if (token == null) {
            throw new TypeError(token);
        }
        ;
        return new WrappedToken(token);
    }
}
const parser = Parser.parser;
exports.parser = parser;
