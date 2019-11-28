from lexer.token_kind import TokenKind as Sk


def get_unary_precedence(kind: Sk):
    if kind in {Sk.PlusToken, Sk.MinusToken, Sk.BangToken}:
        return 7
    else:
        return 0


def get_binary_precedence(kind: Sk):
    if kind == Sk.HatToken:
        return 6
    if kind in {Sk.StarToken, Sk.SlashToken, Sk.PercentToken}:
        return 5
    elif kind in {Sk.PlusToken, Sk.MinusToken}:
        return 4
    elif kind in {Sk.EqualsToken, Sk.NotEqualsToken, Sk.LessToken, Sk.LessEqualsToken, Sk.GreaterEqualsToken,
                  Sk.GreaterToken}:
        return 3
    elif kind == Sk.AndToken:
        return 2
    elif kind == Sk.OrToken:
        return 1
    else:
        return 0
