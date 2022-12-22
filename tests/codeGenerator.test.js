const generator = require('../built/codeGenerator').generator

test('print number literal from AST', () => {
    const ast = {
        type: 'Program',
        body: [
            { type: 'NumberLiteral', value: '2' }
        ]
    }
    expect(generator(ast).print()).toEqual('2');
})

test('print literal values from AST', () => {
    const ast = {
        type: 'Program',
        body: [
            { type: 'NumberLiteral', value: '2' },
            { type: 'StringLiteral', value: 'str' },
        ]
    }
    expect(generator(ast).print()).toEqual('2\nstr');
})

test('print a simple expression from AST', () => {
    const ast = {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'add'
                    },
                    arguments: [
                        { type: 'NumberLiteral', value: '1' },
                        { type: 'NumberLiteral', value: '2' },
                    ]
                }
            },
        ]
    }
    expect(generator(ast).print()).toEqual('add(1, 2);');
})

test('print a nested expression from AST', () => {
    const ast = {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'add'
                    },
                    arguments: [
                        { type: 'NumberLiteral', value: '1' },
                        {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'subtract'
                            },
                            arguments: [
                                { type: 'NumberLiteral', value: '2' },
                                { type: 'NumberLiteral', value: '1' },
                            ]
                        }
                    ]
                }
            }
        ]
    }
    expect(generator(ast).print()).toEqual('add(1, subtract(2, 1));');
})

test('print multiple nested expression from AST', () => {
    const ast = {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'add'
                    },
                    arguments: [
                        { type: 'NumberLiteral', value: '1' },
                        {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'subtract'
                            },
                            arguments: [
                                { type: 'NumberLiteral', value: '2' },
                                { type: 'NumberLiteral', value: '1' },
                            ]
                        }
                    ]
                }
            },
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'add'
                    },
                    arguments: [
                        { type: 'NumberLiteral', value: '1' },
                        {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'subtract'
                            },
                            arguments: [
                                { type: 'NumberLiteral', value: '2' },
                                { type: 'NumberLiteral', value: '1' },
                            ]
                        }
                    ]
                }
            }
        ]
    }
    expect(generator(ast).print()).toEqual('add(1, subtract(2, 1));\nadd(1, subtract(2, 1));');
})

