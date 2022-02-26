import React,{useEffect,useContext,useState} from 'react';
import AuthContext from "context";

const Cabling = ({selectedDataCenter}) => {

	const contextStore = useContext(AuthContext);
	const [fileExists,setFileExists] = useState(false);
	const [filePath,setFilePath] = useState("");

	useEffect(() => {

		tryRequire(contextStore.selectedCountry,selectedDataCenter);

	},[selectedDataCenter,contextStore.selectedCountry]);

	const tryRequire = async (country,dataCenter) => {

		let filePath = "";

		if(country == "" && dataCenter != ""){

			filePath = `/images/${dataCenter.country_id}/${dataCenter.id}/${dataCenter.id}.png`;

		}else{

			filePath = `/images/${country.id}/${dataCenter.id}/${dataCenter.id}.png`;
		}
		

	  	return await fetch(filePath,
         	 { method: "HEAD" }
		).then((res) => {
		      	if (res.ok) {
		      		setFilePath(filePath)
		      		setFileExists(true);
		      		
		      	} else {
		      		setFileExists(false);
		      	}
		});
	}
	return(
		<div className="col-lg-12 col-md-12 col-sm-12 col-12 p-0">
			<div className="grid_card h-100">
				<div className="inv mb-0">
					<div className="card_head"  >
						
						<div className="txt_card">

						{fileExists? <img src={filePath} />:<h2>No info found</h2>}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Cabling;