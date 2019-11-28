from lexer.token_kind import TokenKind
from lexer.token import Token

diagnostics = []

def report(message):
    diagnostics.append(message)

def report_bad_character(line, char):
    message = "ERROR: Bad character input:'{}' on line {}".format(char, line)
    report(message)

def report_unexpected_token(current: Token, expected: Token):
    message = "ERROR: Unexpected token <{}>, expected <{}>".format(current.kind.name, expected.kind.name)
    report(message)

def report_unexpected_tokens(current: Token, *expected):
    message = "ERROR: Unexpected token <{}>, expected one of the following <{}>".format(current.kind.name, expected)
    report(message)

def report_incompatible_types(type1, type2, operator: Token):
    message = "ERROR: Incompatible data types <{}> and <{}> for operator <{}> on line {}".format(type1, type2, operator.lexeme, operator.line_number)
    report(message)