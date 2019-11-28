from ast.expression import Expression
from symbol.type import DataType


class LogicalExpression(Expression):
    def get_children(self):
        return [self.expression1, self.expression2]

    def __init__(self, token, expression1: Expression, expression2: Expression):
        super().__init__(token, None)
        self.expression1 = expression1
        self.expression2 = expression2
        self.data_type = self.check()

    def check(self):
        if self.expression1.data_type == DataType.Bool and self.expression2.data_type == DataType.Bool:
            return DataType.Bool
        else: return DataType.Error
