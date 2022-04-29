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
const S1 = () => {

	return (
		<React.Fragment>
			<div style={{
			height: "10px",
		    width: "10px",
		    borderRadius: "3px",
			marginLeft:".2rem",
		    backgroundColor: "#e03138"}} ></div>
		    S1
		</React.Fragment>
	);
}

const S2 = () => {

	return (
		<React.Fragment>
			<div style={{
			height: "10px",
		    width: "10px",
		    borderRadius: "3px",
			marginLeft:".2rem",
		    backgroundColor: "#f78600"}} ></div>
		    S2
		</React.Fragment>
	);
}

const S3 = () => {

	return (
		<React.Fragment>
			<div style={{
			height: "10px",
		    width: "10px",
		    borderRadius: "3px",
			marginLeft:".2rem",
		    backgroundColor: "#f2dc34"}} ></div>
		   	S3
		</React.Fragment>
	);
}

const Today = () => {

	return (
		<React.Fragment>
			<div style={{
			height: "10px",
		    width: "10px",
		    borderRadius: "3px",
			marginLeft:".2rem",
		    backgroundColor: "#e03138"}} ></div>
		    Today
		</React.Fragment>
	);
}
const Tomorrow = () => {

	return (
		<React.Fragment>
			<div style={{
			height: "10px",
		    width: "10px",
		    borderRadius: "3px",
			marginLeft:".2rem",
		    backgroundColor: "#f89903"}} ></div>
		    Tomorrow
		</React.Fragment>
	);
}

const Complete = () => {

	return (
		<React.Fragment>
			<div style={{
			height: "10px",
		    width: "10px",
		    borderRadius: "3px",
			marginLeft:".2rem",
		    backgroundColor: "#c2adc2"}} ></div>
		    Complete
		</React.Fragment>
	);
}

export {
	InService,
	Reserved,
	ROFR,
	Blocked,
	Available,
	Unavailable,
	S1,
	S2,
	S3,
	Today,
	Tomorrow,
	Complete
};