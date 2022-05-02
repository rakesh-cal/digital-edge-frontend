import React, {useState,useContext,useEffect} from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import AuthContext from "context";
import {numberFormat} from "common/helpers";
import moment from 'moment';
import {
	S1,
	S2,
	S3,
	Today,
	Tomorrow
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

const Card = ({cardData,state}) => {

	const contextStore = useContext(AuthContext);
	let floors = [];
	const [graphData,setGraphData] = useState(cardData);
	
		
	useEffect(() => {
		getIncident();
		getFaults();
		getShipment();
		getSiteVisit();

	},[state]);

	const getIncident = () => {
		let s1 = 0;
		let s2 = 0;
		let s3 = 0;

		
		state && state.map(data => {

			if(data.ticket_type_id === 1 && data.severity === 'S1'){
				return s1 += 1;
			}

			if(data.ticket_type_id === 1 && data.severity === 'S2'){
				return s2 += 1;
			}

			if(data.ticket_type_id === 1 && data.severity === 'S3'){
				return s3 += 1;
			}

		});


		let incidents = graphData.filter(data => data.title === 'Incidents');
		incidents[0].totalNumber = s1+s2+s3;
		incidents[0].graph = [s1,s2,s3];

		const res = graphData.map(obj => incidents.find(o => o.title === obj.title) || obj);

		setGraphData(res);
	}
	const getFaults = () => {
		let s1 = 0;
		let s2 = 0;
		let s3 = 0;

		state && state.map(data => {

			if(data.ticket_type_id === 2 && data.severity === 'S1'){
				return s1 += 1;
			}

			if(data.ticket_type_id === 2 && data.severity === 'S2'){
				return s2 += 1;
			}

			if(data.ticket_type_id === 2 && data.severity === 'S3'){
				return s3 += 1;
			}

		});

		let faults = graphData.filter(data => data.title === 'Faults');
		faults[0].totalNumber = s1+s2+s3;
		faults[0].graph = [s1,s2,s3];

		const res = graphData.map(obj => faults.find(o => o.title === obj.title) || obj);

		setGraphData(res);
	}
	const getShipment = () => {
		let today = 0;
		let tomorrow = 0;

		state && state.map(data => {

			if(
				data.ticket_type_id === 3 && 
				moment(data.due_date).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')){
				return today += 1;
			}

			if(
				data.ticket_type_id === 3 && 
				moment(data.due_date).format('YYYY-MM-DD') == moment().add(1, 'days').format('YYYY-MM-DD')){
				return tomorrow += 1;
			}

		});

		let faults = graphData.filter(data => data.title === 'Site Visits');
		faults[0].totalNumber = today+tomorrow;
		faults[0].graph = [today,tomorrow];

		const res = graphData.map(obj => faults.find(o => o.title === obj.title) || obj);

		setGraphData(res);
	}
	const getSiteVisit = () => {
		let today = 0;
		let tomorrow = 0;

		state && state.map(data => {
			
			if(
				data.ticket_type_id === 4 && 
				moment(data.due_date).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')){
				return today += 1;
			}

			if(
				data.ticket_type_id === 4 && 
				moment(data.due_date).format('YYYY-MM-DD') == moment().add(1, 'days').format('YYYY-MM-DD')){
				return tomorrow += 1;
			}

		});

		let faults = graphData.filter(data => data.title === 'Shipment');
		faults[0].totalNumber = today+tomorrow;
		faults[0].graph = [today,tomorrow];

		const res = graphData.map(obj => faults.find(o => o.title === obj.title) || obj);

		setGraphData(res);

	}
	const getGraphData = args => {

		if(args.title === 'Incidents' || args.title === 'Faults' ){
			return {
				datasets: [
					{
					    data: args.graph,
					    backgroundColor: [
					    	"#e03138",
					    	"#f78600",
					    	"#f2dc34"
					    ],
					    hoverBackgroundColor: [
					    	"#e03138",
					    	"#f78600",
					    	"#f2dc34"
					    ],
					    borderColor: [
					    	"#e03138",
					    	"#f78600",
					    	"#f2dc34"
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
					    	"#e03138",
					    	"#f78600"
					    ],
					    hoverBackgroundColor: [
					    	"#e03138",
					    	"#f78600"
					    ],
					    borderColor: [
					    	"#e03138",
					    	"#f78600"
					    ],
					    borderWidth: 3,
					}
				]
			}

		}
	}

	const labelColor = text => {

		switch(text) {
		  	case "S1":
		    	return <S1/>;
		    break;
		    case "S2":
		    	return <S2/>;
		    break;
		    case "S3":
		    	return <S3/>;
		    break;
		    case "Today":
		    	return <Today/>;
		    break;
		    case "Tomorrow":
		    	return <Tomorrow/>;
		    break;
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
  						<p className="percent">{data.totalNumber}  <br/><span>{data.title}</span> </p>	
					</div>
				</div>
			</div>
		)
	})
}

export default Card;