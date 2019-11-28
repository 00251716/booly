from symbol.symbol import Symbol


class DataType(Symbol):
    def __init__(self, name):
        super().__init__(name)


DataType.Bool = DataType("booly")
DataType.Char = DataType("chary")
DataType.Int = DataType("inty")
DataType.Float = DataType("floaty")
DataType.String = DataType("stringy")
DataType.Error = DataType("?")


def is_numeric(dt):
    return dt in {DataType.Char, DataType.Int, DataType.Float}


def get_max_data_type(expression1, expression2):
    if not is_numeric(expression1) or not is_numeric(expression2):
        return DataType.Error
    elif expression1 == DataType.Float or expression2 == DataType.Float:
        return DataType.Float
    elif expression1 == DataType.Int or expression2 == DataType.Int:
        return DataType.Int
    else:
        return DataType.Char
