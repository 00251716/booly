from lexer.syntax_kind import SyntaxKind
from parser.syntax_expression import ExpressionSyntax


class BinaryExpressionSyntax(ExpressionSyntax):
    _kind = None

    def __init__(self, left, operator, right):
        self.left = left
        self.operator = operator
        self.right = right

    def get_children(self):
        return [self.left, self.operator, self.right]

    @property
    def kind(self):
        return SyntaxKind.BinaryExpression
