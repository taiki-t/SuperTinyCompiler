import { AST, Node, LiteralNode } from "./parser";

interface ExpressionStatementNode {
    type: 'ExpressionStatement';
    expression: {
        type: 'CallExpression';
        callee: {
            type: 'Identifier';
            name: string;
        },
        arguments: Array<LiteralNode | ExpressionStatementNode['expression']>;
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

    private traverse(originalNode: Node, transformedNodeParent: ExpressionStatementNode['expression']): void {
        if (this.isLiteralNode(originalNode)) {
            transformedNodeParent.arguments.push(originalNode)
        }

        if (originalNode.type === 'CallExpression') {
            const expressionNode: ExpressionStatementNode['expression'] = {
                type: "CallExpression",
                callee: {
                    type: "Identifier",
                    name: originalNode.name,
                },
                arguments: []
            }

            originalNode.params.forEach(node => {
                this.traverse(node, expressionNode)
            })

            transformedNodeParent.arguments.push(expressionNode)
        }
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
                    this.traverse(node, expressionStatementNode.expression)
                 })

                 newAST.body.push(expressionStatementNode);
            }
        })

        return newAST;
    }
}

const transformer = Transformer.transformer
export { transformer }
