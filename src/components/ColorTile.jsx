import React from "react";

const InService = () => {

	return (
		<React.Fragment>
			<div style={{
			height: "10px",
		    width: "10px",
		    borderRadius: "3px",
			marginLeft:".2rem",
		    backgroundColor: "#f89903"}} ></div>
		    In Services
		</React.Fragment>
	);
}

const Reserved = () => {

	return(
		<React.Fragment>
			<div style={{
			height: "10px",
	    	width: "10px",
	    	borderRadius: "3px",
			marginLeft:".2rem",
	    	backgroundColor: "#1b70c0"}} ></div>	
	    	Reserved	
		</React.Fragment>
	);
}

const ROFR = () => {

	return(
		<React.Fragment>
			
	 	<div style={{
		height: "10px",
	    width: "10px",
	    borderRadius: "3px",
		marginLeft:".2rem",
	    backgroundColor: "#595959"}} ></div>
	    ROFR
		</React.Fragment>
	)
}

const Blocked = () => {

	return(
		<React.Fragment>
			
		<div style={{
		height: "10px",
	    width: "10px",
	    borderRadius: "3px",
		marginLeft:".2rem",
	    backgroundColor: "#000000"}} ></div>
	    Blocked
		</React.Fragment>
	)
}

const Available = () => {

	return(
		<React.Fragment>
			
		<div style={{
		height: "10px",
	    width: "10px",
	    borderRadius: "3px",
		marginLeft:".2rem",
	    backgroundColor: "#70ad47"}} ></div>
	    Available
		</React.Fragment>
	)
}
const Unavailable = () => {

	return(
		<React.Fragment>
			<div style={{
			height: "10px",
		    width: "10px",
		    borderRadius: "3px",
			marginLeft:".2rem",
		    backgroundColor: "#e0e2e5"}} ></div>
		    Unavailable
		</React.Fragment>
	);
}

export {
	InService,
	Reserved,
	ROFR,
	Blocked,
	Available,
	Unavailable
};