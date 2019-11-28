from ast.binary_expression import BinaryExpression
from ast.expression import Expression
from ast.literal_expression import LiteralExpression
from ast.unary_expression import UnaryExpression
from lexer.lexer import Lexer
from lexer.token_kind import TokenKind as Tk
from lexer.token import Token
from parser.expression_precedence import get_binary_precedence, get_unary_precedence
from symbol.type import DataType
from diagnostic.diagnostics import report_unexpected_token, report_unexpected_tokens

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
        report_unexpected_tokens(self.current, expected_tokens)

    def parse(self):
        return self.parse_expression()

    def parse_expression(self, parent_precedence=0):
        unary_precedence = get_unary_precedence(self.current.kind)
        if unary_precedence != 0:
            operator = self.get_token_and_move()
            operand = self.parse_expression(unary_precedence)
            left = UnaryExpression(operator, operand)
        else:
            left = self.factor()
        while True:
            precedence = get_binary_precedence(self.current.kind)
            if precedence == 0 or precedence <= parent_precedence:
                break
            operator = self.get_token_and_move()
            right = self.parse_expression(precedence)
            left = BinaryExpression(left, operator, right)
        return left

    def factor(self):
        if self.match(Tk.OpenParenthesisToken):
            self.move()
            expression = self.parse_expression()
            self.match_and_get(Tk.CloseParenthesisToken)
            return expression
        elif self.match(Tk.IntToken):
            current = self.current
            self.move()
            return LiteralExpression(current, DataType.Int)
        elif self.match(Tk.FloatToken):
            current = self.current
            self.move()
            return LiteralExpression(current, DataType.Float)
        else:
            report_unexpected_tokens(self.current, Tk.OpenParenthesisToken.name, Tk.IntToken.name, Tk.FloatToken.name)
            return LiteralExpression(Token(Tk.BadToken, None, self.current.line_number), DataType.Error)