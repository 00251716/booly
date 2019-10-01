#include "lexer.h"
#include "token.h"

using std::cout;  using std::endl;

Token Lexer::getToken(){
  cout << "hey pretty" << endl;
  float value = 2.32;
  return Token(TokenType::number_tok, value);
};
