from lexer.token_kind import TokenKind as Sk


def get_unary_precedence(kind: Sk):
    if kind in {Sk.PlusToken, Sk.MinusToken, Sk.BangToken}:
        return 4
    else:
        return 0


def get_binary_precedence(kind: Sk):
    if kind == Sk.HatToken:
        return 3
    if kind in {Sk.StarToken, Sk.SlashToken, Sk.PercentToken}:
        return 2
    elif kind in {Sk.PlusToken, Sk.MinusToken}:
        return 1
    else:
        return 0
