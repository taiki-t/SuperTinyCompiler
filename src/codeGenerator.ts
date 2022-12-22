import { NewAST, ExpressionStatementNode, LiteralNode } from "./transformer"

class CodeGenerator {
    static generator: (newAST: NewAST) => CodeGenerator
        = (newAST: NewAST) => { return new CodeGenerator(newAST) };

    newAST: NewAST;

    constructor(newAST: NewAST) {
        this.newAST = newAST;
    }

    traverse = (node: NewAST | ExpressionStatementNode | ExpressionStatementNode['expression'] | LiteralNode): string => {

        switch (node.type) {
            case 'Program':
                return node.body.map(this.traverse).join('\n');
            case 'NumberLiteral':
                return node.value;
            case 'StringLiteral':
                return node.value;
            case 'CallExpression':
                let expression: string = '';
                expression = node.callee.name;
                expression += '('

                expression += node.arguments.map(this.traverse).join(', ')

                expression += ')'

                return expression
            case 'ExpressionStatement':
                return this.traverse(node.expression) + ';';
            default:
                throw new TypeError(node);
        }
    }

    print(): string {
        return this.traverse(this.newAST);
    }
}

const generator = CodeGenerator.generator
export { generator }
