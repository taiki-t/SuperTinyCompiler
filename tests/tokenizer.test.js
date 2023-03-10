const tokenizer = require('../built/tokenizer').tokenizer;

test('tokenize the opening parenthesis', () => {
    const code = '('
    expect(tokenizer(code)).toEqual(
        [{
            type: 'paren',
            value: '('
        }]
    )
})

test('tokenize the closing parenthesis', () => {
    const code = ')'
    expect(tokenizer(code)).toEqual(
        [{
            type: 'paren',
            value: ')'
        }]
    )
})

test('tokenize numbers', () => {
    let code = '0';
    expect(tokenizer(code)).toEqual(
        [{
            type: 'number',
            value: '0'
        }]
    )

    code = '9999';
    expect(tokenizer(code)).toEqual(
        [{
            type: 'number',
            value: '9999'
        }]
    )
})

test('tokenize strings', () => {
    let code = '"s"';
    expect(tokenizer(code)).toEqual(
        [{
            type: 'string',
            value: 's'
        }]
    )

    code = '"This is a string."';
    expect(tokenizer(code)).toEqual(
        [{
            type: 'string',
            value: 'This is a string.'
        }]
    )
})

test('tokenize names', () => {
    const code = 'add';
    expect(tokenizer(code)).toEqual(
        [{
            type: 'name',
            value: 'add'
        }]
    )
})

test('tokenize an empty string to an empty array', () => {
    const code = '';
    expect(tokenizer(code)).toEqual([])
})

test('tokenize a series of tokenTypes', () => {
    const code = '(add 2 2)';
    expect(tokenizer(code)).toEqual([
        { type: 'paren', value: '(' }, 
        { type: 'name', value: 'add' },
        { type: 'number', value: '2' },
        { type: 'number', value: '2' },
        { type: 'paren', value: ')' }
    ])
})
