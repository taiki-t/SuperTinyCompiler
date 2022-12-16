import { Tokens, Token } from "./tokenizer";

interface LiteralNode {
    type: 'NumberLiteral' | 'StringLiteral';
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

function parser(tokens: Tokens): AST {
    let current = 0;

    function incrementCurrent() :void {
        current++;
    }

    function currentToken() :Token {
        const token = tokens[current];
        if (token == null) { throw Error(`No token at: ${current}`) }
        return token;
    }

    let ast: AST = {
        type: 'Program',
        body: [],
    }

    while (current < tokens.length) {
        let token = tokens[current];
        if (token == null) { break };

        ast.body.push(walk(token, incrementCurrent, currentToken))
    }

    return ast;
}

function walk(token: Token, incrementCurrent: () => void, currentToken: () => Token): Node {
    if (token == null) {
        throw new TypeError(token)
    };

    if (token.type === 'number') {
        incrementCurrent()

        return {
            type: 'NumberLiteral',
            value: token.value,
        }
    }

    if (token.type == 'string') {
        incrementCurrent()

        return {
            type: 'StringLiteral',
            value: token.value,
        }
    }

    if (
        token.type === 'paren' &&
        token.value === '('
    ) {
        incrementCurrent()
        token = currentToken()
        if (token == null) {
            throw new Error("Token does not exist")
        }

        let node: ExpressionNode = {
            type: 'CallExpression',
            name: token.value,
            params: [],
        }

        incrementCurrent()
        token = currentToken()

        while (
            token?.type !== 'paren' ||
            token?.type === 'paren' && token.value !== ')'
        ) {
            node.params.push(walk(token, incrementCurrent, currentToken));
            token = currentToken();
        }

        incrementCurrent()

        return node;
    }
    throw new TypeError(`Unknown token type: ${token.type}`);
}

export { parser };
