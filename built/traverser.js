"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function traverser(ast, visitor) {
    function traverseArray(array, parent) {
        array.forEach(child => {
            traverseNode(child, parent);
        });
    }
    function isContextableNode(node) {
        return node?.type !== 'Program';
    }
    function traverseNode(node, parent) {
        let methods = null;
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
function transformer(ast) {
    let newAst = {
        type: 'Program',
        body: [],
    };
    ast._context = newAst.body;
    traverser(ast, {
        NumberLiteral: {
            enter(node, parent) {
                if (node.type !== 'NumberLiteral') {
                    throw TypeError(`NumberLiteral expected, but recieved ${node.type}`);
                }
                parent._context.push({
                    type: 'NumberLiteral',
                    value: node.value,
                });
            },
        },
        StringLiteral: {
            enter(node, parent) {
                if (node.type !== 'StringLiteral') {
                    throw TypeError(`StringLiteral expected, but recieved ${node.type}`);
                }
                parent._context.push({
                    type: 'StringLiteral',
                    value: node.value,
                });
            },
        },
        CallExpression: {
            enter(node, parent) {
                if (node.type !== 'CallExpression') {
                    throw TypeError(`CallExpression expected, but recieved ${node.type}`);
                }
                let expression = {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: node.name,
                    },
                    arguments: [],
                };
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
