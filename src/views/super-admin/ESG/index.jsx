import React,{useState,useEffect,useContext} from 'react';
import Layout from "../Layouts";
import './style.css';
import ESGService from 'services/esgServices';
import AuthContext from "context";
import moment from 'moment';
import saveAs from "file-saver";
import { myBase64Image } from 'components/common/getImage';
const ExcelJS = require('exceljs');

const ESG = () => {

	const [selectedDataCenter,selectDataCenter] = useState("");
	const contextStore = useContext(AuthContext);
	const [state,setState] =  useState([]);
	const [month,setMonth] = useState("");
	const [year,setYear] = useState("");

	useEffect(() => {

		setMonth(Number(contextStore.getMonthYear.month)-1);
		setYear(contextStore.getMonthYear.year);
		getPower();
	},[]);

	const getPower = () => {

		ESGService.index(contextStore.token(),{
			month: month?month:contextStore.getMonthYear.month -1,
			year: year?year:contextStore.getMonthYear.year
		})
		.then(res => setState(res.data.data))
	}


	const renderMonth = () => {

		let months = [];

		for(let i = 1; i<=12; i++){

			months.push(moment(i,'M').format('MMM'));
		}
		return months.map((m,key) => <option value={key+1} key={key}>{m}</option>)
	}
	const renderYear = () => {

		let years = [];

		for(let i = 2022; i<=moment().format('YYYY'); i++){

			years.push(moment(i,'YYYY').format('YYYY'));
		}
		return years.map((y,key) => <option value={y} key={y}>{y}</option>)
	}
	const extractValue = data => {

		if(data === undefined || data === null){
			return "-";
		}else{
			return data
		}
	}

	const downloadExcel = () => {
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('My Sheet');
		console.log(worksheet.id)
		let row = 5
		for(let i=0;i<row;i++){
			worksheet.addRow([]);
		}

		worksheet.getColumn("A").width = 50
		let header = ['Data center/Site']
		let serviceAvailable = ['Service Availability']
		let noOfIncident = ['Number of Incidents']
		let typeOfIncident = ['Type of Incidents']
		let customerImapcted = ['Customers Impacted']
		let totalServiceDowntime = ['Total Service Downtime(mins)']
		let numSecurityIncident = ['Number of security incidents']
		let securityTypeIncident = ['Type of Incidents']
		let securityImpacted = ['Who is impacted']
		let numEhsincident = ['Number of EHS incidents']
		let ehsTypeincident = ['Type of incidents']
		let ehsImpacted = ['Who is impacted']
		let operationPue = ['Operating PUE']
		let designedPue = ['Design PUE']
		let installedIt = ['Installed IT capacity (KVA)']
		let operatingIt = ['Operating IT consumption(KVA)']

		state && state.forEach(data => {
			header.push(data.name)
			serviceAvailable.push(extractValue(data?.data_center_performance?.availability))
			noOfIncident.push(extractValue(data?.data_center_performance?.infra_incident_num))
			typeOfIncident.push(extractValue(data?.data_center_performance?.infra_incident_type))
			console.log(data?.data_center_performance?.infra_incidents)
			// customerImapcted.push(['Customers Impacted', extractValue(infra.impact)])
			let infra_incident = []
			data?.data_center_performance?.infra_incidents.length && data?.data_center_performance.infra_incidents.forEach(infra =>{
				infra_incident.push(infra.impact)
			})
			customerImapcted.push(infra_incident.join(","))
			totalServiceDowntime.push('N/A')

			numSecurityIncident.push(extractValue(data?.data_center_performance?.security_incident_num))
			securityTypeIncident.push(extractValue(data?.data_center_performance?.security_incident_type))
			let security_incident = []
			data?.data_center_performance?.security_incidents.length && data?.data_center_performance?.security_incidents.forEach(security => {security_incident.push(security.impact)})
			securityImpacted.push(security_incident.join(","))

			numEhsincident.push(extractValue(data?.data_center_performance?.ehs_incident_num))
			ehsTypeincident.push(extractValue(data?.data_center_performance?.infra_incident_type))
			let ehs_impacted = []
			data?.data_center_performance?.ehs_incidents.length &&  data?.data_center_performance?.ehs_incidents.forEach(ehs => {ehs_impacted.push(ehs.impact)})
			ehsImpacted.push(ehs_impacted.join(","))

			operationPue.push(extractValue(data?.data_center_performance?.opertating_pue))
			designedPue.push(extractValue(data?.data_center_performance?.design_pue))
			installedIt.push(extractValue(data?.data_center_performance?.installed_kw))
			operatingIt.push(extractValue(data?.data_center_performance?.operating_kw))

		})
		worksheet.addRow(header);
		worksheet.getRow(row+1).font = { bold: true };
		worksheet.addRow(serviceAvailable);
		worksheet.addRow(['Infrastructure Incident'])
		worksheet.getRow(row+3).font = { bold: true };
		worksheet.addRow(noOfIncident)
		worksheet.addRow(typeOfIncident)
		worksheet.addRow(customerImapcted)
		worksheet.addRow(totalServiceDowntime)
		worksheet.addRow(['Security Indcident'])
		worksheet.getRow(row+8).font = { bold: true };
		worksheet.addRow(numSecurityIncident)
		worksheet.addRow(securityTypeIncident)
		worksheet.addRow(securityImpacted)
		worksheet.addRow(['Environment, Health & safety (EHS) incident'])
		worksheet.getRow(row+12).font = { bold: true };
		worksheet.addRow(numEhsincident)
		worksheet.addRow(ehsTypeincident)
		worksheet.addRow(ehsImpacted)
		worksheet.addRow(operationPue)
		worksheet.addRow(designedPue)
		worksheet.addRow(installedIt)
		worksheet.addRow(operatingIt)

		worksheet.eachRow(function(row, rowNumber) {
			row.eachCell(function(cell, colNumber) {
				cell.alignment = { vertical: 'middle', horizontal: 'left' };
			  });

		  });

		  worksheet.getColumn(1).font = {bold: true}

			

			const imageId2 = workbook.addImage({
			base64: myBase64Image,
			extension: 'png',
			});

			worksheet.addImage(imageId2, {
				tl: { col: 2, row: 0 },
				ext: { width: 300, height: 100 }
			  });
			workbook.xlsx.writeBuffer().then(function(buffer) {
				saveAs(
				  new Blob([buffer], { type: "application/octet-stream" }),
				  `ESG-${year}_${month}.xlsx`
				);
			  });
	}
	return (
		<Layout>
			<div className="main_sec_esg">
				<div className="container my-3 main_esg">
					<div className="row g-3">
						<div className="col-12 col-sm-8">
							<div className="txt_esg_top">
								<h3>Data center Performance</h3>
								<p>{moment(month,'M').format('MMM')} {year}</p>
              </div>
            </div>
            <div className="col-12 col-sm-4">
            	<div className="left_box_month">
            			<div className="choose_date">
                 		<select
                		className="form-select w-3rem"
                		aria-label="Default select example"
                		onChange={(event) => {
                			setMonth(event.target.value);
                		}}
                		defaultValue={contextStore.getMonthYear.month -1 }>
                		{

                			renderMonth()
                		}

                        </select>
              	  </div>
                  <div className="choose_date">
                    <select
                		className="form-select w-3rem"
                		aria-label="Default select example"
                		onChange={(event) => {
                			setYear(event.target.value)
                		}}
                		defaultValue={contextStore.getMonthYear.year}>

                			{

                				renderYear()
                			}


                    </select>
                  </div>
                  <div className="btn_go_esg">
                    <button
                		className="btn btn-secondary"
                		onClick={getPower}
                		>Go</button>
                  </div>
                  <div className="excel_icon">
                    <a href="#" onClick={downloadExcel}><img src="images/excel.png" width="25%" />
                    	<span>Export to excel</span>
                    </a>
                  </div>
               </div>
            </div>
         </div>
      </div>
      </div>
      <div class="data_esg_tb mt-4 mb-5">
         <div class="container">
            <div class="tb_st_esg">
                <table class="table table-borderless esg_exprt mb-5">
                   <thead>
                     <tr>
                        <th style={{
                        	fontSize: "1rem",
                        	color: "#92979A",
                        	width: "43%"
                        }}>Data center/Site :</th>

                        {
                        	state && state.map(data => {
                        		return(
			                        <th style={{
			                        	fontSize: "1rem",
			                        	color: "#92979A",
			                        	textAlign: "left"
			                        }}>{data.name}</th>

                        		)
                        	})
                        }
                     </tr>
                   </thead>
                   <tbody>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E",
                         	fontWeight: 500
                         }}>Service Availability :</td>
                        {
                        	state && state.map(data => {
                        		return(
			                        <td style={{
			                         	fontSize: "0.875rem",
			                         	color:"#418DC8",
			                         	textAlign: "left"
			                        }}>{extractValue(data?.data_center_performance?.availability)}</td>

                        		)
                        	})
                        }

                      </tr>
                      <tr>
                         <td className='bg_font'>Infrastructure Incident</td>
                        {
                        	state && state.map(data => <td></td>)
                        }
                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E",
                         	fontWeight: 500,
                           position: "relative",
                           left: "10px"
                         }}>Number of Incidents</td>
                        {
                        	state && state.map(data => {
                        		return(
			                        <td style={{
			                         	fontSize: "0.875rem",
			                         	color:"#0E0E0E",
			                         	textAlign: "left"
			                         }}>{extractValue(data?.data_center_performance?.infra_incident_num)}</td>

                        		)
                        	})
                        }
                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E",
                         	fontWeight: 500,
                           position: "relative",
                           left: "10px"
                         }}>Type of Incidents</td>
                        {
                        	state && state.map(data => {
                        		return(
			                        <td style={{
			                         	fontSize: "0.875rem",
			                         	color:"#0E0E0E",
			                         	textAlign: "left"
			                         }}>{extractValue(data?.data_center_performance?.infra_incident_type)}</td>

                        		)
                        	})
                        }
                      </tr>
                      <tr>
                         <td className='valign'
                         valign="top"
                         style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E",
                         	fontWeight: 500,
                           position: "relative",
                           left: "10px",
                           verticalAlign:"text-top",
                         }}>Customers Impacted</td>
                        {
                        	state && state.map(data => {
                        		return(
			                        <td style={{
			                         	fontSize: "0.875rem",
			                         	color:"#0E0E0E",
			                         	textAlign: "left"
			                         }}>
			                         	{
	data?.data_center_performance?.infra_incidents.length && data?.data_center_performance.infra_incidents.map(infra =>  <p>{extractValue(infra.impact)}</p>)}
			                         </td>

                        		)
                        	})
                        }
                        </tr>

                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E",
                         	fontWeight: 500,
                           position: "relative",
                           left: "10px"
                         }}>Total Service Downtime(mins)</td>
                        {
                        	state && state.map(data => {
                        		return(
			                        <td style={{
			                         	fontSize: "0.875rem",
			                         	color:"#0E0E0E",
			                         	textAlign: "left"
			                         }}>N/A</td>

                        		)
                        	})
                        }
                      </tr>
                      <tr>
                        <td className='bg_font'>Security Indcident</td>
                        {state && state.map(data => <td></td>)}
                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E",
                         	fontWeight: 500,
                           	position: "relative",
                           	left: "10px"
                         }}>Number of security incidents</td>
                        {
                        	state && state.map(data => {
                        		return(
			                        <td style={{
			                         	fontSize: "0.875rem",
			                         	color:"#0E0E0E",
			                         	textAlign: "left"
			                         }}>{extractValue(data?.data_center_performance?.security_incident_num)}</td>

                        		)
                        	})
                        }

                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E",
                         	fontWeight: 500,
                           	position: "relative",
                           	left: "10px"
                         }}>Type of incidents</td>
                         {
                        	state && state.map(data => {
                        		return(
			                        <td style={{
			                         	fontSize: "0.875rem",
			                         	color:"#0E0E0E",
			                         	textAlign: "left"
			                         }}>{extractValue(data?.data_center_performance?.security_incident_type)}</td>

                        		)
                        	})
                        }

                      </tr>
                      <tr>
                         <td className='valign'  style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E",
                         	fontWeight: 500,
                           	position: "relative",
                           	left: "10px",
                           	verticalAlign:"text-top",
                         }}>Who is impacted</td>
                         {
                        	state && state.map(data => {
                        		return(
			                        <td style={{
			                         	fontSize: "0.875rem",
			                         	color:"#0E0E0E",
			                         	textAlign: "left"
			                         }}>
			                         	{
	data?.data_center_performance?.security_incidents.length && data?.data_center_performance?.security_incidents.map(security => <p>{extractValue(security.impact)}</p>)}
			                         </td>

                        		)
                        	})
                        }
                      </tr>
                      <tr>
                         <td className='bg_font'>Environment, Health & safety (EHS) incident</td>
                         <td></td>
                         <td></td>
                         <td></td>
                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E",
                         	fontWeight: 500,
                           	position: "relative",
                           	left: "10px"
                         }}>Number of EHS incidents</td>
                        {
                        	state && state.map(data => {
                        		return(
			                        <td style={{
			                         	fontSize: "0.875rem",
			                         	color:"#0E0E0E",
			                         	textAlign: "left"
			                         }}>{extractValue(data?.data_center_performance?.ehs_incident_num)}</td>

                        		)
                        	})
                        }
                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E",
                         	fontWeight: 500,
                           	position: "relative",
                           	left: "10px"
                         }}>Type of incidents</td>
                        {
                        	state && state.map(data => {
                        		return(
			                        <td style={{
			                         	fontSize: "0.875rem",
			                         	color:"#0E0E0E",
			                         	textAlign: "left"
			                         }}>{extractValue(data?.data_center_performance?.ehs_incident_type)}</td>

                        		)
                        	})
                        }

                      </tr>
                      <tr>
                         <td className='valign'  style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E",
                         	fontWeight: 500,
                           	position: "relative",
                           	left: "10px",
                           	verticalAlign:"text-top",
                         }}>Who is impacted</td>
                        {
                        	state && state.map(data => {

                        		return(
			                        <td style={{
			                         	fontSize: "0.875rem",
			                         	color:"#0E0E0E",
			                         	textAlign: "left"
			                         }}>
			                         	{
	data?.data_center_performance?.ehs_incidents.length &&  data?.data_center_performance?.ehs_incidents.map(ehs => <p>{extractValue(ehs.impact)}</p>)}
			                         </td>

                        		)
                        	})
                        }
                      </tr>

                      <tr>
                         <td className="bg_font" style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E",
                         	fontWeight: 500
                         }}>Operating PUE</td>
                        {
                        	state && state.map(data => {
                        		return(
			                        <td style={{
			                         	fontSize: "0.875rem",
			                         	color:"#0E0E0E",
			                         	textAlign: "left"
			                         }}>{extractValue(data?.data_center_performance?.opertating_pue)}</td>

                        		)
                        	})
                        }

                      </tr>
                      <tr>
                         <td
						 className="bg_font"
						 style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E",
                         	fontWeight: 500
                         }}>Design PUE</td>
                        {
                        	state && state.map(data => {
                        		return(
			                        <td style={{
			                         	fontSize: "0.875rem",
			                         	color:"#0E0E0E",
			                         	textAlign: "left"
			                         }}>{extractValue(data?.data_center_performance?.design_pue)}</td>

                        		)
                        	})
                        }

                      </tr>
                      <tr>
                         <td
						 className="bg_font"
						 style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E",
                         	fontWeight: 500
                         }}>Installed IT capacity (KVA)</td>
                        {
                        	state && state.map(data => {
                        		return(
			                        <td style={{
			                         	fontSize: "0.875rem",
			                         	color:"#0E0E0E",
			                         	textAlign: "left"
			                         }}>{extractValue(data?.data_center_performance?.installed_kw)}</td>

                        		)
                        	})
                        }
                      </tr>
                      <tr>
                         <td
						 className="bg_font"
						 style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E",
                         	fontWeight: 500
                         }}>Operating IT consumption(KVA)</td>
                        {
                        	state && state.map(data => {
                        		return(
			                        <td style={{
			                         	fontSize: "0.875rem",
			                         	color:"#0E0E0E",
			                         	textAlign: "left"
			                         }}>{extractValue(data?.data_center_performance?.operating_kw)}</td>

                        		)
                        	})
                        }
                      </tr>
                   </tbody>
                </table>
            </div>
         </div>
      </div>
		</Layout>
	);
}

export default ESG;