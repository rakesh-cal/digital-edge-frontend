import React,{useEffect,useState,useContext} from 'react';
import Layout from "../dashboard-layout";
import {
	MenuTab,
	DashbordCard,
	DataHallCard,
	FloorCard,
	SelectedDataCenter,
	Cabling
} from './components';
import { 
	cardData
} from './data';
import Floors from "services/floorServices";
import AuthContext from "context";


const Dashboard = () => {

	const contextStore = useContext(AuthContext);
	const [selectedDataCenter,selectDataCenter] = useState("");
	const [selectedFloor,selectFloor] = useState("");
	const [menuTab,setMenuTab] = useState({
		inventory: true,
		capacity:false,
		cabling:false
	});

	useEffect(() => {

		getFloorData();
	},[selectedDataCenter,contextStore.selectedCountry]);

	const getFloorData = async () => {

		if(selectedDataCenter == "" && contextStore.selectedCountry == ""){

			await Floors.findAllFloor(contextStore.token()).then(res => {
				contextStore.setFloor(res.data.data);
			}).catch(err => {
				/*500 internal server error*/
			})

		}else if(contextStore.selectedCountry !="" && selectedDataCenter == ""){
			
			await Floors.floorByCountryId(contextStore.token(),contextStore.selectedCountry).then(res => {
			
				contextStore.setFloor(res.data.data);
			}).catch(err => {
				/*500 internal server error*/
			})

		}else{

			await Floors.floorByDataCenterId(contextStore.token(),selectedDataCenter).then(res => {
				contextStore.setFloor(res.data.data);
			}).catch(err => {
				/*500 internal server error*/
			})
		}
		
	}

	return (
		<Layout 
		selectDataCenter={selectDataCenter} 
		selectedDataCenter={selectedDataCenter}
		>
			<div className='bg_color_dash'>
				<div className="container-fluid pb-5">
					<div className="row pt-2">
						<div className="col-lg-12 col-md-12 col-sm-12 col-12 gx-3">
							<div className="row g-2">
								<DashbordCard cardData={cardData} />
							</div>
							<div className="row g-2">
								<div className="invglob">
									<MenuTab setMenuTab={setMenuTab} menuTab={menuTab}/>
									<SelectedDataCenter selectedDataCenter={selectedDataCenter}/>
								</div>
						</div>
						{
							menuTab.inventory?
							<div className="row mt-2 g-1 gx-3 pb-4">
									<FloorCard 
									selectedDataCenter={selectedDataCenter}
									selectedFloor={selectedFloor}
									selectFloor={selectFloor}
									/>
									<DataHallCard
									selectedFloor={selectedFloor} selectedDataCenter={selectedDataCenter}
									></DataHallCard>
							</div>:null
						}
						{
							menuTab.capacity?
							<div className="row mt-2">
									
							</div>:null
						}
						{
							menuTab.cabling?
							<div className="row mt-2">
								<Cabling selectedDataCenter={selectedDataCenter}/>	
							</div>:null
						}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}

export default Dashboard;