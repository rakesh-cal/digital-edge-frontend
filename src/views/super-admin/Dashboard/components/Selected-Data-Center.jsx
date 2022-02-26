import React from 'react';

const SelectedDataCenter = ({selectedDataCenter}) => {

	if(selectedDataCenter){

		return (
			<div className="txt_invglob">
				<p>{selectedDataCenter.name} <span> {selectedDataCenter.address}</span></p>
			</div>
		);
	}

	return null;

}


export default SelectedDataCenter;