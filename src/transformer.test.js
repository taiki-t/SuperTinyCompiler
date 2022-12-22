const transformer = require('../built/transformer').transformer


test ('transfrom empty body ast', () => {
    const originalAST = {
        type: 'Program',
        body: []
    }
    const transformedAST = originalAST

    expect(transformer(originalAST).toNewAST()).toEqual(
        transformedAST
    )
} ) 

test('transfrom ast with a literal node in body', () => {
    const originalAST = {
        type: 'Program',
        body: [
            { type: 'NumberLiteral', value: '2' }
        ]
    }
    const transformedAST = originalAST

    expect(transformer(originalAST).toNewAST()).toEqual(
        transformedAST
    )
} ) 

test('transfrom ast with multiple literal nodes in body', () => {
    const originalAST = {
        type: 'Program',
        body: [
            { type: 'NumberLiteral', value: '2' },
            { type: 'NumberLiteral', value: '3' },
            { type: 'NumberLiteral', value: '4' }
        ]
    }
    const transformedAST = originalAST

    expect(transformer(originalAST).toNewAST()).toEqual(
        transformedAST
    )
} ) 

test('transform ast with an expression node in body', () => {
    const originalAST = {
        type: 'Program',
        body: [
            {
                type: 'CallExpression',
                name: 'add',
                params: [
                    { type: 'NumberLiteral', value: '1' },
                    { type: 'NumberLiteral', value: '2' },
                ]
            },
        ]
    }

    const transformedAST = {
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

    expect(transformer(originalAST).toNewAST()).toEqual(transformedAST)
})

test.skip('transform ast with an expression node in arguments of an expression', () => {
    const originalAST = {
        type: 'Program',
        body: [
            {
                type: 'CallExpression',
                name: 'add',
                params: [
                    { type: 'NumberLiteral', value: '1' },
                    {
                        type: 'CallExpression',
                        name: 'subtract',
                        params: [
                            { type: 'NumberLiteral', value: '2' },
                            { type: 'NumberLiteral', value: '1' },
                        ]
                    },
                ]
            },
        ]
    }

    const transformedAST = {
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
        ]
    }

    expect(transformer(originalAST).toNewAST()).toEqual(transformedAST)
})
