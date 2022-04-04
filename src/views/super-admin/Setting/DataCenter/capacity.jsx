import React,{useEffect,useState,useContext,useRef} from 'react';
import Layout from "../../Layouts";
import Navigation from "../Component/Navigation";
import DataCenterNav from "./Navigation";
import RoleModel from "services/roleServices";
import AuthContext from "context";
import './capacityStyle.css';
import {Link} from 'react-router-dom';
import CapacityService from 'services/capacityService';
import moment from 'moment';
import {numberFormat2} from 'common/helpers';
import Swal from 'sweetalert2';


const Capacity = (props) => {
	const authContext = useContext(AuthContext);
	const [dataCenter, setDataCenter] = useState([])
	const [currentDataCenter, setCurrentDataCenter] = useState([])
	const [countryName, setCountryName] = useState("Country");
	const initialMount = useRef(true);
	const [capcityData,setCapacityData] = useState([]);
	const [state,setState] = useState({});
	const [payloadData,setPayloadData] = useState([]);
	const [month,setMonth] = useState("");
	const [year,setYear] = useState("");
	const modalRef = useRef(null);
	const [isSubmitEnabled,setSubmitEnabled] = useState(false);
	const [ascending,setAscending] = useState(true);
	const [dataHallAscending,setDataHallAscending] = useState(true);
	const [isReadOnly,setIsReadOnly] = useState(true);
	const [isDataChanged,setDataChanged] = useState(false);

	useEffect(() => {

		if(initialMount.current === true){
			setMonth(Number(authContext.getMonthYear.month)-1);
			setYear(authContext.getMonthYear.year);
			selectDataCenterFloor(authContext.getDataCenters[0]);
		
			initialMount.current = false

			if(authContext?.getAuth?.role?.space === 3 || 
				authContext?.getAuth?.role?.m_e === 3 || 
				authContext?.getAuth?.role?.network === 3){
				setIsReadOnly(false);
			}
			
			
		}else{
			
			
			setDataChanged(false);
			
			
		}
		getAllDataCenter();
		
		
	},[authContext.getFloor,currentDataCenter,isDataChanged]);


	const onChangeData = (event,data,slug) => {

		let payload = {};
			
		capcityData.map(capacity => {
			
			if(capacity.id === data.id){
				setSubmitEnabled(true);
				setDataChanged(true);
				capacity.monthly_utilization[slug] = event.target.value
			}
		});
	}
	const onSubmit = async () => {

		let data = [];
		capcityData && capcityData.map(util => data.push(util.monthly_utilization));
		
		CapacityService.store(authContext.token(),{data}).then(res => {
			selectDataCenterFloor(currentDataCenter);
			Swal.fire("Data Updated");
		});

		onClose();
	}
	const onClose = () => {
		modalRef.current.click();
	}
	
	const getAllDataCenter = async () => {
		setCountryName("Country");
		if(authContext.getDataCenters.length === 0){

			await RoleModel.dataCenter(authContext.token()).then(res => {
				authContext.setDataCenter(res.data.data);
				setDataCenter(res.data.data);
				if(res.data.data.length > 0){
					if(initialMount.current){
					
						selectDataCenterFloor(res.data.data[0])
						
						initialMount.current = false
					}
					
					
				}
			});
		}else{
			
			if(initialMount.current){
				
				selectDataCenterFloor(authContext.getDataCenters[0]);
				initialMount.current = false
			}
			setDataCenter(authContext.getDataCenters);
		}
	}

	const getDataCenterById = async(e) => {
		setCountryName(e.name)
		if(authContext.getDataCenters.length === 0){

			await RoleModel.dataCenterByCountryId(authContext.token(), e).then(res => {
					setDataCenter(res.data.data)
					if(res.data.data.length > 0){
					
						selectDataCenterFloor(res.data.data[0])
					}
			})
		}else{

			const data = authContext.getDataCenters.filter(data => data.country_id === e.id);
			setDataCenter(data)
			if(data.length > 0){
			
				selectDataCenterFloor(data[0])
			}	
		}
	}
	const getCapacity = async (dataCenter) => {

		const data = {
			dataCenterId: dataCenter.id,
			month: month?month:authContext.getMonthYear.month -1,
			year: year?year:authContext.getMonthYear.year
		};
		
		await CapacityService.index(authContext.token(),data).then(async res => {
			
			await setCapacityData(res.data.data);
		})
	}
	const selectDataCenterFloor = async(e) => {
		
		getCapacity(e);
		setCurrentDataCenter(e);
		
	}
	const onFilter = async () => {

		const data = {
			dataCenterId: currentDataCenter.id,
			month: month,
			year: year
		};
		if(month >= Number(authContext.getMonthYear.month) || year > authContext.getMonthYear.year){
			Swal.fire("You can not select future date");
		}else{
			
			await CapacityService.index(authContext.token(),data).then(async res => {
				if(Number(authContext.getMonthYear.month)-1 == Number(month) && authContext.getMonthYear.year == year){
					setIsReadOnly(false);	
				}else{
					setIsReadOnly(true);
				}
				
				await setCapacityData(res.data.data);
			})
		}
		
	}

	const renderCountry = () => {

		return authContext.getCountries.length && authContext.getCountries.map((data,i) => {
			
			return <a className="dropdown-item" 
			key={i}
			onClick={() =>{
				
				getDataCenterById(data)
			} }>{data.name} </a>
		})
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
	


	return(
		<Layout>
			<div className="content-body" >
        		<Navigation/>
				<hr className="main" />
				<div className="container-fluid pt-0">
				<div className="row ">
						<DataCenterNav/>
						<div className="col-lg-11">
							<div id="pro">
							   <div className="profile-tab">
                           <div className="custom-tab-1">
                              <div className="main_scrll">
                                 <div className="btn_ul">
                                    <ul className="nav nav-tabs mb-3">
                                 <li className="nav-item"> <button className="btn btn-secondary" style={{width: '100%'}} onClick={getAllDataCenter}> Global </button></li>
                                 <li className="nav-item">
                                    <div className="btn-group" role="group">
                                       <button type="button" className="btn btn-light dropdown-toggle" style={{width: '100%'}} data-bs-toggle="dropdown" aria-expanded="false"> {countryName} </button>
                                       <div className="dropdown-menu" style={{margin: '0px'}}>
                                          {renderCountry()}
                                       </div>
                                    </div>
                                 </li>
                                 </ul> 
                                 </div>
                                 <div className="ul_scrll">
                                    <ul className="nav nav-tabs custom-scroll-gap">
										{
										dataCenter && dataCenter.map((data,index) => {

		                  				if(currentDataCenter && currentDataCenter.id == data.id){
		                  					return(
			                  					<li 
			                  					className={index == 0?'nav-item':'nav-item'}
			                  					key={index}>
			                  						<a 
			                  						onClick={() => 
														selectDataCenterFloor(data)}
			                  						style={{cursor:'pointer'}} 
			                  						className="nav-link active show"> 
			                  							<img className="down setting_down" src="\images\downward-arrow.png" />
			                  							{data.name}
			                  						</a> 
			                  					</li>
			                  				)
		                  				}else{

			                  				return(
			                  					<li 
			                  					className={index == 0?'nav-item':'nav-item'}
			                  					key={index}>
			                  						<a 
			                  						onClick={() => selectDataCenterFloor(data)}
			                  						style={{cursor:'pointer'}} 
			                  						className="nav-link"> {data.name} </a> 
			                  					</li>
			                  				)
		                  				}
										})
									}
                              		</ul>
                                 </div>
                              </div>
                           </div>
                        </div>
							
{/*Capacity Block*/}
<div className="row">
	<div>
        <div className="row gy-4 align-items-center">
            <div className="col-12 col-sm-12 col-md-12 col-lg-9">
               	<div className="card-header" id="header">
                  	<div className="d-sm-flex d-block justify-content-between align-items-center">
                     	<div className="card-action coin-tabs mt-3 mt-sm-0">
                        	<ul className="nav nav-tabs" role="tablist">
                            	<li className="nav-item gap_s">
		                          	<a 
		                          	className="nav-link active" 
		                          	id="tab1" 
		                          	data-bs-toggle="tab" 
		                          	href="#">Monthly Utilisation</a>
                           		</li>
	                           <li className="nav-item gap_s">
	                              	<a 
	                              	className="nav-link" 
	                              	id="tab2" 
	                              	data-bs-toggle="tab" 
	                              	href="#"> Thresholds</a>
	                           </li>
                        	</ul>
                     	</div>
                  	</div>
               </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-3">
                <div className="left_box_month">
                	<div className="choose_date">
                
                		<select 
                		className="form-select" 
                		aria-label="Default select example"
                		onChange={(event) => {
                			setMonth(event.target.value);
                		}}
                		defaultValue={authContext.getMonthYear.month -1 }>
                		{

                			renderMonth()
                		}

                        </select>
                
                  	</div>
                  	<div className="choose_date">
                
                		<select 
                		className="form-select" 
                		aria-label="Default select example" 
                		onChange={(event) => {
                			setYear(event.target.value)
                		}}
                		defaultValue={authContext.getMonthYear.year}>

                			{

                				renderYear()
                			}


                        </select>
                
                  	</div>
                  	<div className="choose_date">
                
                		<button 
                		className="btn btn-secondary"
                		onClick={onFilter}
                		>Go</button>
                
                  	</div>
                  	<div className="excel_icon">
                      	<img src="\images\excel.png" width="25px" /> 
                  	</div>
               </div>
            </div>
            <div className="table_monthly mt-4" style={{overflowX:"auto"}}>
               	<table className="table border border-light table-borderless">
               	<thead>
               		<tr>
               		<th 
               		scope="col" 
               		colSpan="2" 
               		style={{textAlign:"left",paddingLeft:"17px !important"}}>TYO1</th>
      				<th 
      				scope="col" 
      				colSpan="3" 
      				className="total_color">Total</th>
      				<th 
      				scope="col" 
      				colSpan="3" 
      				className="in_so">Installed/Sold</th>
      				<th 
      				scope="col" 
      				colSpan="3" 
      				className="res">Reserved</th>
      				<th 
      				scope="col" 
      				colSpan="3" 
      				className="strd">Stranded/Hold</th>
      				<th 
      				scope="col" 
      				colSpan="3" 
      				className="avilbl">Available</th>
      				<th 
      				scope="col" 
      				colSpan="3" 
      				className="entvs">Delta</th>
      			</tr>
      		</thead>
      	<thead>
      	<tr>
      		<th scope="col" onClick={() => {
				setAscending(!ascending);
				if(ascending === true){

					capcityData.sort((a,b)=> (a.floor.name < b.floor.name ? 1 : -1))
				}
				if (ascending === false) {
					capcityData.sort((a,b)=> (a.floor.name > b.floor.name ? 1 : -1))
				}

			}} style={{cursor:"pointer"}}> Floor 
		{/*	<i 
			className={`fa fa-solid fa-sort-${ascending?'down':'up'}`}

			></i> */}
			</th>
      		<th scope="col" onClick={() => {
				setDataHallAscending(!dataHallAscending);
				if(dataHallAscending === true){

					capcityData.sort((a,b)=> (a.name < b.name ? 1 : -1))
				}
				if (dataHallAscending === false) {
					capcityData.sort((a,b)=> (a.name > b.name ? 1 : -1))
				}

			}} style={{cursor:"pointer"}}> Data Hall 
			{/*<i 
			className={`fa fa-solid fa-sort-${dataHallAscending?'down':'up'}`}

			></i> */}
			</th>
      		
      		<th scope="col" className="bg_gray">CabE</th>
      		<th scope="col" className="bg_gray">Cages</th>
      		<th scope="col" className="bg_gray">(kW)</th>
      		<th scope="col" className="tbr">CabE</th>
      		<th scope="col" className="tbr">Cages</th>
      		<th scope="col" className="tbr">(kW)</th>
      		<th scope="col" className="tbr">CabE</th>
      		<th scope="col" className="tbr">Cages</th>
      		<th scope="col" className="tbr">(kW)</th>
      		<th scope="col" className="tbr">CabE</th>
      		<th scope="col" className="tbr">Cages</th>
      		<th scope="col" className="tbr">(kW)</th>
      		<th scope="col" className="tbr">CabE</th>
      		<th scope="col" className="tbr">Cages</th>
      		<th scope="col" className="tbr">(kW)</th>
      		<th scope="col" className="tbr">CabE</th>
      		<th scope="col" className="tbr">Cages</th>
      		<th scope="col" className="tbr">(kW)</th>
      	</tr>
  	</thead>
  	<tbody>
  		{capcityData && capcityData.map(capacity => {

  			let totalCabs = 0;
  			let totalCages = 0;
  			let totalpower = 0;

  			if (capacity.monthly_utilization == null) {
  				
	  			capacity.monthly_utilization = {
					month: month?month:Number(authContext.getMonthYear.month) - 1,
					year: authContext.getMonthYear.year,
					data_hall_id: capacity.id,
					data_center_id: currentDataCenter.id,
					country_id: currentDataCenter.country_id,
				}
				totalCabs = Number(capacity.design_cabs);
  				totalCages = Number(capacity.design_cages);
  				totalpower = Number(capacity.design_power);
  			}else{

  				let subCab = Number(capacity.monthly_utilization?.sold_cabs || 0) + Number(capacity.monthly_utilization?.reserved_cabs || 0)+ Number(capacity.monthly_utilization?.blocked_cabs || 0)+ Number(capacity.monthly_utilization?.available_cabs || 0);

  				let subCages = (Number(capacity.monthly_utilization?.sold_cages || 0) + Number(capacity.monthly_utilization?.reserved_cages || 0)+ Number(capacity.monthly_utilization?.blocked_cages || 0)+ Number(capacity.monthly_utilization?.available_cages || 0));

  				let subPower = (Number(capacity.monthly_utilization?.sold_power || 0) + Number(capacity.monthly_utilization?.reserved_power || 0)+ Number(capacity.monthly_utilization?.blocked_power || 0)+ Number(capacity.monthly_utilization?.available_power || 0));
  					
  				if (isNaN(subCab) === false) {

  					totalCabs = Number(capacity.design_cabs) - subCab;
  				}else{
  					totalCabs = Number(capacity.design_cabs);
  				}
  				if(isNaN(subCages) === false){

  					totalCages = Number(capacity.design_cages) - subCages;
  				}else{
  					totalCages = Number(capacity.design_cages);
  				}
  				if(isNaN(subPower) === false){

  					totalpower = Number(capacity.design_power) - subPower;
  				}else{
  					totalpower = Number(capacity.design_power);
  				}

  			}

  			return(
		    	<tr key={capacity.id}>
			      	<td>{capacity.floor.name} </td>
			      	<td>{capacity.name}</td>
			      	<td className="bg_gray">
			      
			      		<input type="number"
			      			value={ isReadOnly?(capacity.monthly_utilization?.total_cabs || 0):capacity.design_cabs}
			      			onChange={(event) => {
			      				capacity.design_cabs = event.target.value;
			      				onChangeData(event,capacity,'total_cabs')
			      			}}
			      		/>
			     
			      	</td>
			      	<td className="bg_gray">
			      	
			      		<input type="number"
			      		
			      			value={isReadOnly?(capacity.monthly_utilization?.total_cages || 0):capacity.design_cages}
			      			onChange={(event) => {
			      				capacity.design_cages = event.target.value;
			      				onChangeData(event,capacity,'total_cages')
			      			}}
			      		/>
			      		
			      	</td>
			      	<td className="bg_gray">
			      		
			      		<input type="number"
			      		
		value={isReadOnly?numberFormat2((capacity.monthly_utilization?.total_power || 0)):numberFormat2(capacity.design_power)}
			      			onChange={(event) => {
			      				capacity.design_power = event.target.value;
			      				onChangeData(event,capacity,'total_power')
			      			}}
			      		/>
			      	
			      	</td>
			      	<td className="tbr">

			      		
			      		<input type="number"
			      			
			      			value={numberFormat2((capacity.monthly_utilization?.sold_cabs || 0))}
			      			onChange={(event) => onChangeData(event,capacity,'sold_cabs')}
			      		/>

			      		
			      		
			      	</td>
			      	<td className="tbr">
			      		
			      		<input type="number"
			      		
			      			value={numberFormat2(capacity.monthly_utilization?.sold_cages)}
			      			onChange={(event) => onChangeData(event,capacity,'sold_cages')}
			      		/>
			      		
			      	</td>
			      	<td className="tbr">

			      		<input type="number"
			      		 
			      			value={numberFormat2(capacity.monthly_utilization?.sold_power,3)}
			      			onChange={(event) => onChangeData(event,capacity,'sold_power')}
			      		/>
			      		
			      	</td>
			      	<td className="tbr">
			      		
			      
			      		<input type="number"
			      		 
			      			value={numberFormat2(capacity.monthly_utilization?.reserved_cabs)}
			      			onChange={(event) => onChangeData(event,capacity,'reserved_cabs')}
			      		/>
			      	
			      	</td>
			      	<td className="tbr">
			      	
			      		<input type="number"
			      		 
			      			value={numberFormat2(capacity.monthly_utilization?.reserved_cages)}
			      			onChange={(event) => onChangeData(event,capacity,'reserved_cages')}
			      		/>
			      	
			      	</td>
			      	<td className="tbr">
			      		
			      	
			      		<input type="number"
			      		 
			      			value={numberFormat2(capacity.monthly_utilization?.reserved_power,3)}
			      			onChange={(event) => onChangeData(event,capacity,'reserved_power')}
			      		/>
			      		
			      	</td>
			      	<td className="tbr">
			      		
			      
			      		<input type="number"
			      		 
			      			value={numberFormat2(capacity.monthly_utilization?.blocked_cabs)}
			      			onChange={(event) => onChangeData(event,capacity,'blocked_cabs')}
			      		/>
			      		
			      	</td>
			      	<td className="tbr">
			      		
			      
			      		<input type="number"
			      		 
			      			value={numberFormat2(capacity.monthly_utilization?.blocked_cages)}
			      			onChange={(event) => onChangeData(event,capacity,'blocked_cages')}
			      		/>
			      		
			      	</td>
			      	<td className="tbr">
			      		
			      
			      		<input type="number"
			      		 
			      			value={numberFormat2(capacity.monthly_utilization?.blocked_power,3)}
			      			onChange={(event) => onChangeData(event,capacity,'blocked_power')}
			      		/>
			      		
			      	</td>
			      	<td className="tbr">
			      		
			      
			      		<input type="number"
			      		 
			      			value={numberFormat2(capacity.monthly_utilization?.available_cabs)}
			      			onChange={(event) => onChangeData(event,capacity,'available_cabs')}
			      		/>

			      	</td>
			      	<td className="tbr">
			      		
			      	
			      		<input type="number"
			      		 
			      			value={numberFormat2(capacity.monthly_utilization?.available_cages)}
			      			onChange={(event) => onChangeData(event,capacity,'available_cages')}
			      		/>
			      		
			      	</td>
			      	<td className="tbr">
			      
			      	<input type="number"
			      	 
			      			value={numberFormat2(capacity.monthly_utilization?.available_power,3)}
			      			onChange={(event) => onChangeData(event,capacity,'available_power')}
			      		/>
			      	
			      	</td>
			      	<td className="tbr" style={{backgroundColor: Number(numberFormat2(totalCabs))< 0?'red':'white'}}>{numberFormat2(totalCabs)}</td>
			      	<td className="tbr" style={{backgroundColor: Number(numberFormat2(totalCages))< 0?'red':'white'}}>{numberFormat2(totalCages)}</td>
			      	<td className="tbr" style={{backgroundColor: Number(numberFormat2(totalpower))< 0?'red':'white'}}>{numberFormat2(totalpower,3)}</td>
		    	</tr>
  			)
  		})}
  </tbody>
</table>
            </div> 
         
            <div className="monthly_last_btn">
               <div className="toolbar toolbar-bottom d-flex" role="toolbar">   
                   <button type="button" className="btn btn-outline-primary mr_1"> Cancel </button>
                   <button 
                   type="submit" 
                   className="btn btn-primary" 
                   data-bs-toggle="modal" 
                   disabled={!isSubmitEnabled}
                   data-bs-target=".bd-example-modal-lg"> Save </button>
               </div>
            </div>
         
            <div>
                      
                     <div className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                           <div className="modal-content">
                              <div className="modal-header mt-59">
                                 <h3 className="modal-title">Confirm Edit</h3>
                                 <button 
                                 type="button" 
                                 className="btn-close" 
                                 ref={modalRef}
                                 data-bs-dismiss="modal"> </button>
                              </div>
                              <div className="modal-body">
                                 <div className="card" style={{border:"none"}}>
                                    <div className="card-body">
                                        <div className="txt_comf">
                                           <p>Please confirm before updating the database.</p>
                                        </div>
                                        <div className="toolbar toolbar-bottom mt-51 d-flex justify-content-end" role="toolbar">   
                   <button 
                   type="button" 
                   onClick={onClose}
                   className="btn btn-outline-primary mr_1"> Cancel </button>
                   <button 
                   type="button" 
                   
                   onClick={onSubmit} 
                   className="btn btn-primary"> Save </button>
                    
               </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
         </div>
      </div>
							</div>
						
							</div>
						</div>
					</div>
				
			</div>
			</div>
					</Layout>
	)
}

export default Capacity;
