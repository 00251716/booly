#include "token.h"

Token::Token(const TokenType &type, const float &value){
  this->type = type;
  this->value = value;
}
