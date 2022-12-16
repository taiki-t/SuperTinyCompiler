import { Tokens, Token } from "./tokenizer";

interface LiteralNode {
    type: string;
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

    function walk(): Node {
        let token = tokens[current];
        if (token == null) {
            throw new TypeError(token)
        };

        if (token.type === 'number') {
            current++;

            return {
                type: 'NumberLiteral',
                value: token.value,
            }
        }

        if (token.type == 'string') {
            current++;

            return {
                type: 'StringLiteral',
                value: token.value,
            }
        }

        if (
            token.type === 'paren' &&
            token.value === '('
        ) {
            token = tokens[++current];
            if (token == null) {
                throw new Error(`Token does not exist for the index: ${current}`)
            }

            let node: ExpressionNode = {
                type: 'CallExpression',
                name: token.value,
                params: [],
            }

            token = tokens[++current];

            while (
                token?.type !== 'paren' ||
                token?.type === 'paren' && token.value !== ')'
            ) {
                node.params.push(walk());
                token = tokens[current];
            }

            current++;

            return node;
        }

        throw new TypeError(`Unknown token type: ${token.type}`);
    }

    let ast: AST = {
        type: 'Program',
        body: [],
    }

    while (current < tokens.length) {
        ast.body.push(walk())
    }

    return ast;
}

export { parser };
