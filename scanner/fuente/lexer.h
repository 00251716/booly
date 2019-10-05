#include "parametros.h"

extern char *lexpal[MAXPAL];

enum simbolo{null_tk,op_plus,op_less,op_per,op_bar,op_exp,popen,pclose,cont_inst,end_inst,	op_assign,
				if_tk,else_tk,elsif_tk,int_tk,float_tk,char_tk,str_tk,bool_tk,for_tk,while_tk,do_tk,
				in_tk,out_tk,abs_tk,max_tk,min_tk,sqrt_tk,len_tk,subst_tk,pow_tk,charat_tk,sort_tk,
				random_tk,ident,number,lessl,morer};

extern enum simbolo token;

extern enum simbolo tokpal [MAXPAL];

extern enum simbolo espec[255] ;
