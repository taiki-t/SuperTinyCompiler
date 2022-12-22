"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformer = void 0;
class Transformer {
    static transformer = (originalAST) => { return new Transformer(originalAST); };
    originalAST;
    constructor(originalAST) {
        this.originalAST = originalAST;
    }
    isLiteralNode(node) {
        return ['NumberLiteral', 'StringLiteral'].includes(node.type);
    }
    toNewAST() {
        const newAST = {
            type: 'Program',
            body: []
        };
        this.originalAST.body.forEach(node => {
            if (this.isLiteralNode(node)) {
                newAST.body.push(node);
            }
            if (node.type === 'CallExpression') {
                const expressionStatementNode = {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: node.name,
                        },
                        arguments: [],
                    }
                };
                node.params.forEach(node => {
                    if (this.isLiteralNode(node)) {
                        expressionStatementNode.expression.arguments.push(node);
                    }
                    if (node.type === 'CallExpression') {
                        const innerExpressionStatementNode = {
                            type: 'ExpressionStatement',
                            expression: {
                                type: 'CallExpression',
                                callee: {
                                    type: 'Identifier',
                                    name: node.name,
                                },
                                arguments: [],
                            }
                        };
                        const expressionNode = innerExpressionStatementNode.expression;
                        node.params.forEach(node => {
                            if (this.isLiteralNode(node)) {
                                expressionNode.arguments.push(node);
                            }
                        });
                        expressionStatementNode.expression.arguments.push(expressionNode);
                    }
                });
                newAST.body.push(expressionStatementNode);
            }
        });
        return newAST;
    }
}
const transformer = Transformer.transformer;
exports.transformer = transformer;
