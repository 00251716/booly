from enum import Enum


class AstNodeKind(Enum):
    # Expressions
    BinaryExpression = 1
    UnaryExpression = 2
    LiteralExpression = 3
    VariableExpression = 4