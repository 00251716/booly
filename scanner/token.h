#ifndef GUARD_token_h
#define GUARD_token_h


enum class TokenType {
    number_tok,
    operator_tok
};

class Token {

    TokenType type;
    float value;

  public:

    Token(const TokenType &type, const float &value);

};

#endif
