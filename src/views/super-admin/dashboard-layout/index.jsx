import React from 'react';
import Header from './header';

const dashboardLayout = (props) => {


	return(
		<React.Fragment>
			<Header 
			selectDataCenter={props.selectDataCenter}
			selectedDataCenter={props.selectedDataCenter}
			></Header>
			{props.children}
		</React.Fragment>
	);
}

export default dashboardLayout;