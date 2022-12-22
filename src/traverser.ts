import { AST, Node } from "./parser";

function traverser(ast: ContextableAST, visitor: Visitor): any {
    function traverseArray(array: ContextableAST['body'] | Extract<Node, 'ExpressionNode'>['params'], parent: ContextableAST | ContextableNode) {
        array.forEach(child => {
            traverseNode(child as ContextableNode, parent);
        });
    }

    function isContextableNode(node: ContextableAST | ContextableNode | null): node is ContextableNode {
        return node?.type !== 'Program'
    }

    function traverseNode(node: ContextableAST | ContextableNode, parent: ContextableAST | ContextableNode | null) {
        let methods: VisitorEnter | null = null;

        if (isContextableNode(node) && isContextableNode(parent)) {
            methods = visitor[node.type];

            if (methods?.enter) {
                methods.enter(node, parent);
            }
        }

        switch (node.type) {
            case 'Program':
                traverseArray(node.body, node);
                break;

            case 'CallExpression':
                traverseArray(node.params, node);
                break;

            case 'NumberLiteral':
            case 'StringLiteral':
                break;
            
            default:
                throw new TypeError(node);
        }

        if (isContextableNode(node) && isContextableNode(parent)) {
            if (methods?.exit) {
                methods.exit(node, parent);
            }
        }
    }

    traverseNode(ast, null);
}

interface TransformedAST {
    type: 'Program';
    body: Array<TransformedAST.Node.AllType>
}

namespace TransformedAST {
    export namespace Node {
        export interface NumberLiteral {
            type: 'NumberLiteral';
            value: string;
        }

        export interface StringLiteral {
            type: 'StringLiteral';
            value: string;
        }

        type LiteralTypes = NumberLiteral | StringLiteral

        export interface CallExpression {
            type: 'CallExpression';
            callee: {
                type: 'Identifier';
                name: string;
            };
            arguments: Array<LiteralTypes | CallExpression>
        }

        export type Arguments = LiteralTypes | CallExpression

        export interface ExpressionStatement {
            type: 'ExpressionStatement';
            expression: CallExpression;
        }

        export type AllType = ExpressionStatement | Arguments
    }
}

interface Contextable {
    _context: TransformedAST['body']
}
type ContextableAST = AST & Contextable
type ContextableNode = Node & Contextable

interface VisitorEnter {
    enter: (ast: ContextableNode, parent: ContextableNode) => void
    exit?: (ast: ContextableNode, parent: ContextableNode) => void
}

type Visitor = Record<ContextableNode['type'], VisitorEnter>

function transformer(ast: ContextableAST): TransformedAST {
    let newAst: TransformedAST = {
        type: 'Program',
        body: [],
    }

    ast._context = newAst.body;

    traverser(ast, {
        NumberLiteral: {
            enter(node: ContextableNode, parent: ContextableNode) {
                if (node.type !== 'NumberLiteral') {
                    throw TypeError(`NumberLiteral expected, but recieved ${node.type}`)
                }

                parent._context.push({
                    type: 'NumberLiteral',
                    value: node.value,
                });
            },
        },

        StringLiteral: {
            enter(node: ContextableNode, parent: ContextableNode) {
                if (node.type !== 'StringLiteral') {
                    throw TypeError(`StringLiteral expected, but recieved ${node.type}`)
                }
                parent._context.push({
                    type: 'StringLiteral',
                    value: node.value,
                });
            },
        },

        CallExpression: {
            enter(node: ContextableNode, parent: ContextableNode) {
                if (node.type !== 'CallExpression') {
                    throw TypeError(`CallExpression expected, but recieved ${node.type}`)
                }

                let expression: TransformedAST.Node.AllType = {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: node.name,
                    },
                    arguments: [],
                }

                node._context = expression.arguments;

                if (parent.type !== 'CallExpression') {

                    expression = {
                        type: 'ExpressionStatement',
                        expression: expression,
                    };
                }

                parent._context.push(expression);
            }
        }
    });

    return newAst;
}
