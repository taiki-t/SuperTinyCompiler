type TokenType = 'paren' |
    'number' |
    'string' |
    'name';
interface Token {
    type: TokenType;
    value: string;
}

type Tokens = Array<Token>;

function tokenizer(input: string): Tokens {
    let current = 0;

    let tokens: Tokens = [];

    while (current < input.length) {
        let char = input[current];

        if (char === '(') {
            tokens.push({
                type: 'paren',
                value: '('
            })

            current++;

            continue
        }

        if (char === ')') {
            tokens.push({
                type: 'paren',
                value: ')',
            })
            current ++;
            continue;
        }

        const WHITESPACE = /\s/;
        if (WHITESPACE.test(char)) {
            current++;
            continue;
        }

        const NUMBERS = /[0-9]/;
        if (NUMBERS.test(char)) {

            let value: string = '';

            while (NUMBERS.test(char)) {
                value += char;
                char = input[++current];
            }

            tokens.push({ type: 'number', value })
            continue;
        }

        if (char === '"') {
            let value = '';

            char = input[++current];

            while (char !== '"') {
                value += char;
                char = input[++current];
            }

            tokens.push({ type: 'string', value})

            continue;
        }

        const LETTERS = /[a-z]/i;
        if (LETTERS.test(char)) {
            let value = '';

            while (LETTERS.test(char)) {
                value += char;
                char = input[++current];
            }

            tokens.push({ type: 'name', value});

            continue;
        }

        throw new TypeError('I dont know what this character is: ' + char);
    }

    return tokens;
}

module.exports = tokenizer;
