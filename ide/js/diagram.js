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
 * @enum {string}
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