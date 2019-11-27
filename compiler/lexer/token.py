from parser.syntax_node import Node


class Token(Node):
    _kind = None

    def __init__(self, kind, lexeme, value=None):
        self.kind = kind
        self.lexeme = lexeme
        self.value = value

    def __str__(self):
        return "kind: {}\nlexeme: {}\nvalue: {}\n".format(self.kind, self.lexeme, self.value)

    def get_children(self):
        return []

    @property
    def kind(self):
        return self._kind

    @kind.setter
    def kind(self, token_kind):
        self._kind = token_kind
