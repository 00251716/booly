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

    @property
    def current(self):
        return self.peek(0)

    def move(self):
        self.position += 1

    def get_token_and_move(self):
        current = self.current
        self.move()
        return current

    def peek(self, offset):
        index = self.position + offset
        if index >= len(self.tokens):
            return self.tokens[-1]
        return self.tokens[index]

    def match(self, kind):
        return self.current.kind == kind

    def match_and_get(self, *kinds):
        last_kind = kinds[-1]
        expected_tokens = ""
        for kind in kinds:
            if self.current.kind == kind:
                return self.get_token_and_move()
            expected_tokens += kind.name + (""  if last_kind == kind else ", ")