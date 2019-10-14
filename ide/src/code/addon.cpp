#include <node.h>

void sum(const v8::FunctionCallbackInfo<v8::Value>& args){
	v8::Isolate* isolate = args.GetIsolate();

	int i;
	double a = 3.1415926, b = 2.718;
	for(i = 0; i < 1000000000; i++){
		a+=b;
	}

	auto total = v8::Number::New(isolate, a);

	args.GetReturnValue().Set(true);
}

void Initialize(v8::Local<v8::Object> exports){
	NODE_SET_METHOD(exports, "sum", sum);
}

NODE_MODULE(addon, Initialize)