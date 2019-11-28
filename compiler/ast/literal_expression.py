from ast.expression import Expression
from ast.node_kind import AstNodeKind


class LiteralExpression(Expression):
    def __init__(self, token, data_type):
        super().__init__(token, data_type)
        self.kind = AstNodeKind.LiteralExpression
        self.value = token.value

    def __str__(self):
        return "{}\tdata type:{}\tvalue:{}".format(self.kind.name, self.data_type.name, self.value)

    def get_children(self):
        return []
