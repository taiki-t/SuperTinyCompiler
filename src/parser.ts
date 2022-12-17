import { Tokens, Token } from "./tokenizer";

interface LiteralNode {
    type: 'NumberLiteral' | 'StringLiteral';
    value: Token['value'];
}

class ExpressionNode {
    type: 'CallExpression';
    name: Token['value'];
    params: Array<Node> ;

    constructor(value: Token['value']) {
        this.type = 'CallExpression';
        this.name = value;
        this.params = [];
    }
}

type Node = ExpressionNode | LiteralNode;

interface AST {
    type: 'Program',
    body: Array<Node>
}

class NumberLiteral {
    type: LiteralNode['type'] =  'NumberLiteral';
    value: Token['value'];

    constructor(value: Token['value']) {
        this.value = value
    }
}
class StringLiteral {
    type: LiteralNode['type'] =  'StringLiteral';
    value: Token['value'];

    constructor(value: Token['value']) {
        this.value = value
    }
}

class WrappedToken  {
    type: Token['type']; 
    value: string;

    constructor(token: Token) {
        this.type = token.type;
        this.value = token.value;
    }

    toLiteralNode(): LiteralNode {
        if (this.isNumber()) {
            return new NumberLiteral(this.value) as LiteralNode
        }

        if (this.isString()) {
            return new StringLiteral(this.value) as LiteralNode
        }

        throw new TypeError(`Invalid token: ${this.type} is invalid.`)
    }

    toExpressionNode(): ExpressionNode {
        return new ExpressionNode(this.value);
    }
    
    isLiteral() :boolean {
       return this.isNumber() || this.isString()
    }

    isNumber() :boolean {
        return this.type === 'number'
    }

    isString() :boolean {
        return this.type === 'string'
    }

    isOpeningParen(): boolean {
        return this.type === 'paren' && this.value === '('
    }

    isClosingParen(): boolean {
        return this.type === 'paren' && this.value === ')'
    }
}

class Parser {
    static parser: (tokens: Tokens) => AST = (tokens: Tokens) => { return new Parser(tokens).parse() }
    current: number;
    tokens: Tokens;
    constructor(tokens: Tokens) {
        this.current = 0;
        this.tokens = tokens;
    }

    parse(): AST {
        let ast: AST = {
            type: 'Program',
            body: [],
        }

        while (this.current < this.tokens.length) {
            ast.body.push(this.walk())
        }

        return ast;
    }
    
    private walk(): Node {
        let token = this.getToken()

        if (token.isLiteral()) {
            this.current++;
            return token.toLiteralNode()
        }

        if (token.isOpeningParen()) {
            token = this.getNextToken()

            let node = token.toExpressionNode();

            token = this.getNextToken()

            while (!token.isClosingParen()) {
                node.params.push(this.walk());
                token = this.getToken();
            }

            this.current++;
            return node;
        }

        throw new TypeError(`Unknown token type: ${token.type}`);
    }

    private getNextToken(): WrappedToken {
        this.current++;
        return this.getToken()
    }

    private getToken(): WrappedToken {
        const token = this.tokens[this.current];
        if (token == null) {
            throw new TypeError(token)
        };
        return new WrappedToken(token);
    }
}


const parser = Parser.parser

export { parser };
