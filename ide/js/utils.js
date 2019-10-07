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

function JSONtoCompiler(){
	var object = eval('('+myDiagram.model.toJSON()+')');
	var links = object.linkDataArray;
	var nodes = object.nodeDataArray;

	var nextnode = nodes.find(function(elem){
		return elem.key == links[0].to;
	});

	boolyPrint(nextnode,true);

	function boolyPrint(node, path){

		var nextnode;
		switch(node.category){
			case categories.DECLARE:
				console.log(node.type + " " + node.variable + (node.array ? "[]" : ""));
				var nextLink = links.find(elem => elem.from == node.key);
					nextnode = nodes.find(elem => elem.key == nextLink.to);
					boolyPrint(nextnode, path);
			break;

			case categories.ASSIGNMENT:
				console.log(node.variable + " = " + node.expression);
				var nextLink = links.find(elem => elem.from == node.key);
					nextnode = nodes.find(elem => elem.key == nextLink.to);
					boolyPrint(nextnode, path);
			break;

			case categories.INPUT:
				console.log("input " + node.variable);
				var nextLink = links.find(elem => elem.from == node.key);
					nextnode = nodes.find(elem => elem.key == nextLink.to);
					boolyPrint(nextnode, path);
			break;

			case categories.OUTPUT:
				console.log("output " + node.expression);
				var nextLink = links.find(elem => elem.from == node.key);
					nextnode = nodes.find(elem => elem.key == nextLink.to);
					boolyPrint(nextnode, path);
			break;

			case categories.IF:
				console.log("if ("+node.condition+")");
				//true path
				var leftLink = links.find(elem => elem.from == node.key && elem.side == "Left");
				nextnode = nodes.find(elem => elem.key == leftLink.to);
				boolyPrint(nextnode,false);
				//false path
				var rightLink = links.find(elem => elem.from == node.key && elem.side == "Right");
				nextnode = nodes.find(elem => elem.key == rightLink.to);
				if (nextnode.category !== categories.ENDIF){
					console.log("else ");
					boolyPrint(nextnode,true);
				}
			break;

			case categories.ENDIF:
			console.log("endif");
				if(path){
					var nextLink = links.find(elem => elem.from == node.key);
					nextnode = nodes.find(elem => elem.key == nextLink.to);
					boolyPrint(nextnode, path);
				}
			break;

			/*case categories.FOR:
				console.log("for ("+node.variable+" = "+node.startValue + " to "+node.endValue + " step "+node.step+")");
				//loop path
				var loopLink = links.find(elem => elem.from == node.key && elem.side == "Right");
				nextnode = nodes.find(elem => elem.key == loopLink.to);
				boolyPrint(nextnode,false);
				//false path
				var rightLink = links.find(elem => elem.from == node.key && elem.side == "Right");
				nextnode = nodes.find(elem => elem.key == rightLink.to);
				if (nextnode.category !== categories.ENDIF)
					console.log("else ");
					boolyPrint(nextnode,true);
			break;*/

			case categories.END:
				console.log("END");
			break;
			default: console.log("-");
		}
	}
}