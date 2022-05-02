import React from 'react'
import Header from './Header';
import Navigation from "views/super-admin/dashboard-layout/navigation";

const Layout  = (props) => {

	return(
		<div id="main-wrapper" className="show">
 
        	<Navigation/>
        	{props.children}
        </div>
	);
}

export default Layout;