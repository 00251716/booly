from ast.expression import Expression
from ast.logical_expression import LogicalExpression
from ast.node_kind import AstNodeKind
from diagnostic.diagnostics import report_undefined_unary_operator
from symbol.type import DataType


class NotExpression(LogicalExpression):
    def __init__(self, token, operand: Expression):
        super().__init__(token, operand, operand)
        if self.data_type == DataType.Error:
            report_undefined_unary_operator(token.lexeme, operand.data_type)
        self.kind = AstNodeKind.UnaryExpression

    def __str__(self):
        return "{}\tOperator: {}\tResultant data type:{}".format(self.kind.name, self.token.lexeme, self.data_type.name)

    def get_children(self):
        return [self.expression1]
