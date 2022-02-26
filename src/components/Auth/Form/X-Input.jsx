import React from 'react';

const XInput = (params) => {

	const {
		label,
		type,
		placeholder
	} = params;

	return(
		<div className="mb-3">
			<label className="mb-1">
				<strong> {label} </strong>
			</label>
			<input type={type} className="form-control" placeholder={placeholder} />
			{params.children}
		</div>
	);
}

export default XInput;