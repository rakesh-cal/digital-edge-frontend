import React,{useState,useContext,useEffect} from 'react';
import {Line,Line2} from 'components/graph';
import AuthContext from "context";
import CabinetServices from "services/CabinetService";
import DataFloorPopup from  "./dataFloor-popup"

const FloorTable = ({
	floorData,
	selectedDataCenter,
	selectFloor,
	selectedFloor,
	setFloorSort,
	floorSort
}) => {

	const contextStore = useContext(AuthContext);
	const [fileExists,setFileExists] = useState(false);
	const [filePath,setFilePath] = useState("");
	const [show, setShow] = useState(false)
	const [ascending,setAscending] = useState(true);
	//const floorActive = "";

	useEffect(() => {
		
		if (contextStore.getDataCenterFloor && contextStore.getDataCenterFloor.length) {
			selectFloor(contextStore.getDataCenterFloor[0]);
		}else{
			selectFloor([]);
		}

		//floorActive = selectedFloor;
		
	},[contextStore.getDataCenterFloor]);

	const getDataHallIds =  (data_halls) => {

		let ids = [];
		let data = 0;
		let totalSize = 0;
		let totalInService = 0;
		let inServicePercent = 0;
		let availablePercent = 0;
		let totalPercent = 0;

		//contextStore.getDataCenterFloor.map(floor => {

			data_halls && data_halls.map(halls => {
				
				if (halls.cabinets && halls.cabinets.length) {
					data = halls.cabinets;
					totalSize = data.length;
					totalInService = (data.filter(cabinet => cabinet.status == 1)).length;
					if (totalInService) {

						inServicePercent = parseInt(totalInService*100/totalSize);
						availablePercent = parseInt((totalSize-totalInService)*100/totalSize);
					}
				}
			});
		//});

		return {
				totalSize,
				totalInService,
				available:totalSize-totalInService,
				inServicePercent,
				availablePercent,
				totalPercent
		}
		
	}

	const getPowers = (data_halls) => {


		let ids = [];
		let data = 0;
		let totalSize = 0;
		let totalInService = 0;
		let inServicePercent = 0;
		let availablePercent = 0;
		let totalPercent = 0;

	
			data_halls && data_halls.map(halls => {
				
				if (halls.cabinets && halls.cabinets.length) {
					//totalSize += Number(halls.cabinets.max_kw);
				}
			});
	

		/*return {
				totalSize,
				totalInService,
				available:totalSize-totalInService,
				inServicePercent,
				availablePercent,
				totalPercent
		}*/
	}

	const getCabsStatus = data => {

		//if (Number(data.status) === 1) {

			let available = 0;
			let inservicePer = 0;
			let availPer = 0;
			let reservedPer = 0;
			let rofrPer = 0;
			let blockedPer = 0;
			let reserved = 0;
			let rofr = 0;
			let blocked = 0;

			let design_cabs = data.data_halls.reduce((previous,current) => previous += Number(current.design_cabs),0);

			reserved = data.data_halls.reduce((previous,current) => previous += Number(current.reserved_cabs),0);


			rofr = data.data_halls.reduce((previous,current) => previous += Number(current.rofr_cabs),0);

			blocked = data.data_halls.reduce((previous,current) => previous += Number(current.blocked_cabs),0);

			let sold_cabs = data.data_halls.reduce((previous,current) => previous += Number(current.sold_cabs),0);

			
			available = Number(design_cabs) - (Number(sold_cabs) + Number(reserved)+ Number(rofr)+ Number(blocked));

			if(design_cabs === 0){
				sold_cabs = 0;
				available = 0;
				inservicePer = 0;
				availPer = 0;
			}else{
				inservicePer = sold_cabs*100/design_cabs;
				availPer = available*100/design_cabs;
				reservedPer = reserved*100/design_cabs;
				rofrPer = rofr*100/design_cabs;
				blockedPer = blocked*100/design_cabs;
			}


			return <Line
			totalText={design_cabs}
			inServiceText={sold_cabs}
			availableText={available}
			inServicePercent={inservicePer}
			availablePercent={availPer}
			totalPercent={0}
			reservedPer={reservedPer}
			rofrPer={rofrPer}
			blockedPer={blockedPer}
			reserved={reserved}
			rofr={rofr}
			blocked={blocked}

			/>

		/*}else{

			let design_cabs = data.data_halls.reduce((previous,current) => previous += Number(current.design_cabs),0);
			return <Line
			totalText={design_cabs}
			inServiceText={0}
			availableText={0}
			inServicePercent={0}
			availablePercent={0}
			totalPercent={100}/>
		}*/

	}
	const getCagesStatus = data => {

		//if (Number(data.status) === 1) {
			
			let available = 0;
			let soldPer = 0;
			let availPer = 0;
			let reservedPer = 0;
			let rofrPer = 0;
			let blockedPer = 0;
			let reserved = 0;
			let rofr = 0;
			let blocked = 0;

			let design_cages = data.data_halls.reduce((previous,current) => previous += Number(current.design_cages),0);

			reserved = data.data_halls.reduce((previous,current) => previous += Number(current.reserved_cages),0);

			rofr = data.data_halls.reduce((previous,current) => previous += Number(current.rofr_cages),0);

			blocked = data.data_halls.reduce((previous,current) => previous += Number(current.blocked_cages),0);

			let sold_cages = data.data_halls.reduce((previous,current) => previous += Number(current.sold_cages),0);

				available = Number(design_cages)- (Number(sold_cages) + Number(reserved) + Number(rofr) + Number(blocked));
			
				if(design_cages === 0){
					sold_cages = 0;
					available = 0;
					soldPer = 0;
					availPer = 0;
				}else{
					soldPer = sold_cages*100/design_cages;
					availPer = available*100/design_cages;

					reservedPer = reserved*100/design_cages;
					rofrPer = rofr*100/design_cages;
					blockedPer = blocked*100/design_cages;
				}
			
			
			return <Line
			totalText={design_cages}
			inServiceText={sold_cages}
			availableText={available}
			inServicePercent={soldPer}
			availablePercent={availPer}
			totalPercent={0}
			reservedPer={reservedPer}
			rofrPer={rofrPer}
			blockedPer={blockedPer}
			reserved={reserved}
			rofr={rofr}
			blocked={blocked}
			/>

	/*	}else{

			let design_cages = data.data_halls.reduce((previous,current) => previous += Number(current.design_cages),0);

			return <Line
			totalText={design_cages}
			inServiceText={0}
			availableText={0}
			inServicePercent={0}
			availablePercent={0}
			totalPercent={100}/>
		}*/

	}
	const getPowerStatus = data => {

		//if (Number(data.status) === 1) {

			let available = 0;
			let soldPer = 0;
			let availPer = 0;
			let reservedPer = 0;
			let rofrPer = 0;
			let blockedPer = 0;
			let reserved = 0;
			let rofr = 0;
			let blocked = 0;

			let design_power = data.data_halls.reduce((previous,current) => previous += Number(current.design_power),0);

			reserved = data.data_halls.reduce((previous,current) => previous += Number(current.reserved_power),0);

			rofr = data.data_halls.reduce((previous,current) => previous += Number(current.rofr_power),0);

			blocked = data.data_halls.reduce((previous,current) => previous += Number(current.blocked_power),0);

			let sold_power = data.data_halls.reduce((previous,current) => previous += Number(current.sold_power),0);

			available = Number((Number(design_power)- (Number(sold_power) + Number(reserved) + Number(rofr) + Number(blocked) ) ).toFixed(3));

				if(design_power === 0){
					sold_power = 0;
					available = 0;
					soldPer = 0;
					availPer = 0;
				}else{
					soldPer = sold_power*100/design_power;
					availPer = available*100/design_power;

					reservedPer = reserved*100/design_power;
					rofrPer = rofr*100/design_power;
					blockedPer = blocked*100/design_power;
				}
			


			return <Line
			totalText={design_power}
			inServiceText={sold_power}
			availableText={available}
			inServicePercent={soldPer}
			availablePercent={availPer}
			totalPercent={0}
			reservedPer={reservedPer}
			rofrPer={rofrPer}
			blockedPer={blockedPer}
			reserved={reserved}
			rofr={rofr}
			blocked={blocked}
			/>
/*
		}else{

			let design_power = data.data_halls.reduce((previous,current) => previous += Number(current.design_power),0);
			return <Line
			totalText={design_power}
			inServiceText={0}
			availableText={0}
			inServicePercent={0}
			availablePercent={0}
			totalPercent={100}/>
		}*/

	}

	const checkDataFloor = async(data) => {
	
		selectFloor(data)

		let filePath = `/images/${selectedDataCenter.country_id}/${data.data_center_id}/${data.id}/${data.id}.png`;


	  	return await fetch(filePath,
         	 { method: "HEAD" }
		).then((res) => {
			console.log(res)
		      	if (res.ok) {
		      		setFilePath(filePath)
		      		setFileExists(true);
		      		
		      	} else {
		      		setFileExists(false);
		      	}
				  setShow(true)
		});

	}

	return(
		<div>
		<table>
			<thead>
			<tr>
				<th onClick={() => {
				setFloorSort(!floorSort);
				if(floorSort === true){

					contextStore.getDataCenterFloor.sort((a,b)=> (a.name > b.name ? 1 : -1))
				}
				if (floorSort === false) {
					contextStore.getDataCenterFloor.sort((a,b)=> (a.name < b.name ? 1 : -1))
				}

			}} style={{cursor:"pointer"}}> Floors 
			<i 
			className={`fa fa-solid fa-sort-${floorSort?'down':'up'}`}

			></i>
			</th>
				<th> Cabinets </th>
				<th> Cages</th>
				<th> Power(kW) </th>
				<th> Layout </th>
			</tr>
			</thead>
			<tbody>
			{
				contextStore.getDataCenterFloor && contextStore.getDataCenterFloor.map((data,key) => {

					return (
						<tr key={key} style={{cursor:"pointer"}} 
						className={selectedFloor.id == data.id?"tr_active":""} >
							<td onClick={() => selectFloor(data)}>  
								{data.name} <i 
								className="fa fa-circle" 
								style={{color:data.status === 1?"#3FEB7B":"#E0E2E5"}}
								aria-hidden="true"></i> 
							</td>
							<td onClick={() => selectFloor(data)}>
								{getCabsStatus(data)}
							</td>
							<td onClick={() => selectFloor(data)}>
								{getCagesStatus(data)}
							</td>
							<td onClick={() => selectFloor(data)}>
								{getPowerStatus(data)}
							</td>
							<td onClick={() => checkDataFloor(data)}>
								<img src="/images/Group 3647.svg" />
							</td>
						</tr>

					)
				})
			}
			</tbody>
		</table>
		{show && <DataFloorPopup show={show} setShow={setShow} fileExists={fileExists} filePath={filePath} selectedDataCenter={selectedDataCenter} selectedFloor={selectedFloor}/>}
		</div>
	)
}

export default FloorTable;