from lexer.token import Token
from parser.parser import Parser
from ast.literal_expression import LiteralExpression
from diagnostic.diagnostics import diagnostics


def main():
    while True:
        try:
            text = input("calculator > ")
        except EOFError:
            break
        if not text:
            continue
        parser = Parser(text)
        node = parser.parse()
        if diagnostics:
            for error in diagnostics:
                print(error)
        else:
            pretty_print(node)
        diagnostics.clear()


def pretty_print(node, indent="", is_last=True):
    marker = "└──" if is_last else "├──"
    line = indent + marker + str(node)

    print(line)

    indent += "   " if is_last else "│  "
    last_child = node.get_children()[-1] if node.get_children() else None

    for child in node.get_children():
        pretty_print(child, indent, child == last_child)


main()
