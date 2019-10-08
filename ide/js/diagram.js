/**
 * Names of the categories used to especify the node type in the diagram
 * @enum {string}
 */
const categories = {
    IF: "if",
    INPUT: "inny",
    OUTPUT: "outty",
    FOR: "forsy",
    WHILE: "whiley",
    DOWHILE: "dowhiley",
    DECLARE: "declare",
    ASSIGNMENT: "assign",
    START: "start",
    END: "end",
    ENDIF: "endif",
    ENDFOR: "endforsy",
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

const linkNames = {
    IFTRUE: "IfLeft",
    IFFALSE: "IfRight",
    LOOPFROM: "LoopTrue",
    LOOPTO: "LoopTrueEnd",
}

/**
 * List of instructions that use just one figure
 */
const simpleInstructions = [
    categories.INPUT, categories.OUTPUT, categories.DECLARE, categories.ASSIGNMENT
]

const loopInstructions = [
    categories.FOR, categories.WHILE, categories.DOWHILE
];

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
    initInspector();
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
        { key: "declare", category: categories.DECLARE, text: "Declare", text: "Declare", variable:"", type:"Integer", array:false},
		{ key: "assignment", category: categories.ASSIGNMENT, text: "Assignment", variable:"", expression:""},
		{ key: "input", category: categories.INPUT, text: "Input", variable:""},
		{ key: "output", category: categories.OUTPUT, text: "Output", expression:""},
		{ key: "if", category: categories.IF, text: "If", condition:""},
		{ key: "for", category: categories.FOR, text: "For", variable:"", startValue:"", endValue:"", direction:"Asc", step:""},
		{ key: "while", category: categories.WHILE, text: "While",  condition:""},
		{ key: "doWhile", category: categories.DOWHILE, text: "Do While",  condition:""}
    ];
}

function initDiagram(gojs) {
    let commonNodeProperties = { locationSpot: go.Spot.Center };
    let simpleInstructionProperties = { locationSpot: go.Spot.Center, fromSpot: go.Spot.Bottom, toSpot: go.Spot.Top }
    let endInstructionProperties = { strokeWidth: 1, width: 20, height: 20 }
    
    // #region Function declarations
    function dropOntoLink(e, obj) {
        let diagram = e.diagram;
        let newnode = diagram.selection.first();
        if (!(newnode instanceof go.Node) || newnode.linksConnected.count > 0) return;
        let oldlink = obj.part;
        let tonode = oldlink.toNode;
        let nodeCategory = newnode.category;
        if (nodeCategory !== categories.DOWHILE) {
            oldlink.toNode = newnode;
        }

        if (simpleInstructions.includes(nodeCategory)) {
            diagram.model.addLinkData({ from: newnode.data.key, to: tonode.data.key, toPort: oldlink.data.toPort });
        } else if (nodeCategory === categories.IF) {
            let endNodeKey = "end" + newnode.data.key
            diagram.model.addNodeData({ key: endNodeKey, category: categories.ENDIF, color: colors.IF })
            diagram.model.addLinkData({ from: newnode.data.key, to: endNodeKey, fromPort: linkNames.IFTRUE, text: "True", toPort: "True"})
            diagram.model.addLinkData({ from: newnode.data.key, to: endNodeKey, fromPort: "Right", text: "False", toPort: "False"})
            diagram.model.addLinkData({ from: endNodeKey, to: tonode.data.key, toPort: oldlink.data.toPort })
        } else if (nodeCategory === categories.FOR || nodeCategory === categories.WHILE) {
            diagram.model.addLinkData({ from: newnode.data.key, to: tonode.data.key, toPort: oldlink.data.toPort});
            diagram.model.addLinkData({ from: newnode.data.key, to: newnode.data.key, fromPort: linkNames.LOOPFROM, toPort: linkNames.LOOPTO });
        } else if (nodeCategory === categories.DOWHILE) {
            let endNodeKey = "end" + newnode.data.key;
            diagram.startTransaction();
            diagram.model.addNodeData({ key: endNodeKey, category: categories.ENDDOWHILE, color: colors.LOOP })
            diagram.commitTransaction("Added enddowhile node");
            enddo = diagram.findNodeForKey(endNodeKey);
            oldlink.toNode = enddo;
            diagram.model.addLinkData({ from: endNodeKey, to: newnode.data.key });
            diagram.model.addLinkData({ from: newnode.data.key, to: tonode.data.key });
            diagram.model.addLinkData({ from: newnode.data.key, to: endNodeKey });
        } else oldlink.toNode = tonode;
    }
    
    // Draw links between the parent and children nodes of a node being deleted.
    function exciseNode(node) {
        if (node === null) return;
        let linksOut = node.findLinksOutOf();
        let to = null;
        if (linksOut.count > 1) {
            to = findMerge(node);
            if (to.category === categories.ENDIF) {
                // If the category is and end of an if instruction, assign to to the next node
                // so the end if node can be removed
                nodeToRemove = to;
                to = to.findNodesOutOf().first();
                myDiagram.remove(nodeToRemove)
            }
        } else if (linksOut.count === 1) {  // if only one link out of the node to be deleted
            to = linksOut.first().toNode;
        }
        if (to !== null) {
            // now there is only a single output node to reconnect with
            // for all links coming into the node to be deleted
            let linksIn = new go.List().addAll(node.findLinksInto()).iterator;
            while (linksIn.next()) {
                let l = linksIn.value;  // reconnect all links going into deleted node
                l.toNode = to;          // to that one destination node
            }
        } else {
            node.diagram.removeParts(node.findLinksInto(), false);
        }
    }
  
    // If there are multiple links going out of this node,
    // return the node where the links merge back into one node, if any.
    function findMerge(node) {
        let it = node.findLinksOutOf();
        if (it.count <= 1) return null;
        node.diagram.nodes.each(function(n) { n._tag = 0; });
        let i = 1;
        while (it.next()) {
          let n = walkDown(it.value.toNode, i);
          if (n !== null) return n;
          i++;
        }
        return null;
    }
  
    // Mark all downstream nodes, but return the first node found that was already marked
    function walkDown(node, tag) {
        let prev = node._tag;
        if (prev !== 0 && prev !== tag) return node;
        node._tag = tag;
        if (prev === tag) return null;
        let it = node.findNodesOutOf();
        while (it.next()) {
            let n = walkDown(it.value, tag);
            if (n !== null) return n;
        }
        return null;
    }

    /**
     * Recursive function that removes all the nodes that do not
     * have a link coming into them, except for the start node
     * @param {go.Diagram} diagram 
     */
    function deleteDisconnectedNodes(diagram) {
        let nodesToDelete = diagram.nodes.filter(function(n) { 
            return n.category !== categories.START && isOnlyComingIntoItself(n)
        });
        if (nodesToDelete.count > 0) {
            diagram.removeParts(nodesToDelete, false);
            deleteDisconnectedNodes(diagram);
        }
    }

    /**
     * Verifies if the node has a link coming into it.
     * Returns true if it is a simple instruction and has no link
     * or if it is a loop instruction and has one link (from itself).
     * False otherwise.
     * @param {go.Node} node 
     */
    function isOnlyComingIntoItself(node) {
        if (loopInstructions.includes(node.category)) {
            return node.findLinksInto().count == 1;
        } else  {
            return node.findLinksInto().count == 0;
        }
    }

    function deleteNodeByCategory(node) {
        if (node.category === categories.ENDIF) {
            let toNode = node.findNodesOutOf().first();
            let ifNode = myDiagram.findNodeForKey(node.key.substring(3))
            let previousLink = ifNode.findLinksInto().first();
            previousLink.toNode = toNode;
        } 
        else if (node.category === categories.DOWHILE) {
            let endNode = myDiagram.findNodeForKey("end" + node.key);
            let linkIntoEndNode;
            endNode.findLinksInto().each((link) => {
                if (link.data.from !== node.key) {
                    linkIntoEndNode = link;
                }
            });
            let nextNode;
            node.findNodesOutOf().each((n) => {
                if (n !== endNode) {
                    nextNode = n;
                }
            });
            linkIntoEndNode.toNode = nextNode;
        } else if (node.category === categories.ENDDOWHILE) {
            let doWhileNode = myDiagram.findNodeForKey(node.key.substring(3));
            let linkIntoNode;
            node.findLinksInto().each((link) => {
                if (link.data.from !== doWhileNode.key) {
                    linkIntoNode = link;
                }
            });
            let nextNode;
            doWhileNode.findNodesOutOf().each((n) => {
                if (n !== node) {
                    nextNode = n;
                }
            });
            linkIntoNode.toNode = nextNode;
        } else if (node.category === categories.WHILE || node.category === categories.FOR) {
            let oldLink = node.findLinksInto().filter(link => { return link.toPort !== linkNames.LOOPTO } ).first();
            let nextNode = node.findLinksOutOf().filter(link => { return link.fromPort !== linkNames.LOOPFROM }).first().toNode;
            oldLink.toNode = nextNode;
        } else  {
            exciseNode(node);
        }
    }
    // #endregion

    myDiagram = gojs(go.Diagram, "my-diagram",
        {
            initialAutoScale: go.Diagram.UniformToFill,
			layout: gojs(go.LayeredDigraphLayout, { direction: 90, setsPortSpots: false,
				layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource, columnSpacing: 45}),
			// Funcion que se ejecuta mientras se borra un nodo del diagrama
            SelectionDeleting: function(e) {
                // console.log(e.subject.first().category)
                // exciseNode(e.subject.first()) // Deletes a node and its children
                deleteNodeByCategory(e.subject.first())
            },
            selectionDeleted: function(e) {
                deleteDisconnectedNodes(e.diagram);
            },
            "undoManager.isEnabled": true // Enables ctrl z and ctrl y to undo and redo, respectively
        }
    )

    // Definition of bootstrap modal as context menu
    var cxElement = document.getElementById("contextMenu");

    var myContextMenu = gojs(go.HTMLInfo, {
        show: showContextMenu,
        hide: hideContextMenu
    });

    // We don't want the div acting as a context menu to have a (browser) context menu!
    cxElement.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        return false;
    }, false);
    
    //Create nodes templates that actually shows in the diagram 
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
            { contextMenu: myContextMenu },
            gojs(go.Shape, "InternalStorage",
                { strokeWidth: 1, minSize: new go.Size(120, 40), fill: colors.DECLARE }),
            gojs(go.TextBlock, fontProperties, new go.Binding("text","",declareText).makeTwoWay())
        )
    );

    myDiagram.nodeTemplateMap.add(categories.ASSIGNMENT,
        gojs(go.Node, "Auto", simpleInstructionProperties,
            { contextMenu: myContextMenu },
            gojs(go.Shape, "Rectangle", 
                {  strokeWidth: 1, minSize: new go.Size(120, 40), fill: colors.ASSIGNMENT  }),
            gojs(go.TextBlock,  fontProperties, new go.Binding("text","",assignText).makeTwoWay())
    ));

    myDiagram.nodeTemplateMap.add(categories.INPUT,
        gojs(go.Node, "Auto", simpleInstructionProperties,
            { contextMenu: myContextMenu },
            gojs(go.Shape, "Parallelogram",
                { strokeWidth: 1, minSize: new go.Size(120, 40), fill: colors.INPUT }),
            gojs(go.TextBlock, fontProperties, new go.Binding("text","",inputText).makeTwoWay())
        )
    );

    myDiagram.nodeTemplateMap.add(categories.OUTPUT,
        gojs(go.Node, "Auto", simpleInstructionProperties,
            { contextMenu: myContextMenu },
            gojs(go.Shape, "Parallelogram",
                { strokeWidth: 1, minSize: new go.Size(120, 40), fill: colors.OUTPUT }),
            gojs(go.TextBlock, fontProperties, new go.Binding("text","",outputText).makeTwoWay())
        )
    );
    
    myDiagram.nodeTemplateMap.add(categories.IF,
        gojs(go.Node, "Spot", { toSpot: go.Spot.Top, locationSpot: go.Spot.Center },
            gojs(go.Panel, "Auto",
                { contextMenu: myContextMenu},
                gojs(go.Shape, "Diamond", 
                    { strokeWidth: 1, fill: colors.IF, minSize: new go.Size(80, 40) }),
                gojs(go.TextBlock, fontProperties,
                    new go.Binding("text","",conditionText).makeTwoWay())
            ),
            gojs(go.Shape, "Circle",
                { portId: linkNames.IFTRUE, fromSpot: go.Spot.Left, stroke: null,
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
        gojs(go.Node, "Spot", commonNodeProperties, { fromSpot: go.Spot.Bottom },
            gojs(go.Shape, "Circle", endInstructionProperties, new go.Binding("fill", "color")),
            gojs(go.Shape, "Circle",
                { portId: "True", toSpot: go.Spot.Left, stroke: null,
                alignment: go.Spot.Left, alignmentFocus: go.Spot.Left,
                fill: null, width: 1, height: 1 }
            ),
            gojs(go.Shape, "Circle",
                { portId: "False", toSpot: go.Spot.Right, stroke: null,
                alignment: go.Spot.Right, alignmentFocus: go.Spot.Right,
                fill: null, width: 1, height: 1 }
            )
        )
    )

    myDiagram.nodeTemplateMap.add(categories.FOR,
        gojs(go.Node, "Spot", { locationSpot: go.Spot.Center, fromSpot: go.Spot.Bottom, toSpot: go.Spot.Top },
            gojs(go.Panel, "Auto",
                { contextMenu: myContextMenu },
                gojs(go.Shape, "Hexagon", loopShapeProperties),
                gojs(go.TextBlock, fontProperties, new go.Binding("text","",forsyText).makeTwoWay()),
                gojs(go.Shape, "Circle",
                    { portId: linkNames.LOOPTO, toSpot: go.Spot.BottomRight, stroke: null,
                    alignment: go.Spot.BottomRight, alignmentFocus: go.Spot.BottomRight,
                    fill: null, width: 1, height: 1 }
                )
            ),
            gojs(go.Shape, "Circle",
                { portId: linkNames.LOOPFROM, fromSpot: go.Spot.Right, stroke: null,
                alignment: go.Spot.Right, alignmentFocus: go.Spot.Right,
                fill: null, width: 1, height: 1 }
            )
        )
    );

    myDiagram.nodeTemplateMap.add(categories.WHILE,
        gojs(go.Node, "Spot", { locationSpot: go.Spot.Center, fromSpot: go.Spot.Bottom, toSpot: go.Spot.Top },
            gojs(go.Panel, "Auto",
                { contextMenu: myContextMenu },
                gojs(go.Shape, "Hexagon", loopShapeProperties),
                gojs(go.TextBlock, fontProperties, new go.Binding("text","",conditionText).makeTwoWay()),
                gojs(go.Shape, "Circle",
                    { portId: linkNames.LOOPTO, toSpot: go.Spot.BottomRight, stroke: null,
                    alignment: go.Spot.BottomRight, alignmentFocus: go.Spot.BottomRight,
                    fill: null, width: 1, height: 1 }
                )
            ),
            gojs(go.Shape, "Circle",
                { portId: linkNames.LOOPFROM, fromSpot: go.Spot.Right, stroke: null,
                alignment: go.Spot.Right, alignmentFocus: go.Spot.Right,
                fill: null, width: 1, height: 1 }
            )
        )
    );

    myDiagram.nodeTemplateMap.add(categories.DOWHILE,
        gojs(go.Node, "Auto", commonNodeProperties, { contextMenu: myContextMenu, fromSpot: go.Spot.BottomRightSides, toSpot: go.Spot.Top },
            gojs(go.Shape, "Hexagon", loopShapeProperties),
            gojs(go.TextBlock, fontProperties, new go.Binding("text","",conditionText).makeTwoWay())
        )
    );

    myDiagram.nodeTemplateMap.add(categories.ENDDOWHILE,
        gojs(go.Node, "Auto", commonNodeProperties, { toSpot: go.Spot.TopRightSides, fromSpot: go.Spot.Bottom, toMaxLinks: 2 },
            gojs(go.Shape, "Circle", endInstructionProperties, new go.Binding("fill", "color")),
        )
    )
    
    myDiagram.model.nodeDataArray = [
        {key: "start", category: categories.START},
        {key: "end", category: categories.END},
    ];

    myDiagram.model.linkDataArray =  [
        {from: "start", to: "end"}
    ];
    
    // Parts dragged in from the Palette will be partly translucent
    myDiagram.findLayer("Tool").opacity = 0.5;

    // Property needed to remember portIds  
    myDiagram.model.linkFromPortIdProperty = "fromPort";
    myDiagram.model.linkToPortIdProperty = "toPort";

    // Estableciendo el formato para los links dentro del diagrama
    myDiagram.linkTemplate = gojs(go.Link,
        {
            routing: go.Link.AvoidsNodes,
            selectable: false,
            mouseDragEnter: function(e, link) { link.isHighlighted = true; },
            mouseDragLeave: function(e, link) { link.isHighlighted = false; },
            mouseDrop: dropOntoLink,
            layoutConditions: go.Part.LayoutAdded | go.Part.LayoutRemoved,
            corner: 4
        },
        gojs(go.Shape, { strokeWidth: 2 },
            new go.Binding("stroke", "isHighlighted", function(h) { return h ? "chartreuse" : "rgb(63,63,63)"; }).ofObject(),
            new go.Binding("strokeWidth", "isHighlighted", function(h) { return h ? 4 : 2; }).ofObject()), // Link shape
        gojs(go.Shape, { toArrow: "Standard" }), // Arrow shape
        gojs(go.Panel,  // link label for conditionals, normally not visible
            { visible: false, name: "LABEL", segmentIndex: 0, segmentFraction: 0 },
            new go.Binding("visible", "", function(link) { return link.fromNode.category === categories.IF && !!link.data.text; }).ofObject(),
            new go.Binding("segmentOffset", "fromPort", function(s) { return s === linkNames.IFTRUE ? new go.Point(0, 15) : new go.Point(0, -15); }),
            gojs(go.TextBlock,
                {
                //   textAlign: "center",
                  font: "10pt sans-serif",
                  margin: 5,
                  editable: false
                },
                new go.Binding("text").makeTwoWay())
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


function initInspector(){
	var inspector = new Inspector('myInspectorDiv', myDiagram,
		{
			// disallows for multiple nodes to be inspected at once
			multipleSelection: false,
			// uncomment this line to only inspect the named properties below instead of all properties on each object:
			includesOwnProperties: false,
			properties: {
				// an example of specifying the <input> type
				"variable" : {show: Inspector.showIfPresent, type:'text'},
				"condition" : {show: Inspector.showIfPresent, type:'text'},
				"expression" : {show: Inspector.showIfPresent, type:'text'},
				"startValue" : {show: Inspector.showIfPresent, type:'text'},
				"endValue" : {show: Inspector.showIfPresent, type:'text'},
				"type": {
					show: Inspector.showIfPresent,
					type: "select",
					choices: function(node, propName) {
						if (Array.isArray(node.data.choices)) return node.data.choices;
						return ["inty", "stringy", "chary", "booly"];
					}
				},
				"array": {show: Inspector.showIfPresent, type:'checkbox'},
				"direction": {
					show: Inspector.showIfPresent,
					type: "select",
					choices: function(node, propName) {
						if (Array.isArray(node.data.choices)) return node.data.choices;
						return ["Asc", "Desc"];
					}
				},
				"step" : {show: Inspector.showIfPresent, type:'number'}
			}
		});
}