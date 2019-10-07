%{
	#include <iostream>
%}

%option c++
%option outfile="Scanner.cpp"
%option noyywrap

begin_tk		"begin"
digit_tk 		[0-9]
char_tk 		[a-zA-ZñÑ] 
type_tk		inty|chary|stringy|booly
if_tk			if
endif_tk		endif
else_tk		else
elsif_tk		elsif
for_tk			forsy
while_tk		whiley
do_tk			doey
in_tk			inny
out_tk			output
arithmetic_op_tk	"+"|"-"|"*"|"/"|"^"|"%"		
popen_tk		"("
pclose_tk		")"
end_inst_tk		";"
null_tk		nully
int_tk 		{digit_tk}+
float_tk 		{digit_tk}+"."{digit_tk}+
str_tk			\"(\\.|[^"\\])*\"
bool_tk		True|False
comparison_tk		">"|"<"|">="|"<="|"=="|"!="
identifier_tk		{char_tk}({char_tk}|{digit_tk}|"_")*

abs_tk			absy
max_tk			maxy
min_tk			miny
sqrt_tk		sqrt
len_tk			lengthy
subst_tk		substry
pow_tk			powy
charat_tk		charAt
sort_tk		sorty
rand_tk		randy
odd_tk			oddy
even_tk		even
end_tk			end

%%

{begin_tk}		{std::cout << "begin_tk: " << yytext << std::endl;}
{type_tk}		{std::cout << "type_tk: " << yytext << std::endl;}
{if_tk}		{std::cout << "if_tk: " << yytext << std::endl;}
{else_tk}		{std::cout << "else_tk: " << yytext << std::endl;}
{endif_tk}		{std::cout << "endif_tk: " << yytext << std::endl;}
{popen_tk}		{std::cout << "popen_tk: " << yytext << std::endl;}
{pclose_tk}		{std::cout << "pclose_tk: " << yytext << std::endl;}
{comparison_tk} 	{std::cout << "comaprison_tk: " << yytext << std::endl;}
{arithmetic_op_tk}	{std::cout << "arithmetic_op_tk: " << yytext << std::endl;}
{out_tk}		{std::cout << "out_tk: " << yytext << std::endl;}
{end_inst_tk}		{std::cout << "end_inst_tk: " << yytext << std::endl;}
{str_tk}		{std::cout << "str_tk: " << yytext << std::endl;}
{identifier_tk}		{std::cout << "identifier_tk: " << yytext << std::endl;}
{int_tk}		{std::cout << "int_tk: " << yytext << std::endl;}
[" "\n\t]		;
.			;

%%
