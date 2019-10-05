#include <stdio.h>
#include <stdlib.h>
#include "auxiliar.h"
#include "lexer.h"

  int error(int no)
  {
  printf ("\n^ Error %d: Este numero es demasiado grande",no);
  fclose(fp);//cerrar el programa fuente
  exit(1); //error fatal
  }


  //construccion de la tabla de tokens para operadores y simboles especiales
  void inicializar_espec()
  {
   int i;
   for (i=0;i<=254;++i)
     espec[i]=null_tk;

   espec[43] =op_plus;
   espec[45]=op_less;
   espec[42]=op_per;
   espec[47]=op_bar;
   espec[94]=op_exp;
   espec[40]=popen;
   espec[41]=pclose;
   espec[44]=cont_inst;
   espec[59]=end_inst;
   espec[61] = op_assign;
  }

  //imprime_token: transforma de enumerado a string. no aparece mas en el compilador
  void imprime_token()
  {

   char *token_string[] = {"null_tk", "op_plus", "op_less", "op_per", "op_bar", "op_exp","popen", "pclose", "cont_inst",
                           "end_inst", "op_assign", "if_tk", "else_tk", "elsif_tk", "int_tk", "float_tk", "char_tk",
                           "str_tk", "bool_tk", "for_tk", "while_tk", "do_tk", "in_tk", "out_tk"};
   printf("(%10s) \n", token_string[token]);

  }
