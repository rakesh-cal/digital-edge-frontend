import React from 'react'
import Header from './Header';

const Layout  = (props) => {

	return(
		<div id="main-wrapper" className="show">
 
        	<Header />
        	{props.children}
        </div>
	);
}

export default Layout;