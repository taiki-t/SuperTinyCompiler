import { Tokens, Token, TokenType } from "./tokenizer";

type LiteralTypes = 'NumberLiteral' | 'StringLiteral'
interface LiteralNode {
    type: LiteralTypes;
    value: Token['value'];
}

interface ExpressionNode {
    type: 'CallExpression';
    name: Token['value'];
    params: Array<Node> ;
}

type Node = ExpressionNode | LiteralNode;

interface AST {
    type: 'Program',
    body: Array<Node>
}
class WrappedToken implements Token {
    type: Token['type']; 
    value: string;

    constructor(token: Token) {
        this.type = token.type;
        this.value = token.value;
    }

    toLiteralNode(): LiteralNode {
        const tokenTypeToAstType: Pick<Record<TokenType, LiteralTypes>, "number" | "string"> = {
            number: 'NumberLiteral',
            string: 'StringLiteral',
        }

        if (this.type === 'number' || this.type === 'string') {
            return {
                type: tokenTypeToAstType[this.type],
                value: this.value,
            }
        }


        throw new TypeError(`Invalid token: ${this.type} is invalid.`)
    }

    toExpressionNode(): ExpressionNode {
        return {
            type: 'CallExpression',
            name: this.value,
            params: []
        }
    }
    
    isLiteral() :boolean {
       return this.isNumber() || this.isString()
    }

    private isNumber() :boolean {
        return this.type === 'number'
    }

    private isString() :boolean {
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
