"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generator = void 0;
class CodeGenerator {
    static generator = (newAST) => { return new CodeGenerator(newAST); };
    newAST;
    constructor(newAST) {
        this.newAST = newAST;
    }
    traverse = (node) => {
        switch (node.type) {
            case 'Program':
                return node.body.map(this.traverse).join('\n');
            case 'NumberLiteral':
                return node.value;
            case 'StringLiteral':
                return node.value;
            case 'CallExpression':
                let expression = '';
                expression = node.callee.name;
                expression += '(';
                expression += node.arguments.map(this.traverse).join(', ');
                expression += ')';
                return expression;
            case 'ExpressionStatement':
                return this.traverse(node.expression) + ';';
            default:
                throw new TypeError(node);
        }
    };
    print() {
        return this.traverse(this.newAST);
    }
}
const generator = CodeGenerator.generator;
exports.generator = generator;
