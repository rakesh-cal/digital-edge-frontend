import React from "react";

const InService = () => {

	return <div style={{
		height: "10px",
	    width: "10px",
	    borderRadius: "3px",
		marginLeft:".2rem",
	    backgroundColor: "#f89903"}} ></div>;
}

const Reserved = () => {

	return <div style={{
		height: "10px",
	    width: "10px",
	    borderRadius: "3px",
		marginLeft:".2rem",
	    backgroundColor: "#1b70c0"}} ></div>;
}

const ROFR = () => {

	return <div style={{
		height: "10px",
	    width: "10px",
	    borderRadius: "3px",
		marginLeft:".2rem",
	    backgroundColor: "#595959"}} ></div>;
}

const Blocked = () => {

	return <div style={{
		height: "10px",
	    width: "10px",
	    borderRadius: "3px",
		marginLeft:".2rem",
	    backgroundColor: "#000000"}} ></div>;
}

const Available = () => {

	return <div style={{
		height: "10px",
	    width: "10px",
	    borderRadius: "3px",
		marginLeft:".2rem",
	    backgroundColor: "#70ad47"}} ></div>;
}

export {
	InService,
	Reserved,
	ROFR,
	Blocked,
	Available
};