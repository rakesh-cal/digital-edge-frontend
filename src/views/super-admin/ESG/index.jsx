import React,{useState} from 'react';
import Layout from "../Layouts";
import './style.css'

const ESG = () => {

	const [selectedDataCenter,selectDataCenter] = useState("");
	return (
		<Layout>
			<div className="main_sec_esg">
				<div className="container my-3 main_esg">
					<div className="row g-3">
						<div className="col-12 col-sm-7">
							<div className="txt_esg_top">
								<h3>Data center Performance</h3>
								<p>Mar 2022</p>
              </div>
            </div>
            <div className="col-12 col-sm-5">
            	<div className="left_box_month">
            			<div className="choose_date">
                 		<select className="form-select" aria-label="Default select example">
                      <option selected>FEB</option>
                      <option value="1">FEB</option>
            	        <option value="2">FEB</option>
                      <option value="3">FEB</option>
                    </select>
              	  </div>
                  <div className="choose_date">
                    <select className="form-select" aria-label="Default select example">
                      <option selected>2022</option>
                      <option value="1">2022</option>
                      <option value="2">2022</option>
                      <option value="3">2022</option>
                    </select>
                  </div>
                  <div className="btn_go_esg">
                    <button type="submit" className="btn btn-primary"> Go</button>
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
                        <th style={{
                        	fontSize: "1rem",
                        	color: "#92979A",
                        	textAlign: "right"
                        }}>TYO1</th>
                        <th style={{
                        	fontSize: "1rem",
                        	color: "#92979A",
                        	textAlign: "right"
                        }}>TYO2</th>
                        <th style={{
                        	fontSize: "1rem",
                        	color: "#92979A",
                        	textAlign: "right"
                        }}>TYO2</th>
                     </tr>
                   </thead>
                   <tbody>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E",
                         	fontWeight: 500
                         }}>Service Availability :</td>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color:"#418DC8", 
                         	textAlign: "right"
                         }}>100.00%</td>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color:"#418DC8", 
                         	textAlign: "right"
                         }}>100.00%</td>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color:"#418DC8", 
                         	textAlign: "right"
                         }}>100.00%</td>
                      </tr>
                      <tr>
                         <td className='bg_font'>Infrastructure Incident</td>
                         <td></td>
                         <td></td>
                         <td></td>
                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E", 
                         	fontWeight: 500	
                         }}>Number of Incidents</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>0</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>0</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>0</td>
                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E", 
                         	fontWeight: 500	
                         }}>Type of Incidents</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E", 
                         	fontWeight: 500	
                         }}>Customers Impacted</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E", 
                         	fontWeight: 500	
                         }}>Total Service Downtime(mins)</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>0</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>0</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>0</td>
                      </tr>
                      <tr>
                         <td className='bg_font'>Security Indcident</td>
                         <td></td>
                         <td></td>
                         <td></td>
                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E", 
                         	fontWeight: 500	
                         }}>Number of security incidents</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>0</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>0</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>0</td>
                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E", 
                         	fontWeight: 500	
                         }}>Type of incidents</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E", 
                         	fontWeight: 500	
                         }}>Who is impacted</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
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
                         	fontWeight: 500	
                         }}>Number of EHS incidents</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>0</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>0</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>0</td>
                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E", 
                         	fontWeight: 500	
                         }}>Type of incidents</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E", 
                         	fontWeight: 500	
                         }}>Who is impacted</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                      </tr>
                      <tr>
                         <td className='bg_font'>Operating PUE</td>
                         <td></td>
                         <td></td>
                         <td></td>
                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E", 
                         	fontWeight: 500	
                         }}>Operating PUE</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>1.46</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>1.46</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>1.83</td>
                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E", 
                         	fontWeight: 500	
                         }}>Design PUE</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>1.5</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>N/A</td>
                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E", 
                         	fontWeight: 500	
                         }}>Insralled IT capacity (KVA)</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>3.760</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>1300</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>3920</td>
                      </tr>
                      <tr>
                         <td style={{
                         	fontSize: "0.875rem",
                         	color: "#0E0E0E", 
                         	fontWeight: 500	
                         }}>Operating IT consumption(KVA)</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>702</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>682</td>
                         <td style={{
                         	fontSize: "0.875rem", 
                         	color:"#0E0E0E",
                         	textAlign: "right"
                         }}>1087.5</td>
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