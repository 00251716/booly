from enum import Enum


class AstNodeKind(Enum):
    # Expressions
    BinaryExpression = 1
    UnaryExpression = 2
    LiteralExpression = 3
    VariableExpression = 4
    NegationExpression = 5
    AndExpression = 6
    OrExpression = 7
    ComparisonExpression = 8
