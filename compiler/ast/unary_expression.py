from ast.expression import Expression
from ast.node_kind import AstNodeKind
from diagnostic.diagnostics import report_undefined_unary_operator
from symbol.type import DataType, get_max_data_type


class UnaryExpression(Expression):
    """"Unary expression handles minus and  plus. For logical expressions see Not"""

    def __init__(self, operator, operand: Expression):
        super().__init__(operator, None)
        self.operator = operator
        self.operand = operand
        self.data_type = get_max_data_type(DataType.Int, operand.data_type)
        if self.data_type is DataType.Error:
            report_undefined_unary_operator(operator.lexeme, operand.data_type)
        self.kind = AstNodeKind.UnaryExpression

    def __str__(self):
        return "{}\tOperator: {}\tResultant data type:{}".format(self.kind.name, self.token.lexeme, self.data_type.name)

    def get_children(self):
        return [self.operand]
