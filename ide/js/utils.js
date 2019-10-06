//Callback functions for nodes text
function forsyText(info) {
	var str = "";
	if (info.variable && info.startValue && info.endValue
		&& info.direction && info.step) 
		str += info.variable + " = " + info.startValue + " to " + info.endValue;
	else str = info.text;
	return str;
}

function forsyTextData(text, data, model){
	model.setDataProperty(data, "text", text);
}

function declareText(info) {
	var str = "";
	if (info.variable) str += info.type + " " + info.variable;
	else str = info.text;
	return str;
}

function assignText(info) {
	var str = "";
	if (info.variable && info.expression) str += info.variable + " = " + info.expression;
	else str = info.text;
	return str;
}

function conditionText(info) {
	var str = "";
	if (info.condition) str += info.condition;
	else str = info.text;
	return str;
}

function inputText(info) {
	var str = "";
	if (info.variable) str += "Input " + info.variable;
	else str = info.text;
	return str;
}

function outputText(info) {
	var str = "";
	if (info.expression) str = info.expression;
	else str = info.text;
	return str;
}

//Show and hide properties modal
function showContextMenu(){
	$('#contextMenu').modal('show'); 
}

function hideContextMenu(){
	$('#contextMenu').modal('hide');
}
