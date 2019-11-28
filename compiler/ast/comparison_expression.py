from ast.expression import Expression
from ast.logical_expression import LogicalExpression
from ast.node_kind import AstNodeKind
from diagnostic.diagnostics import report_incompatible_types
from lexer.token_kind import TokenKind
from symbol.type import DataType, is_numeric


class ComparisonExpression(LogicalExpression):
    def __init__(self, token, expression1: Expression, expression2: Expression):
        super().__init__(token, expression1, expression2)
        if self.data_type == DataType.Error:
            report_incompatible_types(expression1.data_type.name, expression2.data_type.name, token)
        self.kind = AstNodeKind.ComparisonExpression

    def __str__(self):
        return "{}\tOperator: {}\tResultant data type:{}".format(self.kind.name, self.token.lexeme, self.data_type.name)

    def check(self):
        if is_numeric(self.expression1.data_type) and is_numeric(self.expression2.data_type):
            return DataType.Bool
        elif self.expression1.data_type in {DataType.String, DataType.Bool} and\
                self.expression1.data_type == self.expression2.data_type:
            if self.token.kind == TokenKind.EqualsToken or self.token.kind == TokenKind.NotEqualsToken:
                return DataType.Bool
        return DataType.Error

    def get_children(self):
        return [self.expression1, self.expression2]