import React from 'react';

const XError = (props) => {

	const {errorMessage,show} = props;

	if(show === true){

		return(
			<small className="form-text text-danger">
				{errorMessage}
			</small>
		)
	}

	return null;
}

export default XError;