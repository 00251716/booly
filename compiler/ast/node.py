from abc import ABC, abstractmethod


class Node(ABC):
    kind = None

    @abstractmethod
    def get_children(self):
        pass