import React from 'react';
import {Link} from 'react-router-dom';
import { useLocation } from "react-router-dom";

const Navigation = () => {

	const location = useLocation();

	const activeClass = (route) => {

		if (location.pathname === route) {
			return "plink active";
		}

		return "plink";
	}
	return(
		<div className="col-xl-1">
			<div className="leftside">
				<p> 
					<Link 
					className={activeClass('/setting/data-center')}  
					to="/setting/data-center" >Inventory </Link>
				</p>
				<p>
					<Link 
					className="plink" 
					className={activeClass('/setting/capacity')}
					to="/setting/capacity" >Capacity </Link>
				</p>
			</div>
		</div>
	);
}

export default Navigation;