from ast.expression import Expression
from symbol.type import DataType, get_max_data_type
from ast.node_kind import AstNodeKind
from diagnostic.diagnostics import report_incompatible_types


class UnaryExpression(Expression):
    def __init__(self, operator, operand):
        super().__init__(operator, None)
        self.operand = operand
        self.data_type = get_max_data_type(DataType.Int, operand.data_type)
        if self.data_type is None:
            print("Error in unary expression")
        self.kind = AstNodeKind.UnaryExpression

    def __str__(self):
        return "{}\tOperator: {}\tResultant data type:{}".format(self.kind.name, self.token.lexeme, self.data_type.name)

    def get_children(self):
        return [self.operand]
