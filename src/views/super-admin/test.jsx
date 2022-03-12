import React,{useEffect,useState,useRef} from "react";
import {nodeDataArray,linkDataArray,dataHallsArray} from "./data";
import Modal from 'react-modal';
import './App.css';

var myDiagram;
var go = window.go;
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    zIndex: 9,
    transform: 'translate(-50%, -50%)',
  },
};

const Test = () => {

	const [diagram,setDiagram] = useState("");
	const [state,setState] = useState();
	const [nodeData,setNodeData] = useState(nodeDataArray);
	const [linkData,setLinkData] = useState(linkDataArray);
	const isInitialMount = useRef(true);
	const [modalIsOpen, setIsOpen] = React.useState(false);
	const [currentObjState,setCurretObjState] = useState("");
	const [currentLinkedNode,setCurretLinkedNode] = useState([]);
	const [addCabinetModel, setAddCabinetModel] = useState(false);
	const [selectedFloor,setSelectedFloor] = useState("");
	const [dataHalls,setDataHalls] = useState("");
	const [aNode,setANode] = useState("");
	const [zNode,setZNode] = useState("");
	const [isReadOnly,setIsReadOnly] = useState(false);
	const [totalColors,setTotalColors] = useState("");
	const [showButton,setShowButton] = useState("");

	useEffect(() => {
		
		if (isInitialMount.current) {
		    
		    isInitialMount.current = false;
		    init();
		    getColors();
		   // setNodeData(nodeDataArray);
		   	//setLinkData(linkDataArray);

		} else {
			
		    onLoad();
		    console.log("called");
		    addNodeTemplate();

		}
			

	},[nodeData,linkData,isReadOnly]);

	const openModal = data => {
		setCurretObjState(data);
		getLinkedNode(data);
    	setIsOpen(true);
    }
    const closeModal = () => {
    	setIsOpen(false);
    	//setCurretObjState("");
    	//setCurretLinkedNode({});
    }
    const toggleAddCabinetModel = () => {
    	setAddCabinetModel(!addCabinetModel);
    }
    const onReadOnly = () => {
    	setIsReadOnly(!isReadOnly);
    }

    const getLinkedNode = data => {


    	const aEnd = linkData.filter(link => link.to === data.key);
    	const zEnd = linkData.filter(link => link.from === data.key);
    	if(aEnd.length){
    		console.log(aEnd[0])
    		setANode(aEnd[0]);
    	}else{
    		setANode("");
    	}
    	if(zEnd.length){
    		console.log(zEnd[0])
    		setZNode(zEnd[0]);
    	}else{
    		setZNode("");
    	}
    	//setCurretLinkedNode(currentLinked);
    }
    const addNewCabs = async () => {
    	
    	const data = nodeData;
    	await data.push({
    		key: state.name,
    		group: state.group
    	});

    	setState({
    		name:"",
    		group:""
    	});

    	setAddCabinetModel(!addCabinetModel);

    	setNodeData([...data]);
    }
    const showSelectColor = (color,event) => {

    	//setLinkData(linkDataArray);
    	const filteredLink = linkDataArray.filter(data => {
    		if(data.progress.color === color){
    			return data;
    		}
    	});
    	setLinkData(filteredLink);
    	//console.log(showButton);
    }

	async function init() {

		const $ = go.GraphObject.make;

		var myDiagram = $(go.Diagram, "myDiagramDiv");

		

      	myDiagram.linkTemplate =
	        $(go.Link,  // the whole link panel
	          {
	            curve: go.Link.Bezier,
	            adjusting: go.Link.Stretch,
	            reshapable: true, relinkableFrom: true, relinkableTo: true,
	            toShortLength: 3,
	            cursor:'pointer',
	           
	          },
	          	new go.Binding("points").makeTwoWay(),
	          	new go.Binding("curviness"),

	          	//this part of code is responsible for arrow color
		        $(go.Shape,  // the link shape
				// Tooltips
	          	{
			      toolTip:  // define a tooltip for each node that displays the color as text
			        $("ToolTip",
			          $(go.TextBlock, { margin: 4 },
			            new go.Binding("text", "data",data => JSON.stringify(data,null,4) ))
			        )  // end of Adornment
	   			},
	        
	            new go.Binding('stroke', 'progress', progress => {
	            	
	            	return progress?.status ? progress.color : 'black'
	            }),
	            new go.Binding('strokeWidth', 'progress', progress => progress?.status ? 2.5 : 1.5)),
	         
	          $(go.Shape,  // the arrowhead
	            { toArrow: "standard", stroke: null },
	            new go.Binding('fill', 'progress', (progress) => {
	            	
	            	return progress?.status ? progress.color : 'black'
	            })),
        
        	);



        myDiagram.groupTemplate =
		  $(go.Group, "vertical",

		    $(go.Panel, "Auto",
		      $(go.Shape, "RoundedRectangle",  // surrounds the Placeholder
		        { parameter1: 1,

		          fill: "white",height:250,width:400 }),
		      $(go.Placeholder,    // represents the area of all member parts,
		        { margin:10})  // with some extra padding around them
		    ),
		    $(go.TextBlock,  "myDiagram.isEnabled == false",       // group title
		      	{ 
		      		alignment: go.Spot.Left, 
		      		font: "Bold 12pt Sans-Serif",
		      		margin: 10
		      	},
		      new go.Binding("text", "key"))
		  );

		  //Node template

		  
		  	
		  myDiagram.nodeTemplate =
			$(go.Node, "Auto",
			    $(go.Shape, "RoundedRectangle", { fill: "white",height:40,width:150 }),
			    $(go.TextBlock,"myDiagram.isEnabled == false",
			    { 
		      		font: "7pt Sans-Serif",

		      	},
			    new go.Binding("text", "key"))
			);
		  	


			myDiagram.addDiagramListener("ObjectContextClicked",
		      	function(e) {
		        	var part = e.subject.part;
		        	if (!(part instanceof go.Link)){
		        		openModal(part.data);
		        	}
		    });

		 // console.log(Object.getOwnPropertyNames(go.Placeholder.name));
		myDiagram.toolManager.panningTool.isEnabled = false;

		myDiagram.model = new go.GraphLinksModel(nodeData, linkData);

		setDiagram(myDiagram);
		//myDiagram.panel("Table");
      // 	myDiagram.model = go.Model.fromJson(dataObj);

       

    }
    const onSave = () => {
    	const jsonData = JSON.parse(diagram.model.toJson());
    	setNodeData(jsonData.nodeDataArray);
    	setLinkData(jsonData.linkDataArray);
    }
    const onLoad = () => {

    	diagram.model = new go.GraphLinksModel(nodeData, linkData);
    }
    const getColors = async () => {
    	const test = linkData.map(data => {
    		return data.progress.color
    	});
    	const newArray = [...new Set(test)];

    	let colorsBtn = {};

    	await newArray.map(btn => {

    		colorsBtn = {
    			...colorsBtn,
    			[btn]:true
    		}
    	})

    	setShowButton(colorsBtn)

    	setTotalColors(newArray);
    }
    const getColorName = hexCode => {
    	let n_match = window.ntc.name(hexCode);
    	return n_match[1];
    }

    const addNodeTemplate = () => {

    	const $ = go.GraphObject.make;
    		let readOnlyStyle = {};
		  	if(isReadOnly){
		  		readOnlyStyle = {
		  			minLocation: new go.Point(NaN, NaN), 
			  		maxLocation: new go.Point(NaN, NaN)
		  		};
		  	}

    		diagram.nodeTemplate =
			$(go.Node, "Auto",readOnlyStyle,
			    $(go.Shape, "RoundedRectangle", { fill: "white",height:40,width:150 }),
			    $(go.TextBlock,"myDiagram.isEnabled == false",
			    { 
		      		font: "7pt Sans-Serif",

		      	},
			    new go.Binding("text", "key"))
			);

		diagram.groupTemplate =
		  $(go.Group, "vertical",
		  	readOnlyStyle,

		    $(go.Panel, "Auto",
		      $(go.Shape, "RoundedRectangle",  // surrounds the Placeholder
		        { parameter1: 1,

		          fill: "white",height:250,width:400 }),
		      $(go.Placeholder,    // represents the area of all member parts,
		        { margin:10})  // with some extra padding around them
		    ),
		    $(go.TextBlock,  "myDiagram.isEnabled == false",       // group title
		      	{ 
		      		alignment: go.Spot.Left, 
		      		font: "Bold 12pt Sans-Serif",
		      		margin: 10
		      	},
		      new go.Binding("text", "key"))
		  );


      	diagram.linkTemplate =
	        $(go.Link,  // the whole link panel
	          {
	            curve: go.Link.Bezier,
	            adjusting: go.Link.Stretch,
	            reshapable: !isReadOnly, relinkableFrom: !isReadOnly, relinkableTo: !isReadOnly,
	            toShortLength: 3,
	            cursor:'pointer',
	           
	          },
	          	new go.Binding("points").makeTwoWay(),
	          	new go.Binding("curviness"),

	          	//this part of code is responsible for arrow color
		        $(go.Shape,  // the link shape
				// Tooltips
	          	{
			      toolTip:  // define a tooltip for each node that displays the color as text
			        $("ToolTip",
			          $(go.TextBlock, { margin: 4 },
			            new go.Binding("text", "data",data => JSON.stringify(data,null,4) ))
			        )  // end of Adornment
	   			},
	        
	            new go.Binding('stroke', 'progress', progress => {
	            	
	            	return progress?.status ? progress.color : 'black'
	            }),
	            new go.Binding('strokeWidth', 'progress', progress => progress?.status ? 2.5 : 1.5)),
	         
	          $(go.Shape,  // the arrowhead
	            { toArrow: "standard", stroke: null },
	            new go.Binding('fill', 'progress', (progress) => {
	            	
	            	return progress?.status ? progress.color : 'black'
	            })),
        
        	);
    }


	return(
		<div>
			<div className="row">
				<div className="col-md-2">
					<button 
					className="btn btn-success"
					onClick={() => toggleAddCabinetModel()}
					>Add Cabinet  </button>
				</div>

				{totalColors && totalColors.map(color => {
					
					return (
						<div className="col-md-2">
					
							<label className="form-label">{getColorName(color)}</label>
							<label className="switch">

								<input 
								type="checkbox" 
								//checked={showButton[color]}
								onChange={() => {
									let colorsBtn = {};
									Object.keys(showButton).map(btn => {

										if (btn === color) {
											colorsBtn = {
												...showButton,
												[btn]:false
											}
										}else{

											colorsBtn = {
												...showButton,
												[btn]:false
											}
										}
									});
									setShowButton(colorsBtn);
									showSelectColor(color)
								}} />
							 	<div className="slider round" style={{backgroundColor:color}}>
							  
								  	<span className="on">ON</span>
								  	<span className="off">OFF</span>
							  
							 	</div>
							</label>
						</div>
					)
				})}
			
				
				

				<div className="col-md-2">
					
					<label className="form-label">ReadOnly</label>
					<label className="switch">
						<input 
						type="checkbox" 
						checked={isReadOnly} 
						onChange={() => setIsReadOnly(!isReadOnly)} />
					 	<div className="slider round">
					  
						  	<span className="on">ON</span>
						  	<span className="off">OFF</span>
					  
					 	</div>
					</label>
				</div>
			</div>
			
			<div 
			id="myDiagramDiv" 
			style={{
				border: "1px solid black",
				width: "100%",
				height: "760px",
				background: "whitesmoke",
				position: "relative",
				cursor: "auto",
				zIndex:1,
				font: "9pt helvetica, arial, sans-serif"
			}}>
		    	<canvas 
		    	tabIndex="0" 
		    	width="1054" 
		    	height="458" 
		    	style={{
		    		position: "absolute",
		    		top: "0px",
		    		left: "0px",
		    		zIndex: 2,
		    		userSelect: "none",
		    		touchAction: "none",
		    		width: "1054px",
		    		height: "458px",
		    		cursor:" auto"
		    	}}></canvas>
		    </div>
		   
		  <button onClick={() => onSave()}>Save</button>
		  <button onClick={() => onLoad()}>Load</button>
		  <textarea 
		  cols="100" 
		  rows="100" 
		  onChange={(event) => setNodeData(JSON.parse(event.target.value)) }
		  value={JSON.stringify(nodeData,null,4) }></textarea>
		  <textarea 
		  cols="100" 
		  rows="100" 
		  onChange={(event) => setLinkData(JSON.parse(event.target.value)) }
		  value={JSON.stringify(linkData,null,4) }></textarea>

			<Modal
	        isOpen={modalIsOpen}
	        onRequestClose={closeModal}
	        style={customStyles}
	        contentLabel="Example Modal"
	      	>
		        <h2 >Cabinet</h2>
		        <form>
		        <div className="row">
		        	<div className="col-md-12">
		        		<div className="form-group">
				        	<label for="name">Name</label>
				        	<input 
				        	type="text" 
				        	className="form-control" id="name" 
				        	value={currentObjState?.key}
				        	placeholder="cabinet name" />
				        </div>
		        	</div>
		        </div>
		       	<div className="row" style={{marginTop:"10px"}}>
				        	<div className="col-md-6">
				        		<div className="form-group">
						        	<label for="to">A-End</label>
						        	<input 
						        	type="text"
						        	className="form-control" 
						        	id="to" 
						        	value={aNode?.from}
						        	placeholder="to" />
						        </div>
				        	</div>

				        	<div className="col-md-6">
				        		<div className="form-group">
						        	<label for="color">Color</label>
						        	<input 
						        	type="text"
						        	className="form-control" 
						        	id="color" 
						        	value={aNode?.progress?.color}
						        	placeholder="color" />
						        </div>
				        	</div>
				        {/*	<div className="col-md-6">
				        		<div className="form-group">
						        	<label for="text">Link Label</label>
						        	<input 
						        	type="text"
						        	className="form-control" 
						        	id="text" 
						        	value={aNode?.text}
						        	placeholder="text" />
						        </div>
				        	</div>*/}
				        	
				</div>
		        <br/>
		        	<div className="row" style={{marginTop:"10px"}}>
				        	<div className="col-md-6">
				        		<div className="form-group">
						        	<label for="to">Z-End</label>
						        	<input 
						        	type="text"
						        	className="form-control" 
						        	id="to" 
						        	value={zNode?.to}
						        	placeholder="to" />
						        </div>
				        	</div>

				        	<div className="col-md-6">
				        		<div className="form-group">
						        	<label for="color">Color</label>
						        	<input 
						        	type="text"
						        	className="form-control" 
						        	id="color" 
						        	value={zNode?.progress?.color}
						        	placeholder="color" />
						        </div>
				        	</div>
				        {/*	<div className="col-md-4">
				        		<div className="form-group">
						        	<label for="text">Link Label</label>
						        	<input 
						        	type="text"
						        	className="form-control" 
						        	id="text" 
						        	value={aNode?.text}
						        	placeholder="text" />
						        </div>
				        	</div>*/}
				        	
				</div>
		        <br/>
		        
		        <button type="button" className="btn btn-primary">Submit</button>	
		        {" "}
		        <button type="button" className="btn btn-danger" onClick={()=> closeModal()}>Close</button>
		        </form>
		        
	      	</Modal>

	      	<Modal
	        isOpen={addCabinetModel}
	        style={customStyles}
	        contentLabel="Example Modal"
	      	>
		        <h2 >Add Cabinet</h2>
		        <form>
		        <div className="row">
		        	<div className="col-md-6">
		        		<div className="form-group">
				        	<label for="name">Floor</label>
				        	<select 
				        	className="form-control" 
				        	onChange={(event) => {

				        		setDataHalls(dataHallsArray[event.target.value]);
				        		setSelectedFloor(event.target.value);
				        	}} >
				        		<option value="1F">Select Floor</option>
				        		<option value="1F">1F</option>
				        		<option value="2F">2F</option>
				        		<option value="3F">3F</option>

				        	</select>
				        </div>
		        	</div>
		        	<div className="col-md-6">
		        		<div className="form-group">
				        	<label for="name">Data Hall</label>
				        	<select className="form-control" onChange={(event) => setState({...state,group:event.target.value})}>

				        		<option value="">Select Data Hall </option>
				        	{dataHalls && dataHalls.map(hall => {
				        		return(
				        			<option value={hall.name}>{hall.name} </option>
				        		)
				        	})}	
				        	</select>
				        </div>
		        	</div>
		        </div>
		        
		        <br/>

		        <div className="row">
		        	<div className="col-md-12">
		        		<div className="form-group">
				        	<label for="name">Cabinet Name</label>
				        	<input 
				        	type="text" 
				        	placeholder="Cabinet name"
				        	onChange={(event) => setState({...state,name:event.target.value})}
				        	className="form-control" />
				        </div>
		        	</div>
		        </div>
		        <br/>
		        <button 
		        type="button" 
		        onClick={() => addNewCabs()}
		        className="btn btn-primary">Submit</button>	
		        {" "}
		        <button 
		        type="button" 
		        className="btn btn-danger" 
		        onClick={()=> toggleAddCabinetModel()}>
		        	Close
		        </button>
		        </form>
		        
	      	</Modal>
		</div>
	)
}

export default Test;