const parser = require('../built/parser').parser
const tokenizer = require('../built/tokenizer').tokenizer

test('returns a empty ast', () => {
    const tokens = []
    expect(parser(tokens)).toEqual(
        {
            type: 'Program',
            body: [],
        }
    )
})

test('parse a number literal token', () => {
    const tokens = [
        { type: 'number', value: '0' },
    ]
    expect(parser(tokens)).toEqual(
        {
            type: 'Program',
            body: [{
                type: 'NumberLiteral',
                value: '0'
            }]
        }
    )
})

test('parse a string literal token', () => {
    const tokens = [
        { type: 'string', value: 'This is a string.' },
    ]
    expect(parser(tokens)).toEqual(
        {
            type: 'Program',
            body: [{
                type: 'StringLiteral',
                value: 'This is a string.'
            }]
        }
    )
})

test('parse multiple literal tokens', () => {
    const tokens = [
        { type: 'number', value: '0' },
        { type: 'number', value: '1' },
        { type: 'string', value: 'a string' },
    ]
    expect(parser(tokens)).toEqual(
        {
            type: 'Program',
            body: [
                { type: 'NumberLiteral', value: '0' },
                { type: 'NumberLiteral', value: '1' },
                { type: 'StringLiteral', value: 'a string' },
            ]
        }
    )
})

test('throw an error on unknown token', () => {
    const tokens = [
        { type: 'foo', value: 'bar' },
    ]
    expect(() => parser(tokens)).toThrow("Unknown token type: foo");
})

test('parse an call expression', () => {
    const tokens = [
        { type: 'paren', value: '('},
        { type: 'name', value: 'add'},
        { type: 'number', value: '1'},
        { type: 'number', value: '2'},
        { type: 'paren', value: ')'},
    ]

    expect(parser(tokens)).toEqual(
        {
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
    )
})

test('parse an nested call expression', () => {
    const tokens = [
        { type: 'paren', value: '(' },
        { type: 'name', value: 'add' },
        { type: 'number', value: '1' },
        { type: 'paren', value: '(' },
        { type: 'name', value: 'subtract' },
        { type: 'number', value: '2' },
        { type: 'number', value: '2' },
        { type: 'paren', value: ')' },
        { type: 'paren', value: ')' },
    ]

    expect(tokens).toEqual(tokenizer('(add 1 (subtract 2 2))'))
    expect(parser(tokens)).toEqual(
        {
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
                                { type: 'NumberLiteral', value: '2' },
                            ]
                        },
                    ]
                },
            ]
        }
    )
})
