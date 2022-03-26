import React from 'react';
import {Link} from 'react-router-dom';
import { useLocation } from "react-router-dom";
import StorageContext from "context";

const Navigation = () => {

	const location = useLocation();
	const contextData = React.useContext(StorageContext);

	const activeClass = (route) => {
		
		if(typeof route === 'string'){

			if (location.pathname === route) {
				return "nav-link active";
			}
		}

		if(typeof route === 'object'){

			let classType = "nav-link";
			route.map(r => {
				if(location.pathname === r){
					classType = "nav-link active";
				}
			})

			return classType;
		}

		return "nav-link";
	}
	return(
		<div className="container-fluid">
			<div id="title">
                <h4 className="card-title"> Settings </h4>
                <p> Manage users, roles & permissions and data centers </p>
            </div>

            <div className="card-header" id="header">
                <div className="d-sm-flex d-block justify-content-between align-items-center">
                    <div className="card-action coin-tabs mt-3 mt-sm-0">
                        <ul className="nav nav-tabs" role="tablist">
                        	{contextData.getAuth.role.user_management?(

                            <li className="nav-item gap_s">
                            	<Link 
                            	className={activeClass('/setting/user')}
                            	id="tab1" 
                            	to="/setting/user" >User Management </Link>
                            </li>
                        	):null}
                            {contextData.getAuth.role.country_id === 6?(
                            <React.Fragment>
                            <li className="nav-item gap_s">
                            	<Link 
                            	className={activeClass('/setting/role-and-permissions')}
                            	id="tab2" 
                            	to="/setting/role-and-permissions" >Roles & Permissions </Link>
                            </li>
                            <li className="nav-item gap_s">
                            	<Link 
                            	className={activeClass(['/setting/data-center','/setting/capacity'])} 
                            	id="tab3" 
                            	to="/setting/data-center" >Data Centers </Link>
                            </li>
							<li className="nav-item gap_s">
                            	<Link 
                            	className="nav-link"
                            	className={activeClass('/setting/reports')} 
                            	id="tab4" 
                            	to="/setting/reports" >Reports </Link>
                            </li>
                            </React.Fragment>
                            ):null}
                        </ul>
                    </div>
                </div>
            </div>
		</div>
	);
}

export default Navigation;