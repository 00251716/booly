from ast.expression import Expression
from ast.logical_expression import LogicalExpression
from ast.node_kind import AstNodeKind
from diagnostic.diagnostics import report_incompatible_types
from symbol.type import DataType


class AndExpression(LogicalExpression):
    def __init__(self, token, expression1: Expression, expression2: Expression):
        super().__init__(token, expression1, expression2)
        if self.data_type == DataType.Error:
            report_incompatible_types(expression1.data_type.name, expression2.data_type.name, token)
        self.kind = AstNodeKind.AndExpression

    def __str__(self):
        return "{}\tOperator: {}\tResultant data type:{}".format(self.kind.name, self.token.lexeme, self.data_type.name)

    def get_children(self):
        return [self.expression1, self.expression2]