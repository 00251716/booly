from abc import ABC
from ast.node import Node


class Expression(Node, ABC):
    def __init__(self, token, data_type):
        self.token = token
        self.data_type = data_type
