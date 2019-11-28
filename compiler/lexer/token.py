
class Token:

    def __init__(self, kind, lexeme, line_number=0, value=None):
        self.kind = kind
        self.line_number = line_number
        self.lexeme = lexeme
        self.value = value

    def __str__(self):
        return "kind: {}\nlexeme: {}\nvalue: {}\n".format(self.kind, self.lexeme, self.value)

