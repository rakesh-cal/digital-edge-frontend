import React from 'react';
import {Link} from 'react-router-dom';

const Layout = (props) => {

	return (
		<div className="authincation h-100" style={{paddingTop:"4rem",backgroundColor:"#11263c"}}>
	        <div className="container h-100">
	            <div className="row justify-content-center h-100 align-items-center">
	                <div className="login_box">
					
						 	<div id="logo" className="text-center">
						 		<Link 
                            	to="/" >
                            		<img src="\images\logo@1x.png" 
						 			alt="" width="15%"
						 			/>
                            	</Link>
						 		
						 			
							 	<br/>
							<Link 
                            	to="/" >
                            	<img src="images\digital-edge-logo@1x.png" alt="" width="25%" />
                            </Link>
							 
							</div>

							{props.children}
	                </div>
	            </div>
	        </div>
	    </div>
	);
}

export default Layout;