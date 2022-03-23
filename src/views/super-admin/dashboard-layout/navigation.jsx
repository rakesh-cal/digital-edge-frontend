import React,{useRef} from 'react';
import StorageContext from "context";
import { useNavigate,Link,useLocation } from "react-router-dom";
import XLogo from 'components/logo';
import {auth} from 'services/auth';

const Navigation = () => {

	let navigate = useNavigate();

	const contextData = React.useContext(StorageContext);
	const [invisibleMenu,setInvisibleMenu] = React.useState(false);
	const [state,setState] = React.useState({
		initialName:"",
		fullName:""
	});
	const location = useLocation();
	const isInitialMount = useRef(true);
	React.useEffect(() => {
		//user();
		if (isInitialMount.current) {
			
		    isInitialMount.current = false;
		    user();
		}

		short();
		if(location.pathname.split('/')[1] === 'setting'){
			setInvisibleMenu(true);
		}else{
			setInvisibleMenu(false);
		}

	},[contextData.getAuth]);

	const onLogout = (event) => {

		event.preventDefault();

		contextData.logout();

		navigate(`/`);
	}
	const user = async () => {
		const token = localStorage.getItem('token')

		await auth(token).then(res => {

			contextData.setAuth(res.data.user);

		}).catch(err => {

			localStorage.removeItem('token');
		})
	}
	const short = () => {

		if (contextData.getAuth && contextData.getAuth.name) {

			let initials ="";
			const fullName = contextData.getAuth.name.split(' ');

			if(fullName.length > 1){

				initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
			}else{
				initials = fullName.shift().charAt(0);
			}
			setState({
				initialName:initials.toUpperCase(),
				fullName:contextData.getAuth.name
			})
		}

	}

	return(
		<nav className="navbar navbar-expand-lg navbar-light bg-theme">
         	<div className="container-fluid p-0">
	            {/*<XLogo/>*/}

	            
	            <Link to="/data-center" className="navbar-brand">
	            	<img src="\images\logo.png" />
	            </Link>
	            
            	<button 
	            className="navbar-toggler" 
	            type="button" 
	            data-bs-toggle="collapse" 
	            data-bs-target="#navbarSupportedContent" 
	            aria-controls="navbarSupportedContent" 
	            aria-expanded="false" aria-label="Toggle navigation">

            		<span className="navbar-toggler-icon"></span>

            	</button>
            	<div className="collapse navbar-collapse" id="navbarSupportedContent">
	               	<ul className={`navbar-nav me-auto mb-2 mb-lg-0 ${invisibleMenu?'invisible':''}`}>
	                  	<li className="nav-item hide">
	                     	<a className="nav-link dt_nav" aria-current="page" href="#">Dashboard</a>
	                  	</li>
	                  	<li className="nav-item">
						  <Link to="/data-center" className={`nav-link dt_nav ${location.pathname == "/data-center" ? 'active' : ''}`}>Data Centers</Link>
	                  	</li>
	                  	<li className="nav-item hide">
	                     	<a className="nav-link dt_nav" href="#">Tickets</a>
	                  	</li>
	                  	<li className="nav-item hide">
	                     	<a className="nav-link dt_nav" href="#">Svc Desks</a>
	                  	</li>
	                  	<li className="nav-item hide">
	                     	<a className="nav-link dt_nav" href="#">Metrics</a>
	                  	</li>
	                  	<li className="nav-item hide">
	                     	<a className="nav-link dt_nav" href="#">Analytics</a>
	                  	</li>
	               	</ul>
	               	<ul className="navbar-nav header-right">

	                  	
	               		{contextData?.getAuth?.role?.user_management?(
	               			<li className="nav-item dropdown notification_dropdown">
	                     	
	                     	<Link 
				            className="nav-link setting"
				            to="/setting/user" >
				            	<img src="\images\settings-10@1x.png" alt="" />
				            </Link>
	                  	</li>):null}
	                  	<li className="nav-item dropdown header-profile">
	                     	<a 
	                     	className="nav-link" 
	                     	href="#" 
	                     	role="button" 
	                     	data-bs-toggle="dropdown"
	                     	>
	                        	<h4 className="pro">  {state.initialName}   </h4>
	                        	<div>
	                           		<span className="font-w400 d-block">{state.fullName}</span>
	                           		<small className="text-end font-w400" id="admin"> {contextData?.getAuth?.role?.name} </small>
	                        	</div>
	                     	</a>
	                     	<i className="fa fa-caret-down" aria-hidden="true" id="don"></i>

	                     	<div className="dropdown-menu dropdown-menu-end">
							 <Link to="/profile" className="dropdown-item ai-icon">
	                        	
	                           		<svg 
	                           		xmlns="http://www.w3.org/2000/svg" 
	                           		className="text-primary" 
	                           		width="18" 
	                           		height="18" 
	                           		viewBox="0 0 24 24" 
	                           		fill="none" 
	                           		stroke="currentColor" 
	                           		strokeWidth="2" 
	                           		strokeLinecap="round" 
	                           		strokeLinejoin="round"
	                           		>
	                              		<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
	                              		<circle cx="12" cy="7" r="4"></circle>
	                           		</svg>
	                           		<span className="ms-2">Profile </span>
	                        	</Link>
	                        	<a href="email-inbox.html" className="dropdown-item ai-icon">
	                           		<svg 
	                           		xmlns="http://www.w3.org/2000/svg" 
	                           		className="text-success" 
	                           		width="18" 
	                           		height="18" 
	                           		viewBox="0 0 24 24" 
	                           		fill="none" 
	                           		stroke="currentColor" 
	                           		strokeWidth="2" 
	                           		strokeLinecap="round" 
	                           		strokeLinejoin="round">
		                              	<path 
		                              	d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z">
		                              		
		                              	</path>
		                              	<polyline points="22,6 12,13 2,6"></polyline>
	                          		</svg>
	                           		<span className="ms-2">Inbox </span>
	                        	</a>
	                        	<a onClick={onLogout} style={{cursor:"pointer"}} className="dropdown-item ai-icon">
	                           		<svg 
	                           		xmlns="http://www.w3.org/2000/svg" 
	                           		className="text-danger" 
	                           		width="18" 
	                           		height="18" 
	                           		viewBox="0 0 24 24" 
	                           		fill="none" 
	                           		stroke="currentColor" 
	                           		strokeWidth="2" 
	                           		strokeLinecap="round" 
	                           		strokeLinejoin="round">
	                              		<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
	                              		<polyline points="16 17 21 12 16 7"></polyline>
	                              		<line x1="21" y1="12" x2="9" y2="12"></line>
	                           		</svg>
	                           		<span className="ms-2">Logout </span>
	                        	</a>
	                     	</div>
	                  	</li>
	               	</ul>
            	</div>
         	</div>
      	</nav>
	)
}

export default Navigation;