from lexer.lexer import Lexer
from lexer.syntax_kind import SyntaxKind as tk
from parser.syntax_binary_expression import BinaryExpressionSyntax
from parser.syntax_literal_expression import LiteralExpressionSyntax
from parser.syntax_parenthesized_expression import ParenthesizedExpressionSyntax


class Parser:
    def __init__(self, text):
        self.lexer = Lexer(text)
        self.tokens = []
        self.position = 0
        while True:
            token = self.lexer.get_next_token()
            if token.kind == tk.EndOfFileToken:
                break
            if token.kind != tk.BadToken:
                self.tokens.append(token)
        self.errors = []
        self.errors.extend(self.lexer.errors)

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
        self.errors.append("ERROR: unexpected token <{}>, expected one of the following <{}>".format(self.current.kind, expected_tokens))

    def parse(self):
        return self.expression()

    def expression(self):
        left = self.term()
        while self.match(tk.PlusToken) or self.match(tk.MinusToken):
            operator = self.get_token_and_move()
            right = self.term()
            left = BinaryExpressionSyntax(left, operator, right)
        return left

    def term(self):
        left = self.factor()
        while self.match(tk.StarToken) or self.match(tk.SlashToken):
            operator = self.get_token_and_move()
            right = self.factor()
            left = BinaryExpressionSyntax(left, operator, right)
        return left

    def factor(self):
        if self.match(tk.OpenParenthesisToken):
            open = self.get_token_and_move()
            expression = self.expression()
            close = self.match_and_get(tk.CloseParenthesisToken)
            return ParenthesizedExpressionSyntax(open, expression, close)
        elif self.match(tk.IntToken):
            current = self.current
            self.move()
            return LiteralExpressionSyntax(current)
        elif self.match(tk.FloatToken):
            current = self.current
            self.move()
            return LiteralExpressionSyntax(current)
        else:
            return tk.BadToken
