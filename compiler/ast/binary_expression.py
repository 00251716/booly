from ast.expression import Expression
from symbol.type import get_max_data_type
from ast.node_kind import AstNodeKind
from diagnostic.diagnostics import report_incompatible_types

class BinaryExpression(Expression):
    def __init__(self, expr1, operator, expr2):
        super().__init__(operator, None)
        self.left = expr1
        self.right = expr2
        self.data_type = get_max_data_type(expr1.data_type, expr2.data_type)
        if self.data_type is None:
            report_incompatible_types(expr1.data_type.name, expr2.data_type.name, operator)
        self.kind = AstNodeKind.BinaryExpression

    def __str__(self):
        return "{}\tOperator: {}\tResultant data type:{}".format(self.kind.name, self.token.lexeme, self.data_type.name)
    
    def get_children(self):
        return [self.left, self.right]