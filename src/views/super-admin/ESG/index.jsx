import React,{useState,useEffect,useContext} from 'react';
import Layout from "../Layouts";
import './style.css';
import ESGService from 'services/esgServices';
import AuthContext from "context";
import moment from 'moment';

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
                    <a href="#"><img src="images/excel.png" width="25%" />
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
			                        }}>{data?.data_center_performance?.availability || 'N/A'}</td>

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
			                         }}>{data?.data_center_performance?.infra_incident_num || 'N/A'}</td>

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
			                         }}>{data?.data_center_performance?.infra_incident_type || 'N/A'}</td>

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
	data?.data_center_performance?.infra_incidents.length ? data?.data_center_performance.infra_incidents.map(infra =>  <p>{infra.impact}</p>):'N/A'}
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
			                         }}>0</td>

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
			                         }}>{data?.data_center_performance?.security_incident_num || 'N/A'}</td>

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
			                         }}>{data?.data_center_performance?.security_incident_type || 'N/A'}</td>

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
	data?.data_center_performance?.security_incidents.length ? data?.data_center_performance?.security_incidents.map(security => <p>{security.impact}</p>):'N/A'}
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
			                         }}>{data?.data_center_performance?.ehs_incident_num || 'N/A'}</td>

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
			                         }}>{data?.data_center_performance?.ehs_incident_type || 'N/A'}</td>

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
	data?.data_center_performance?.ehs_incidents.length ? data?.data_center_performance?.ehs_incidents.map(ehs => <p>{ehs.impact || 'N/A'}</p>):'N/A'}
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
			                         }}>{data?.data_center_performance?.opertating_pue || 'N/A'}</td>

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
			                         }}>{data?.data_center_performance?.design_pue || 'N/A'}</td>

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
			                         }}>{data?.data_center_performance?.installed_kw || 'N/A'}</td>

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
			                         }}>{data?.data_center_performance?.operating_kw || 'N/A'}</td>

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