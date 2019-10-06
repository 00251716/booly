// "use strict";

/**
 * Names of the categories used to especify the node type in the diagram
 * @enum {string}
 */
const categories = {
	IF: "if",
	INPUT: "inny",
	OUTPUT: "outty",
	FOR: "fory",
	WHILE: "whiley",
	DOWHILE: "dowhiley",
	DECLARE: "declare",
	ASSIGNMENT: "assign",
	START: "start",
	END: "end",
	ENDIF: "endif",
	ENDFOR: "endfory",
	ENDWHILE: "endwhiley",
	ENDDOWHILE: "enddowhiley"
}

/**
 * Colors used by instruction
 * @enum {string} colors
 */
const colors = {
	IF: "lightpink",
	INPUT: "lightskyblue",
	OUTPUT: "palegreen",
	LOOP: "lightsalmon",
	DECLARE: "oldlace",
	ASSIGNMENT: "lightyellow",
	DEFAULT: "plum",
}

/**
 * List of instructions that use just one figure
 */
const simpleInstructions = [
	categories.INPUT, categories.OUTPUT, categories.DECLARE, categories.ASSIGNMENT
]

const fontProperties = { margin: 5, font: "15px sans-serif" }

const loopShapeProperties = { strokeWidth: 1, width: 40, height: 140, fill: colors.LOOP, angle: 90 };

/**
 * Executed when the website has finished loading
 */
$(function() {
    init();
});

/**
 * Initialize the object used to create the palette and the diagram
 */
function init() {
    let gojs = go.GraphObject.make;

    initPalette(gojs);
    initDiagram(gojs);
}

/**
 * This function creates the node's templates that will be dragged into
 * the diagram
 * @param {go.GraphObject.make} gojs 
 */
function initPalette(gojs) {
    let commonNodeProperties = { locationSpot: go.Spot.Center };

    myPalette = gojs(go.Palette, "my-palette",{
        contentAlignment: go.Spot.Center, // Centrar los elementos
        maxSelectionCount: 1,
        "layout.wrappingColumn": 1 // Especificar que sea de una columna
    })

    myPalette.nodeTemplateMap.add(categories.DECLARE,
        gojs(go.Node, "Auto", commonNodeProperties,
            gojs(go.Shape, "InternalStorage",
                { strokeWidth: 1, width: 120, height: 40, fill: colors.DECLARE }),
            gojs(go.TextBlock, fontProperties, new go.Binding("text"))
        )
    );

    myPalette.nodeTemplateMap.add(categories.ASSIGNMENT,
		gojs(go.Node, "Auto", commonNodeProperties,
			gojs(go.Shape, "Rectangle", 
				{ strokeWidth: 1, width: 120, height: 40, fill: colors.ASSIGNMENT }),
			gojs(go.TextBlock, fontProperties, new go.Binding("text"))
    ));
    
    myPalette.nodeTemplateMap.add(categories.INPUT,
		gojs(go.Node, "Auto", commonNodeProperties,
			gojs(go.Shape, "Parallelogram",
				{strokeWidth: 1, width: 120, height: 40, fill: colors.INPUT}),
			gojs(go.TextBlock, fontProperties, new go.Binding("text"))
		)
	);

	myPalette.nodeTemplateMap.add(categories.OUTPUT,
		gojs(go.Node, "Auto", commonNodeProperties,
			gojs(go.Shape, "Parallelogram",
				{strokeWidth: 1, width: 120, height: 40, fill: colors.OUTPUT}),
			gojs(go.TextBlock, fontProperties, new go.Binding("text"))
		)
    );
    
    myPalette.nodeTemplateMap.add(categories.IF,
		gojs(go.Node, "Auto", commonNodeProperties,
			gojs(go.Shape, "Diamond", 
				{ strokeWidth: 1, width: 80, height: 40, fill: colors.IF }),
			gojs(go.TextBlock, fontProperties, new go.Binding("text")),
        )
    );

    myPalette.nodeTemplateMap.add(categories.FOR,
		gojs(go.Node, "Auto", commonNodeProperties,
			gojs(go.Shape, "Hexagon", loopShapeProperties),
			gojs(go.TextBlock, fontProperties, new go.Binding("text"))
		)
	);

	myPalette.nodeTemplateMap.add(categories.WHILE,
		gojs(go.Node, "Auto", commonNodeProperties,
			gojs(go.Shape, "Hexagon", loopShapeProperties),
			gojs(go.TextBlock, fontProperties, new go.Binding("text"))
		)
	);

	myPalette.nodeTemplateMap.add(categories.DOWHILE,
		gojs(go.Node, "Auto", commonNodeProperties,
			gojs(go.Shape, "Hexagon", loopShapeProperties),
			gojs(go.TextBlock, fontProperties, new go.Binding("text"))
		)
	);

    myPalette.model.nodeDataArray = [
        { key: "declare", category: categories.DECLARE, text: "Declare"},
		{ key: "assignment", category: categories.ASSIGNMENT, text: "Assignment" },
		{ key: "input", category: categories.INPUT, text: "Input"},
		{ key: "output", category: categories.OUTPUT, text: "Output"},
		{ key: "if", category: categories.IF, text: "If" },
		{ key: "for", category: categories.FOR, text: "For" },
		{ key: "while", category: categories.WHILE, text: "While" },
		{ key: "doWhile", category: categories.DOWHILE, text: "Do While" }
    ];
}

function initDiagram(gojs) {
    let commonNodeProperties = { locationSpot: go.Spot.Center };
    let simpleInstructionProperties = { locationSpot: go.Spot.Center, fromSpot: go.Spot.Bottom, toSpot: go.Spot.Top }
    let endInstructionProperties = { strokeWidth: 1, width: 20, height: 20 }
    
    function dropOntoLink(e, obj) {
		let diagram = e.diagram;
		let newnode = diagram.selection.first();
		if (!(newnode instanceof go.Node) || newnode.linksConnected.count > 0) return;
		let oldlink = obj.part;
		let tonode = oldlink.toNode;
		oldlink.toNode = newnode;
		if (simpleInstructions.includes(newnode.category)) {
			diagram.model.addLinkData({ from: newnode.data.key, to: tonode.data.key })
		} else {
			endNodeKey = "end" + newnode.data.key
			diagram.model.addNodeData({ key: endNodeKey, category: categories.ENDIF, color: colors.IF })
			diagram.model.addLinkData({ from: newnode.data.key, to: endNodeKey, side: "Left" })
			diagram.model.addLinkData({ from: newnode.data.key, to: endNodeKey, side: "Right" })
			diagram.model.addLinkData({ from: endNodeKey, to: tonode.data.key })
		}
    }
    
    // Draw links between the parent and children nodes of a node being deleted.
    function exciseNode(node) {
		if (node === null) return;
		var linksOut = node.findLinksOutOf();
		var to = null;
		if (linksOut.count > 1) {
		  to = findMerge(node);
		} else if (linksOut.count === 1) {  // if only one link out of the node to be deleted
		  to = linksOut.first().toNode;
		}
		if (to !== null) {
		  // now there is only a single output node to reconnect with
		  // for all links coming into the node to be deleted
		  var linksIn = new go.List().addAll(node.findLinksInto()).iterator;
		  while (linksIn.next()) {
			var l = linksIn.value;  // reconnect all links going into deleted node
			l.toNode = to;          // to that one destination node
		  }
		} else {
		  node.diagram.removeParts(node.findLinksInto(), false);
		}
	}
  
	  // If there are multiple links going out of this node,
	  // return the node where the links merge back into one node, if any.
	function findMerge(node) {
		var it = node.findLinksOutOf();
		if (it.count <= 1) return null;
		node.diagram.nodes.each(function(n) { n._tag = 0; });
		var i = 1;
		while (it.next()) {
		  var n = walkDown(it.value.toNode, i);
		  if (n !== null) return n;
		  i++;
		}
		return null;
	}
  
	  // Mark all downstream nodes, but return the first node found that was already marked
	function walkDown(node, tag) {
		var prev = node._tag;
		if (prev !== 0 && prev !== tag) return node;
		node._tag = tag;
		if (prev === tag) return null;
		var it = node.findNodesOutOf();
		while (it.next()) {
			var n = walkDown(it.value, tag);
			if (n !== null) return n;
		}
		return null;
	}

    myDiagram = gojs(go.Diagram, "my-diagram",
        {
            initialAutoScale: go.Diagram.UniformToFill,
			layout: gojs(go.LayeredDigraphLayout, { direction: 90, setsPortSpots: false } ),
			// Funcion que se ejecuta mientras se borra un nodo del diagrama
			SelectionDeleting: function(e) {
				exciseNode(e.subject.first()) // Deletes a node and its children
			},
			"undoManager.isEnabled": true // Enables ctrl z and ctrl y to undo and redo, respectively
        }
    )

    

    myDiagram.nodeTemplateMap.add(categories.START,
		gojs(go.Node, "Auto",
			{
				locationSpot: go.Spot.Center,
				deletable: false,
				movable: false,
				fromSpot: go.Spot.Bottom,
				toSpot: go.Spot.None
			},
			new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
			gojs(go.Shape, "Ellipse",
				{ strokeWidth: 1, width:100, height:40, fill: colors.DEFAULT }
			),
			gojs(go.TextBlock, fontProperties, "Start")
		)
	);

	myDiagram.nodeTemplateMap.add(categories.END,
		gojs(go.Node, "Auto",
			{
				locationSpot: go.Spot.Center,
				deletable: false,
				movable: false,
				fromSpot: go.Spot.None,
				toSpot: go.Spot.Top
			},
			new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
			gojs(go.Shape, "Ellipse",
				{ strokeWidth: 1, width:100, height:40, fill: colors.DEFAULT }
			),
			gojs(go.TextBlock, fontProperties , "End")
		)
    );

    myDiagram.nodeTemplateMap.add(categories.DECLARE,
		gojs(go.Node, "Auto", simpleInstructionProperties,
			gojs(go.Shape, "InternalStorage",
				{ strokeWidth: 1, width: 120, height: 40, fill: colors.DECLARE }),
			gojs(go.TextBlock, fontProperties, new go.Binding("text").makeTwoWay())
		)
	);

    myDiagram.nodeTemplateMap.add(categories.ASSIGNMENT,
		gojs(go.Node, "Auto", simpleInstructionProperties,
			gojs(go.Shape, "Rectangle", 
				{  strokeWidth: 1, width: 120, height: 40, fill: colors.ASSIGNMENT  }),
			gojs(go.TextBlock,  fontProperties, new go.Binding("text").makeTwoWay())
	));

	myDiagram.nodeTemplateMap.add(categories.INPUT,
		gojs(go.Node, "Auto", simpleInstructionProperties,
			gojs(go.Shape, "Parallelogram",
				{ strokeWidth: 1, width: 120, height: 40, fill: colors.INPUT }),
			gojs(go.TextBlock, fontProperties, new go.Binding("text").makeTwoWay())
		)
	);

	myDiagram.nodeTemplateMap.add(categories.OUTPUT,
		gojs(go.Node, "Auto", simpleInstructionProperties,
			gojs(go.Shape, "Parallelogram",
				{ strokeWidth: 1, width: 120, height: 40, fill: colors.OUTPUT }),
			gojs(go.TextBlock, fontProperties, new go.Binding("text").makeTwoWay())
		)
    );
    
    myDiagram.nodeTemplateMap.add(categories.IF,
		gojs(go.Node, "Spot",
			gojs(go.Panel, "Auto",
				gojs(go.Shape, "Diamond", 
					{ strokeWidth: 1, width: 80, height: 40, fill: colors.IF }),
				gojs(go.TextBlock, fontProperties, new go.Binding("text").makeTwoWay())
			),
			gojs(go.Shape, "Circle",
				{ portId: "Left", fromSpot: go.Spot.Left, stroke: null,
				alignment: go.Spot.Left, alignmentFocus: go.Spot.Left,
				fill: null, width: 1, height: 1 }
			),
			gojs(go.Shape, "Circle",
				{ portId: "Right", fromSpot: go.Spot.Right, stroke: null,
				alignment: go.Spot.Right, alignmentFocus: go.Spot.Right,
				fill: null, width: 1, height: 1 }
			)
		)
	);
	
	myDiagram.nodeTemplateMap.add(categories.ENDIF,
		gojs(go.Node, "Auto", commonNodeProperties, { toSpot: go.Spot.LeftRightSides, fromSpot: go.Spot.Bottom },
			gojs(go.Shape, "Circle", endInstructionProperties, new go.Binding("fill", "color")),
		)
    )
    
    myDiagram.nodeTemplateMap.add(categories.FOR,
		gojs(go.Node, "Auto", commonNodeProperties,
			gojs(go.Shape, "Hexagon", loopShapeProperties),
			gojs(go.TextBlock, fontProperties, new go.Binding("text").makeTwoWay())
		)
	);

	myDiagram.nodeTemplateMap.add(categories.WHILE,
		gojs(go.Node, "Auto", commonNodeProperties,
			gojs(go.Shape, "Hexagon", loopShapeProperties),
			gojs(go.TextBlock, fontProperties, new go.Binding("text").makeTwoWay())
		)
	);

	myDiagram.nodeTemplateMap.add(categories.DOWHILE,
		gojs(go.Node, "Auto", commonNodeProperties,
			gojs(go.Shape, "Hexagon", loopShapeProperties),
			gojs(go.TextBlock, fontProperties, new go.Binding("text").makeTwoWay())
		)
	);
    
    myDiagram.model.nodeDataArray = [
		{key: "start", category: categories.START},
		{key: "end", category: categories.END},
	];

	myDiagram.model.linkDataArray =  [
		{from: "start", to: "end"}
    ];
    
    // Parts dragged in from the Palette will be partly translucent
	myDiagram.findLayer("Tool").opacity = 0.5;

	myDiagram.model.linkFromPortIdProperty = "side";

	// Estableciendo el formato para los links dentro del diagrama
	myDiagram.linkTemplate = gojs(go.Link,
		{
			routing: go.Link.AvoidsNodes,
			selectable: false,
			mouseDragEnter: function(e, link) { link.isHighlighted = true; },
            mouseDragLeave: function(e, link) { link.isHighlighted = false; },
			mouseDrop: dropOntoLink,
			layoutConditions: go.Part.LayoutAdded | go.Part.LayoutRemoved
		},
		gojs(go.Shape, { strokeWidth: 2 },
			new go.Binding("stroke", "isHighlighted", function(h) { return h ? "chartreuse" : "rgb(63,63,63)"; }).ofObject(),
			new go.Binding("strokeWidth", "isHighlighted", function(h) { return h ? 4 : 2; }).ofObject()), // Link shape
		gojs(go.Shape, { toArrow: "Standard" }), // Arrow shape
		gojs(go.Panel,  // link label for conditionals, normally not visible
            { visible: false, name: "LABEL", segmentIndex: 1, segmentFraction: 0.5 },
            new go.Binding("visible", "", function(link) { return link.fromNode.category === categories.IF && !!link.data.text; }).ofObject(),
            new go.Binding("segmentOffset", "side", function(s) { return s === "Left" ? new go.Point(0, 14) : new go.Point(0, -14); }),
          )
	);

	myDiagram.addDiagramListener("ExternalObjectsDropped", function(e) {
        var newnode = e.diagram.selection.first();
        if (newnode.linksConnected.count === 0) {
          // when the selection is dropped but not hooked up to the rest of the graph, delete it
          e.diagram.commandHandler.deleteSelection();
        }
	});
}