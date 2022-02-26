import React,{useEffect,useState,useContext} from 'react';
import Navigation from './navigation';
import RoleService from 'services/roleServices';
import AuthContext from "context";

const Header = ({selectDataCenter,selectedDataCenter}) => {

	const contextStore = useContext(AuthContext);
	const [countries,setCountries] = useState([]);
	const [dataCenter,setDataCenter] = useState([]);
	const [countryText,setCountryText] = useState("Country");

	useEffect(() => {

		RoleService.countryService(contextStore.token()).then(res => {
			setCountries(res.data.data);
		}).catch(err => {
			/*500 internal server error*/
		})

		getDataCenter();

	},[]);

	const onCountryChange = country => {

		contextStore.setSelectedCountry(country);
		setCountryText(country.name);
		getDataCenter(country);
		selectDataCenter("");

	}

	const getDataCenter = async (country = "") => {

		if(country == ""){
			
			await RoleService.dataCenter(contextStore.token()).then(res => {
				
				setDataCenter(res.data.data);
			});

		}else{

			await RoleService.dataCenterByCountryId(contextStore.token(), country).then(res => {
				
				setDataCenter(res.data.data);
			})
		}
	}
	const onDataCenter = dataCenter => {
		selectDataCenter(dataCenter);
	}

	const onGlobal = () => {
		setCountryText("Country")
		selectDataCenter("");
		getDataCenter();
		contextStore.setSelectedCountry("");
	}
	
	return(
		<React.Fragment>
			<Navigation/>
			<div className="dt_tabs header_dash">
		        <div className="profile-tab">
		            <div className="custom-tab-1 tab_flex">
		               	<div className="gin_btn">
			               	<ul className="nav nav-tabs">
			                  	<li 
			                  	className="nav-item"
			                  	> 
			                  		<button 
			                  		type="text"
			                  		onClick={() => onGlobal()}
			                  		className="btn btn-light" 
			                  		> Global </button>
			                  	</li>
			                  	<li className="nav-item">
			                  		<div className="btn-group" role="group">
			                  			<button 
			                  			type="button" 
			                  			className="btn btn-secondary dropdown-toggle" 
			                  			data-bs-toggle="dropdown" aria-expanded="false"> 
			                  				{countryText} 
			                  			</button>
			                  			<div className="dropdown-menu" style={{margin:"0px"}}>

			                  				{countries.map((country,i) => {
			                  					return(
			                  						<div key={i}>
			                  						
		                           					<a 
		                           					style={{cursor:"pointer"}}
		                           					onClick={() => onCountryChange(country) }
		                           					className="dropdown-item form-check-label" 
		                           					>
		                           						{country.name}
		                           					</a>
			                  						</div>

			                  					)
			                  				})}
                           				</div>
                           			</div>
                           		</li>
			                </ul>
		                </div>
		                <div className="tabs_srll">
		                  	<ul className="nav nav-tabs scroll_tab_dg">
		                  		{
		                  			dataCenter && dataCenter.map((data,index) => {

		                  				if(selectedDataCenter && selectedDataCenter.id == data.id){
		                  					return(
			                  					<li 
			                  					className={index == 0?'nav-item ml_20':'nav-item'}
			                  					key={index}>
			                  						<a 
			                  						onClick={() => onDataCenter(data)}
			                  						style={{cursor:'pointer'}} 
			                  						className="nav-link active show"> 
			                  							<img className="down" src="images/downward-arrow.png" />
			                  							{data.name}
			                  						</a> 
			                  					</li>
			                  				)
		                  				}else{

			                  				return(
			                  					<li 
			                  					className={index == 0?'nav-item ml_20':'nav-item'}
			                  					key={index}>
			                  						<a 
			                  						onClick={() => onDataCenter(data)}
			                  						style={{cursor:'pointer'}} 
			                  						className="nav-link"> {data.name} </a> 
			                  					</li>
			                  				)
		                  				}
		                  			})
		                  		}
		                  		
		                  	</ul>
		               </div>
		            </div>
		        </div>
		    </div>
		</React.Fragment>
	)
}

export default Header;