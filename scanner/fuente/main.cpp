#include <FlexLexer.h>
#include <iostream>
#include <fstream>

int main(){
	
	std::ifstream input("program.txt");
	yyFlexLexer* lexer = new yyFlexLexer(&input);
	while(lexer->yylex() != 0) ;

	return 0;

}
