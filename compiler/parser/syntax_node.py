from abc import ABC, abstractmethod


class Node(ABC):
    @property
    @abstractmethod
    def kind(self):
        return

    @kind.setter
    @abstractmethod
    def kind(self, value):
        return

    @abstractmethod
    def get_children(self):
        pass

