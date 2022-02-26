import React from 'react';

const XError = (props) => {

	const {message} = props;

	if( Boolean(message) === true){

		return(
			<small className="form-text text-danger">
				{message}
			</small>
		)
	}

	return null;
}

export default XError;