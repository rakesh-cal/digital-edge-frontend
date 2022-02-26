import React from 'react';

const XAlert = ({message,type}) => {

	if (message) {

		return(
			<p className={"alert-"+type}
			style={{
				height: "38px",
    			padding: "5px",
    			color: "#155724"
			}}
			> {message} </p>
		);
	}
	return null;
}

export default XAlert;




