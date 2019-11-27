from lexer.token import Token
from parser.parser import Parser


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
        if parser.errors:
            for error in parser.errors:
                print(error)
        else:
            pretty_print(node)


def pretty_print(node, indent="", is_last=True):
    marker = "└──" if is_last else "├──"
    line = indent + marker + node.kind.name

    if type(node) is Token and node.value is not None:
        line += " " + str(node.value)

    print(line)

    indent += "   " if is_last else "│  "
    last_child = node.get_children()[-1] if node.get_children() else None

    for child in node.get_children():
        pretty_print(child, indent, child == last_child)


main()
