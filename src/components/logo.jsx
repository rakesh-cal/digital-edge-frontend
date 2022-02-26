import React from 'react';
import {Link} from 'react-router-dom';

const Logo = () => {


	return (
		<div className="header-left">
			<div className="nav-header">
				
				<Link to="/data-center" className="brand-logo" id="headlogo">
					<img src="\images\logo.png" alt="" /> 
				
					
				</Link>
			</div>
		</div>
	);
}

export default Logo;