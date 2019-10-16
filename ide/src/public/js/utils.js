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
	var object = JSON.parse(myDiagram.model.toJson());
	var links = object.linkDataArray;
	var nodes = object.nodeDataArray;
	let loopKeys = [];

	var nextnode = nodes.find(function(elem){
		return elem.key == links[0].to;
	});
	jsontext += "begin\n";
	boolyPrint(nextnode,true);

	function boolyPrint(node, indent = 1){
		let nextnode = getNextNode(node);
		if (getLastKey() === node.key 
			&& node.category != categories.DOWHILE 
			&& node.category != categories.ENDIF) {
			jsontext += getIndentation(node, --indent) +node.category+"\n";
			loopKeys.pop();
			boolyPrint(nextnode, indent);
		} 
		else {
			jsontext += getIndentation(node, indent);
			switch (node.category) {
				case categories.DECLARE:
					jsontext+=node.type + " " + node.variable + (node.array ? "[]" : "")+";\n";
					boolyPrint(nextnode, indent);
					break;
				case categories.ASSIGNMENT:
					jsontext+=node.variable + " = " + node.expression+";\n";
					boolyPrint(nextnode, indent);
					break;
				case categories.INPUT:
					jsontext+= categories.INPUT +" "+ node.variable+";\n";
					boolyPrint(nextnode, indent);
					break;
	
				case categories.OUTPUT:
					jsontext+=categories.OUTPUT + " " + node.expression+";\n";
					boolyPrint(nextnode, indent);
					break;
	
				case categories.IF:
					jsontext+="if ("+node.condition+")\n";
					// Making a copy of the next node on the right side
					// to avoid refind it later
					let rightNode = nextnode;

					loopKeys.push("end"+node.key);
					loopKeys.push("end"+node.key);

					//true path
					nextnode = getNextNode(node, true);
					boolyPrint(nextnode, indent + 1);
					//false path
					if (rightNode.category !== categories.ENDIF){
						jsontext += getIndentation(indent) + "else "+"\n";
					} else {
						jsontext = jsontext.substring(0, jsontext.length - indent);
					}
					boolyPrint(rightNode, ++indent);
					break;
	
				case categories.ENDIF:
					if (getLastKey() === node.key) {
						loopKeys.pop();
						if (getLastKey() === node.key){
							break;
						}

						jsontext+="endif"+"\n";
						boolyPrint(nextnode, --indent);
					}
					break;
	
				case categories.FOR:
					jsontext += categories.FOR + " (inty "+node.variable+" = "+node.startValue + "; "
								+node.variable + " = "+ node.endValue + "; "
								+node.variable +" = " + node.variable +" + "+ node.step + ")\n";
					nextnode = getNextNode(node);
					loopKeys.push("end" + node.key);
					boolyPrint(nextnode, ++indent);
					break;
	
				case categories.WHILE:
					jsontext += "whiley("+node.condition+")\n";
					//loop path
					nextnode = getNextNode(node);
					loopKeys.push("end" + node.key);
					boolyPrint(nextnode, ++indent);
					break;				
				case categories.ENDDOWHILE:
					jsontext += "do\n";
					nextnode = getNextNode(node);
					loopKeys.push(node.key.slice(3));
					boolyPrint(nextnode, ++indent);
					break;
				
				case categories.DOWHILE:
					jsontext += "whiley("+node.condition+");\n";
					nextnode = getNextNode(node);
					loopKeys.pop();
					boolyPrint(nextnode, --indent);
					break;

				case categories.END:
					jsontext+="end"+"\n";
					break;
				default: jsontext+="-"+"\n";
			}
		}
	}
	
	function getNextNode(node, isTrueValue = false) {
		let nextLink;
		switch (node.category) {
			case categories.IF:
				if (isTrueValue) {
					nextLink = links.find(elem => elem.from == node.key && elem.fromPort === linkNames.IFTRUE);
				}
				else {
					nextLink = links.find(elem => elem.from == node.key && elem.fromPort === linkNames.IFFALSE);
				}
				break;
			case categories.DOWHILE:
				nextLink = links.find(elem => elem.from == node.key && elem.to !== "end" + node.key);
				break;
			case categories.END:
				return;
			default:
				nextLink = links.find(elem => elem.from == node.key);
				break;
		}
		let nextnode = nodes.find(elem => elem.key == nextLink.to);
		return nextnode;
	}

	/**
	 * Returns the indentantion that correspondes to the especified node based
	 * on the current level of indentation	
	 * @param {go.Node} node current node to be indentend
	 * @param {Integer} level 
	 */
	function getIndentation(node, level) {
		let tab = "\t";
		switch (node.category) {
			case categories.ENDIF:
			case categories.DOWHILE:
				return tab.repeat(level - 1);
			case categories.END:
				return "";
			default:
				return tab.repeat(level);
		}
	}

	function getLastKey() { return loopKeys[loopKeys.length - 1]; }

	return jsontext;
}