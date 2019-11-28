from ast.binary_expression import BinaryExpression
from ast.literal_expression import LiteralExpression
from ast.not_expression import NotExpression
from ast.unary_expression import UnaryExpression
from lexer.lexer import Lexer
from lexer.token_kind import TokenKind as Tk
from lexer.token import Token



class Parser:
    def __init__(self, text):
        self.lexer = Lexer(text)
        self.tokens = []
        self.position = 0
        while True:
            token = self.lexer.get_next_token()
            self.tokens.append(token)
            if token.kind != Tk.BadToken:
                pass
            if token.kind == Tk.EndOfFileToken:
                break