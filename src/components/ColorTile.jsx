import React from "react";

const InService = () => {

	return <div style={{
		height: "12px",
	    width: "12px",
	    borderRadius: "3px",
	    marginRight: "4px",
	    backgroundColor: "#f89903"}} ></div>;
}

const Reserved = () => {

	return <div style={{
		height: "12px",
	    width: "12px",
	    borderRadius: "3px",
	    marginRight: "4px",
	    backgroundColor: "#1b70c0"}} ></div>;
}

const ROFR = () => {

	return <div style={{
		height: "12px",
	    width: "12px",
	    borderRadius: "3px",
	    marginRight: "4px",
	    backgroundColor: "#595959"}} ></div>;
}

const Blocked = () => {

	return <div style={{
		height: "12px",
	    width: "12px",
	    borderRadius: "3px",
	    marginRight: "4px",
	    backgroundColor: "#000000"}} ></div>;
}

const Available = () => {

	return <div style={{
		height: "12px",
	    width: "12px",
	    borderRadius: "3px",
	    marginRight: "4px",
	    backgroundColor: "#70ad47"}} ></div>;
}

export {
	InService,
	Reserved,
	ROFR,
	Blocked,
	Available
};