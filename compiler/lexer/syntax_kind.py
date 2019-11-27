from enum import Enum


class SyntaxKind(Enum):
    # Tokens
    CharToken = 1
    IntToken = 2
    FloatToken = 3
    StringToken = 4
    PlusToken = 5
    MinusToken = 6
    StarToken = 7
    SlashToken = 8
    HatToken = 9
    PercentToken = 10
    AssignmentToken = 11
    AndToken = 12
    OrToken = 13
    EqualsToken = 14
    NotEqualsToken = 15
    LessToken = 16
    LessEqualsToken = 17
    GreaterToken = 18
    GreaterEqualsToken = 19
    OpenParenthesisToken = 20
    CloseParenthesisToken = 21
    CommaToken = 22
    IdentifierToken = 23
    EndOfInstructionToken = 24
    EndOfFileToken = 25
    BadToken = 26
    BangToken = 27

    # Keywords
    BeginKeyword = 28
    DoKeyword = 29
    ElseKeyword = 30
    EndForsyKeyword = 31
    EndIfKeyword = 32
    EndKeyword = 33
    EndWhileyKeyword = 34
    FalseKeyword = 35
    ForsyKeyword = 36
    FunctionKeyword = 37
    IfKeyword = 38
    InnyKeyword = 39
    OuttyKeyword = 40
    ReturnKeyword = 41
    TrueKeyword = 42
    TypeKeyword = 43
    WhileyKeyboard = 44
