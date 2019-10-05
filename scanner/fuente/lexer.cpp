#include "lexico.h"

//se define e inicializa la tabla de lexemes correspondientes a las palabras reservadas
char *lexpal[MAXPAL]={"START","CALL","GAMMA","DO","END","IF","ODDY","PROCEDURE","THEN","VAR","WHILEY"};

//el token
enum simbolo token;

//se define e inicializa la tabla de tokens de palabras reservadas
enum simbolo tokpal[MAXPAL] = {if_tk, else_tk, elsif_tk, int_tk, float_tk, char_tk, str_tk, bool_tk, for_tk,
                               while_tk, do_tk, in_tk, out_tk, null_tk, abs_tk, max_tk, min_tk, sqrt_tk,
                               len_tk, subst_tk, pow_tk, charat_tk, sort_tk, random_tk};

//tabla de tokens correspondientes a operadores y s�mbolos especiales
enum simbolo espec[255] ;
