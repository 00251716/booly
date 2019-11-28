from lexer.token_kind import TokenKind
from lexer.token import Token

diagnostics = []

def report(message):
    diagnostics.append(message)

def report_bad_character(line, char):
    message = "ERROR: Bad character input:'{}' on line {}".format(char, line)
    report(message)

def report_incompatible_types(type1, type2, operator: Token):
    message = "ERROR: Incompatible data types <{}> and <{}> for operator <{}> on line {}".format(type1, type2, operator.lexeme, operator.line_number)
    report(message)