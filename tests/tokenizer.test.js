const tokenizer = require('../built/tokenizer');

test('tokenize left parenthesis', () => {
    const code = '('
    expect(tokenizer(code)).toEqual(
        [{
            type: 'paren',
            value: '('
        }]
    )
})

test('tokenize right parenthesis', () => {
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

