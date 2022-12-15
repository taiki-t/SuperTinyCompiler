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
