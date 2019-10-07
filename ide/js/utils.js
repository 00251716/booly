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

//Download files function
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function upload(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
   	myDiagram.model = go.Model.fromJson(contents);
  };
  reader.readAsText(file);
}

//Set listeners to buttons
document.getElementById("dwn-btn").addEventListener("click", function(){
    var filename = "myDiagram.bly";
    download(filename, myDiagram.model.toJSON());
}, false);

document.getElementById("cmp-btn").addEventListener("click", function(){
    var filename = "myDiagram.txt";
    download(filename, JSONtoCompiler());
}, false);

document.getElementById('load-btn')
  .addEventListener('change', upload, false);

//Show and hide properties modal
function showContextMenu(){
	$('#contextMenu').modal('show'); 
}

function hideContextMenu(){
	$('#contextMenu').modal('hide');
}

function JSONtoCompiler(){
	var jsontext = "";
	var object = eval('('+myDiagram.model.toJSON()+')');
	var links = object.linkDataArray;
	var nodes = object.nodeDataArray;

	var nextnode = nodes.find(function(elem){
		return elem.key == links[0].to;
	});
	jsontext += "begin \n";
	boolyPrint(nextnode,true);

	function boolyPrint(node, path){

		var nextnode;
		switch(node.category){
			case categories.DECLARE:
				jsontext+=node.type + " " + node.variable + (node.array ? "[]" : "")+";\n";
				var nextLink = links.find(elem => elem.from == node.key);
					nextnode = nodes.find(elem => elem.key == nextLink.to);
					boolyPrint(nextnode, path);
			break;

			case categories.ASSIGNMENT:
			jsontext+=node.variable + " = " + node.expression+";\n";
				var nextLink = links.find(elem => elem.from == node.key);
					nextnode = nodes.find(elem => elem.key == nextLink.to);
					boolyPrint(nextnode, path);
			break;

			case categories.INPUT:
			jsontext+="input " + node.variable+"\n";
				var nextLink = links.find(elem => elem.from == node.key);
					nextnode = nodes.find(elem => elem.key == nextLink.to);
					boolyPrint(nextnode, path);
			break;

			case categories.OUTPUT:
			jsontext+="output " + node.expression+"\n";
				var nextLink = links.find(elem => elem.from == node.key);
					nextnode = nodes.find(elem => elem.key == nextLink.to);
					boolyPrint(nextnode, path);
			break;

			case categories.IF:
			jsontext+="if ("+node.condition+")"+"\n";
				//true path
				var leftLink = links.find(elem => elem.from == node.key && elem.fromPort == "Left");
				nextnode = nodes.find(elem => elem.key == leftLink.to);
				boolyPrint(nextnode,false);
				//false path
				var rightLink = links.find(elem => elem.from == node.key && elem.fromPort == "Right");
				nextnode = nodes.find(elem => elem.key == rightLink.to);
				if (nextnode.category !== categories.ENDIF){
					jsontext+="else "+"\n";
					boolyPrint(nextnode,true);
				}
			break;

			case categories.ENDIF:
				if(path){
					jsontext+="endif"+"\n";
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
				jsontext+="end"+"\n";
			break;
			default: jsontext+="-"+"\n";
		}
	}

	return jsontext;
}