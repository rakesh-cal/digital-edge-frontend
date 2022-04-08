import React,{useEffect,useState,useContext} from 'react';
import {Line,Line2} from 'components/graph';
import AuthContext from "context";

const DataHallTable = ({
	selectedFloor, 
	getCabinetData,
	hallSort,
	setHallSort
}) => {

	const [state,setState] = useState([]);
	const contextStore = useContext(AuthContext);
	const [dataHallAscending,setDataHallAscending] = useState(true);

	useEffect(() => {
		if(Object.keys(selectedFloor).length && selectedFloor.data_halls.length){
			selectedFloor.data_halls.sort((a,b)=> (a.name < b.name ? 1 : -1));
		}
		setState(selectedFloor);
		setHallSort(true);
			
	},[selectedFloor,contextStore.selectedCountry]);
	const getCabsStatus = data => {

		if (Number(data.status) === 1) {

			let available = Number(data.design_cabs)- Number(data.sold_cabs);

			let soldPer = data.sold_cabs*100/data.design_cabs;
			let availPer = available*100/data.design_cabs;


			return <Line2
			totalText={data.design_cabs}
			inServiceText={data.sold_cabs}
			availableText={available}
			inServicePercent={soldPer}
			availablePercent={availPer}
			totalPercent={0}/>

		}else{

			return <Line2
			totalText={data.design_cabs}
			inServiceText={0}
			availableText={0}
			inServicePercent={0}
			availablePercent={0}
			totalPercent={100}/>
		}

	}
	const getCagesStatus = data => {

		if (Number(data.status) === 1) {

			let available = 0;
			let soldPer = 0;
			let availPer = 0;

			if (data.design_cages && data.design_cages!== null && data.design_cages !=="") {

				available = Number(data.design_cages)- Number(data.sold_cages);
				soldPer = data.sold_cages*100/data.design_cages;
				availPer = available*100/data.design_cages;

			}

			return <Line2
			totalText={data.design_cages}
			inServiceText={data.sold_cages}
			availableText={available}
			inServicePercent={soldPer}
			availablePercent={availPer}
			totalPercent={0}/>

		}else{

			return <Line2
			totalText={data.design_cages}
			inServiceText={0}
			availableText={0}
			inServicePercent={0}
			availablePercent={0}
			totalPercent={100}/>
		}

	}
	const getPowerStatus = data => {

		if (Number(data.status) === 1) {

			let available = Number(data.design_power)- Number(data.sold_power);

			let soldPer = data.sold_power*100/data.design_power;
			let availPer = available*100/data.design_power;


			return <Line2
			totalText={data.design_power}
			inServiceText={data.sold_power}
			availableText={available}
			inServicePercent={soldPer}
			availablePercent={availPer}
			totalPercent={0}/>

		}else{

			return <Line2
			totalText={data.design_power}
			inServiceText={0}
			availableText={0}
			inServicePercent={0}
			availablePercent={0}
			totalPercent={100}/>
		}

	}
	return(
		<table className="table header-border table-borderless table-hover verticle-middle">
			<thead>
				<tr>
					<th scope="col" width="10%" onClick={() => {
	                    		setHallSort(!hallSort);
								if(hallSort === true){

									state.data_halls.sort((a,b)=> (a.name > b.name ? 1 : -1))
								}
								if (hallSort === false) {
									state.data_halls.sort((a,b)=> (a.name < b.name ? 1 : -1))
								}
	                    	}}
	                    	style={{cursor:"pointer"}}> Name {" "}
	                <i className={`fa fa-solid fa-sort-${hallSort?'down':'up'}`}></i>
	                </th>
					<th scope="col" width="5%"> Status </th>
					<th scope="col" width="10%"> Cabinets </th>
					<th scope="col" width="10%"> Cages</th>
					<th scope="col" width="10%"> Power(kW) </th>
					<th scope="col" width="5%">Layout</th>
				</tr>
			</thead>
			<tbody id="cardnew">
			{
				state.data_halls && state.data_halls.map((data,index) => {
					return(
						<tr key={index}>
							<td className="pd-l bold-txt"> {data.name} </td>
							<td>
								<div 
								style={{
	                            	height:'6px',
	                            	width:"5em",
	                            	overflow:'hidden',
	                            	backgroundColor:data.status === 1?"#3FEB7B":"#E0E2E5"
	                            }}>
									<div className="progress-bar bg-success" role="progressbar"> </div>
								</div>
							</td>
							<td>{getCabsStatus(data)}</td>
							<td>{getCagesStatus(data)}</td>
							<td>{getPowerStatus(data)}</td>
							<td><img src="/images/Group 3647.svg" onClick={() => getCabinetData(data.id, data.name)}/></td>
						</tr>
					)
				})
			}
			</tbody>
		</table>
	);
}

export default DataHallTable;