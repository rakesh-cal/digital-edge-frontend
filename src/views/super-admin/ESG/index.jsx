import React,{useState} from 'react';
import Layout from "../Layouts";

const ESG = () => {

	const [selectedDataCenter,selectDataCenter] = useState("");
	return (
		<Layout>
			<div className="flex_table">
            	<table 
            	className="table table-borderless tb_dcp mb-4" 
            	style={{
            		width:'350px',
            		whiteSpace:'nowrap'
            	}}>
                  	<thead>
                  		<tr>
                        	<th colSpan="7" className="text-start" style={{
                        		fontWeight: "600 !important",
                        		fontSize: "1.2rem",
                        		border: "none"
                        	}}>Data Center Performance</th>
                     	</tr>
                     	<tr>
                        	<td 
                        	className="text-start" 
                        	style={{fontWeight: 600}}>Service Availability:</td>
                        	<td className="text-start">

                        		<input 
                        		type="text" 
                        	
                        		style={{width: "70px"}} />
                        	</td>
                        	<td className="text-start"></td>                        
                     	</tr>
                     	<tr>
                        	<td className="text-start">Operating PUE</td>
                        	<td className="text-start">
	                        	<input 
	                        	type="text" 
	                        	style={{width: "70px"}} />
                        	</td>
                        	<td className="text-start"></td>
                     	</tr>
                     	<tr>
                        	<td className="text-start">Design PUE</td>
                        	<td className="text-start">
	                        	<input 
	                        	type="text" 
	                        	style={{width: "70px"}} />
                        	</td>
                        
                     	</tr>
                     	<tr>
                        	<td className="text-start">Installed IT Capacity (KVA)</td>
                        	<td className="text-start">
	                        	<input 
	                        	type="text"
	                        	style={{width: "70px"}} />
                        	</td>
                        
                     	</tr>
                     	<tr>
                        	<td className="text-start">Operating IT Consumption</td>
                        	<td className="text-start">
	                        	<input 
	                        	type="text" 
	                        
	                        
	                        	style={{width: "70px"}} />
                        	</td>
                        </tr>
                     	<tr>
                        	<td className="text-start"></td>
                        	<td className="text-start"></td>           
                     	</tr>
                     	<tr>
                        	<td className="text-start"></td>
                        	<td className="text-start"></td>
                     	</tr>
                  	</thead>
               </table>
               <table 
               className="table table-borderless tb_dcp mb-4" 
               style={{
               	width:'350px',
               	whiteSpace:'nowrap'
               }}>
               		<thead>
                     	<tr>
                         	<th colSpan="7" className="text-start" style={{
                        	fontWeight: "600 !important",
                        	fontSize: "1.2rem",
                        	border: "none"
                        	}}></th>
                     	</tr>
                     	<tr>
                     		<td className="text-start" 
	                        style={{background:"#595959",color: "#fff"}}>
	                        	Incidents
	                        </td>
	                        <td className="text-start" 
	                        style={{background:"#595959",color: "#fff"}}>
	                        	Infra
	                        </td>
	                        <td className="text-start" 
	                        style={{background:"#595959",color: "#fff"}}>
	                        	Security
	                        </td>
	                        <td className="text-start" 
	                        style={{background:"#595959",color: "#fff"}}>
	                        	EHS
	                        </td>
                     	</tr>
                     	<tr>
	                        <td className="text-start">Number</td>
	                        <td className="text-start">
	                        	<input 
	                        	type="text" 
	                        	style={{width:'70px'}} />
	                        </td>
	                         <td className="text-start">
	                        	<input 
	                        	type="text" 
	                        	style={{width:'70px'}} />
	                        </td>
	                        <td className="text-start">
	                        	<input 
	                        	type="text"
	                        	style={{width:'70px'}} />
	                        </td>
                     	</tr>
                     	<tr>
                     		
                        	<td className="text-start">Types</td>
                        	<td className="text-start">
	                        	<input 
	                        	type="text" 
	                        	style={{width:'70px'}} />
	                        </td>
	                         <td className="text-start">
	                        	<input 
	                        	type="text" 
	                        	style={{width:'70px'}} />
	                        </td>
	                        <td className="text-start">
	                        	<input 
	                        	type="text" 
	                        	style={{width:'70px'}} />
	                        </td>
                     
                     	</tr>
                     	<tr>
	                       <td className="text-start" valign="top">Who's Impacted</td>
	                       <td className="text-start" valign="top"></td>

                        		                   
                     	</tr>
                     	
                    </thead>
               </table>
            	
               </div>
		</Layout>
	);
}

export default ESG;