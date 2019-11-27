from lexer.syntax_kind import SyntaxKind
from parser.syntax_expression import ExpressionSyntax


class LiteralExpressionSyntax(ExpressionSyntax):
    def get_children(self):
        return [self.token]

    def __init__(self, token, value=None):
        self.token = token
        self.value = token.value if value is None else value

    @property
    def kind(self):
        return SyntaxKind.LiteralExpression
