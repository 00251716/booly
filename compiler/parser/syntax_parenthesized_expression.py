from parser.syntax_expression import ExpressionSyntax
from lexer.syntax_kind import SyntaxKind


class ParenthesizedExpressionSyntax(ExpressionSyntax):
    def __init__(self, open, expression, close):
        self.open_parenthesis = open
        self.expression = expression
        self.close_parenthesis = close

    @property
    def kind(self):
        return SyntaxKind.ParenthesizedExpression

    def get_children(self):
        return [self.open_parenthesis, self.expression, self.close_parenthesis]
