#ifndef GUARD_lexer_h
#define GUARD_lexer_h

#include <iostream>
#include <string>
#include "token.h"

class Lexer {

  private:
    int currentPosition;
    char currentChar;
    std::string currentText;

  public:

    Token getToken();
};

#endif
