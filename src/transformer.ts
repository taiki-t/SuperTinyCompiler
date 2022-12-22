import { AST, Node, LiteralNode } from "./parser";

interface ExpressionStatementNode {
    type: 'ExpressionStatement';
    expression: {
        type: 'CallExpression';
        callee: {
            type: 'Identifier';
            name: string;
        },
        arguments: Array<Node>;
    }
}

interface NewAST {
    type: 'Program';
    body: Array<ExpressionStatementNode | LiteralNode>;
}

class Transformer {
    static transformer: (originalAST: AST) => Transformer
        = (originalAST: AST) => { return new Transformer(originalAST)}

    originalAST: AST
        
    constructor(originalAST: AST) {
        this.originalAST = originalAST
    }

    private isLiteralNode(node: Node): node is LiteralNode {
        return ['NumberLiteral', 'StringLiteral'].includes(node.type)
    }

    toNewAST(): NewAST {
        const newAST: NewAST = {
            type: 'Program',
            body: []
        }

        this.originalAST.body.forEach(node => {
            if (this.isLiteralNode(node)) {
               newAST.body.push(node)
            }

            if (node.type === 'CallExpression') {

                 const expressionStatementNode: ExpressionStatementNode = {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: node.name,
                        },
                        arguments: [],
                    }
                 }

                 node.params.forEach(node => {
                    expressionStatementNode.expression.arguments.push(node)
                 })

                 newAST.body.push(expressionStatementNode);
            }
        })

        return newAST;
    }
}

const transformer = Transformer.transformer
export { transformer }
