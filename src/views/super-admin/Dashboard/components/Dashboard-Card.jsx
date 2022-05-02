import React, {useState,useContext,useEffect} from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import AuthContext from "context";
import {numberFormat} from "common/helpers";
import {
	InService,
	Reserved,
	ROFR,
	Blocked,
	Available,
	Unavailable
} from 'components/ColorTile';

ChartJS.register(ArcElement, Tooltip, Legend);

const graphSetting = {
	maintainAspectRatio: false ,
	rotation: -90,
	circumference: 180,
	cutout: 60,
	plugins: {
      datalabels: {
        formatter: (value) => {
          return value;
        }
      }
    }
};

const DashboardCard = ({cardData}) => {

	const contextStore = useContext(AuthContext);
	let floors = [];
	const [graphData,setGraphData] = useState(cardData);
	
		
	useEffect(() => {
		floors = contextStore.getDataCenterFloor;

			getFloorGraph();
			getCabinetGraph();
			getPowerGraph();
			getCagesGraph();

	},[contextStore.getDataCenterFloor]);


	const getFloorGraph = () => {

		if(floors.length){

			let floorData = graphData.filter(data => data.title === 'Floors');
			let inService = floors.filter(floor => floor.status === 1);

			floorData[0].totalNumber = floors.length;
			floorData[0].graph = [inService.length,floors.length - inService.length];

			const res = graphData.map(obj => floorData.find(o => o.title === obj.title) || obj);

			setGraphData(res);

		}else{

			let floorData = graphData.filter(data => data.title === 'Floors');
			let inService = floors.filter(floor => floor.status === 1);

			floorData[0].totalNumber = 0;
			floorData[0].graph = [0,0];

			const res = graphData.map(obj => floorData.find(o => o.title === obj.title) || obj);

			setGraphData(res);
		}
	
	}

	const getCabinetGraph = () => {

		let total = 0;
		let totalAvail = 0;
		let totalsold = 0;
		let totalReserved = 0;
		let totalRofr = 0;
		let totalBlocked = 0;


		if(floors.length){
			let cabData = graphData.filter(data => data.title === 'Cabinets');
			floors.map(floor => {

				total += floor.data_halls.reduce((previous,current) => previous += Number(current.design_cabs),0);

				totalReserved += floor.data_halls.reduce((previous,current) => previous += Number(current.reserved_cabs),0);

				totalRofr += floor.data_halls.reduce((previous,current) => previous += Number(
					current.rofr_cabs),0);

				totalBlocked += floor.data_halls.reduce((previous,current) => previous += Number(current.blocked_cabs),0);

				totalsold += floor.data_halls.reduce((previous,current) => previous += Number(current.sold_cabs),0);
			});

			totalAvail = total - (totalsold + totalReserved + totalRofr + totalBlocked);

			cabData[0].totalNumber = total;
			cabData[0].graph = [totalsold,totalAvail,totalReserved,totalRofr,totalBlocked];

			const res = graphData.map(obj => cabData.find(o => o.title === obj.title) || obj);

			setGraphData(res);
		}else{
			let cabData = graphData.filter(data => data.title === 'Cabinets');

			cabData[0].totalNumber = 0;
			cabData[0].graph = [0,0,0,0,0];

			const res = graphData.map(obj => cabData.find(o => o.title === obj.title) || obj);

			setGraphData(res);
		}
		

	}

	const getPowerGraph = () => {

		let totalPower = 0;
		let totalAvail = 0;
		let totalSold = 0;
		let totalReserved = 0;
		let totalRofr = 0;
		let totalBlocked = 0;

		if(floors.length){

			let powerData = graphData.filter(data => data.title == 'Power (kW)');

			floors.map(power => {

				totalPower += power.data_halls.reduce((previous,current) => previous += Number(current.design_power),0);

				totalReserved += power.data_halls.reduce((previous,current) => previous += Number(current.reserved_power),0);

				totalRofr += power.data_halls.reduce((previous,current) => previous += Number(current.rofr_power),0);

				totalBlocked += power.data_halls.reduce((previous,current) => previous += Number(current.blocked_power),0);

				totalSold += power.data_halls.reduce((previous,current) => previous += Number(current.sold_power),0);
				
			});

			totalAvail = totalPower - (totalSold + totalReserved + totalRofr + totalBlocked);

			powerData[0].totalNumber = totalPower.toFixed(3);
			powerData[0].graph = [
				totalSold.toFixed(3),
				totalAvail.toFixed(3),
				totalReserved.toFixed(3),
				totalRofr.toFixed(3),
				totalBlocked.toFixed(3)
			];

			const res = graphData.map(obj => powerData.find(o => o.title === obj.title) || obj);

			setGraphData(res);
		}else{
			let powerData = graphData.filter(data => data.title == 'Power (kW)');

			powerData[0].totalNumber = 0;
			powerData[0].graph = [0,0,0,0,0];

			const res = graphData.map(obj => powerData.find(o => o.title === obj.title) || obj);

			setGraphData(res);
		}

	}
	const getCagesGraph = () => {

		let totalCages = 0;
		let totalAvail = 0;
		let totalSold = 0;
		let totalReserved = 0;
		let totalRofr = 0;
		let totalBlocked = 0;

		if(floors.length){
			let cagesData = graphData.filter(data => data.title == 'Cages');

			floors.map(cage => {

				totalCages += cage.data_halls.reduce((previous,current) => previous += Number(current.design_cages),0);

				totalReserved += cage.data_halls.reduce((previous,current) => previous += Number(current.reserved_cages),0);

				totalRofr += cage.data_halls.reduce((previous,current) => previous += Number(current.rofr_cages),0);

				totalBlocked += cage.data_halls.reduce((previous,current) => previous += Number(current.blocked_cages),0);


				totalSold += cage.data_halls.reduce((previous,current) => previous += Number(current.sold_cages),0);
				
			});

			totalAvail = totalCages - (totalSold + totalReserved + totalRofr +totalBlocked);

			cagesData[0].totalNumber = totalCages;
			cagesData[0].graph = [totalSold,totalAvail,totalReserved,totalRofr,totalBlocked];

			const res = graphData.map(obj => cagesData.find(o => o.title === obj.title) || obj);

			setGraphData(res);
		}else{
			let cagesData = graphData.filter(data => data.title == 'Cages');

			cagesData[0].totalNumber = 0;
			cagesData[0].graph = [0,0];

			const res = graphData.map(obj => cagesData.find(o => o.title === obj.title) || obj);

			setGraphData(res);

		}

	}

	const getGraphData = args => {

		if(args.title === 'Floors'){
			return {
				datasets: [
					{
					    data: args.graph,
					    backgroundColor: [
					    	"#FE8600",
					    	"#E0E2E5"
					    ],
					    hoverBackgroundColor: [
					    	"#FE8600",
					    	"#E0E2E5"
					    ],
					    borderColor: [
					    	"#FE8600",
					    	"#E0E2E5"
					    ],
					    borderWidth: 3,
					}
				]
			}
		}else{
			return {
				datasets: [
					{
					    data: args.graph,
					    backgroundColor: [
					    	"#FE8600",
					    	"#3FEB7B",
					    	"#1b70c0",
					    	"#595959",
					    	"#000000"
					    ],
					    hoverBackgroundColor: [
					    	"#FE8600",
					    	"#3FEB7B",
					    	"#1b70c0",
					    	"#595959",
					    	"#000000"
					    ],
					    borderColor: [
					    	"#FE8600",
					    	"#3FEB7B",
					    	"#1b70c0",
					    	"#595959",
					    	"#000000"
					    ],
					    borderWidth: 3,
					}
				]
			}

		}
	}

	const labelColor = text => {

		switch(text) {
		  	case "In Services":
		    	return <InService/>;
		    break;
		    case "Reserved":
		    	return <Reserved/>;
		    break;
		    case "ROFR":
		    	return <ROFR/>;
		    break;
		    case "Blocked":
		    	return <Blocked/>;
		    break;
		    case "Available":
		    	return <Available/>;
		    break;
		 	default:
		    	return <Unavailable/>;
		}
		
	}
	return graphData && graphData.map((data,index) => {

		return(

			<div className="col-lg-3 col-md-12 col-sm-12 col-12" key={index}>
				<div className={"grid_card set_h "+ data.className}>
					<div className="card_head">
						<div className="txt_card">
							<h3>{data.title}</h3>
						</div>
						<div className="txt_card_2">

							{data.types.map((type,i) => {
								return labelColor(type.title);
								
							})}
						</div>
					</div>
					<div className="card_diag outer" style={{height:"200px",width:"200px"}}>
						{/*<img src={data.graph} width="60%" />*/}
						<Doughnut 
				  		data={getGraphData(data)}
				  		options={graphSetting}
				  		/>
  						<p className="percent">{numberFormat(data.totalNumber)}  <br/><span>{data.title}</span> </p>	
					</div>
				</div>
			</div>
		)
	})
}

export default DashboardCard;