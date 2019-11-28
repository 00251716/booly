from .token import Token
from .token_kind import TokenKind as Tk


class Lexer:
    position = -1
    line_number = 1
    keywords = ["begin", "booly", "chary", "do", "else", "endforsy", "endif", "end", "endwhiley", "false",
                "floaty", "forsy", "function", "if", "inny", "inty", "outty", "return", "stringy", "true"]
    keywordsToken = [Tk.BeginKeyword, Tk.TypeKeyword, Tk.TypeKeyword, Tk.DoKeyword, Tk.ElseKeyword, Tk.EndForsyKeyword,
                     Tk.EndIfKeyword,
                     Tk.EndKeyword, Tk.EndWhileyKeyword, Tk.FalseKeyword, Tk.TypeKeyword, Tk.ForsyKeyword,
                     Tk.FunctionKeyword, Tk.IfKeyword,
                     Tk.InnyKeyword, Tk.TypeKeyword, Tk.OuttyKeyword, Tk.ReturnKeyword, Tk.TypeKeyword, Tk.TrueKeyword]

    def __init__(self, code):
        self.code = code
        self.errors = []

    def peek(self, offset):
        index = self.position + offset
        if index >= len(self.code) or len(self.code) == 0:
            return '\0'
        return self.code[index]

    @property
    def current(self):
        return self.peek(0)

    @property
    def lookahead(self):
        return self.peek(1)

    def move(self):
        self.position += 1

    def get_next_token(self):
        self.move()
        self.read_whitespace()
        if self.current == "\0":
            return Token(Tk.EndOfFileToken, self.current, self.line_number)
        elif self.current == "+":
            return Token(Tk.PlusToken, self.current, self.line_number)
        elif self.current == "-":
            return Token(Tk.MinusToken, self.current, self.line_number)
        elif self.current == "*":
            return Token(Tk.StarToken, self.current, self.line_number)
        elif self.current == "/":
            return Token(Tk.SlashToken, self.current, self.line_number)
        elif self.current == "^":
            return Token(Tk.HatToken, self.current, self.line_number)
        elif self.current == "%":
            return Token(Tk.PercentToken, self.current, self.line_number)
        elif self.current == "&":
            if self.lookahead == "&":
                lexeme = self.current + self.lookahead
                self.move()
                return Token(Tk.AndToken, lexeme, self.line_number)
            else:
                return Token(Tk.BadToken, self.current, self.line_number)
        elif self.current == "|":
            if self.lookahead == "|":
                lexeme = self.current + self.lookahead
                self.move()
                return Token(Tk.OrToken, lexeme, self.line_number)
            else:
                return Token(Tk.BadToken, self.current, self.line_number)
        elif self.current == "=":
            if self.lookahead == "=":
                lexeme = self.current + self.lookahead
                self.move()
                return Token(Tk.EqualsToken, lexeme, self.line_number)
            else:
                return Token(Tk.AssignmentToken, self.current, self.line_number)
        elif self.current == "!":
            if self.lookahead == "=":
                lexeme = self.current + self.lookahead
                self.move()
                return Token(Tk.NotEqualsToken, lexeme, self.line_number)
            else:
                return Token(Tk.BangToken, self.current, self.line_number)
        elif self.current == "<":
            if self.lookahead == "=":
                lexeme = self.current + self.lookahead
                self.move()
                return Token(Tk.LessEqualsToken, lexeme, self.line_number)
            else:
                return Token(Tk.LessToken, self.current, self.line_number)
        elif self.current == ">":
            if self.lookahead == "=":
                lexeme = self.current + self.lookahead
                self.move()
                return Token(Tk.GreaterEqualsToken, lexeme, self.line_number)
            else:
                return Token(Tk.GreaterToken, self.current, self.line_number)
        elif self.current == "(":
            return Token(Tk.OpenParenthesisToken, self.current, self.line_number)
        elif self.current == ")":
            return Token(Tk.CloseParenthesisToken, self.current, self.line_number)
        elif self.current == ",":
            return Token(Tk.CommaToken, self.current, self.line_number)
        elif self.current == ";":
            return Token(Tk.EndOfInstructionToken, self.current, self.line_number)
        elif self.current.isdigit():
            return self.read_number()
        elif self.current.isalpha():
            return self.read_word()
        elif self.current == "\"":
            return self.read_string()
        else:
            # self.errors.append("ERROR: bad character input: '{}' in line number {}".format(self.current, self.line_number))
            return Token(Tk.BadToken, self.current, self.line_number)

    def read_whitespace(self):
        while self.current.isspace():
            if self.current == "\n":
                self.line_number += 1
            self.move()

    def read_number(self):
        v = int(self.current)
        while self.lookahead.isdigit():
            self.move()
            v = 10 * v + int(self.current)
        if self.lookahead != ".":
            return Token(Tk.IntToken, str(v), self.line_number, v)
        self.move()
        d = 10.0
        while self.lookahead.isdigit():
            self.move()
            v = v + (int(self.current) / d)
            d *= 10
        return Token(Tk.FloatToken, str(v), self.line_number, v)

    def read_word(self):
        lexeme = self.current
        while self.lookahead.isalpha() or self.lookahead.isdigit() or self.lookahead == "_":
            self.move()
            lexeme += self.current
        kind = self.get_keyword_or_identifier(lexeme)
        return Token(kind, lexeme, self.line_number)

    def read_string(self):
        lexeme = "\""
        self.move()
        while self.current != "\"":
            lexeme += self.current
            self.move()
        lexeme += "\""
        return Token(Tk.StringToken, lexeme, self.line_number, lexeme)

    def get_keyword_or_identifier(self, lexeme):
        for i in range(len(self.keywords)):
            if lexeme == self.keywords[i]:
                return self.keywordsToken[i]
        return Tk.IdentifierToken
