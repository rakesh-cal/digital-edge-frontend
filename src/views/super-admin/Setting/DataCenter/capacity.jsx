import React,{useEffect,useState,useContext,useRef} from 'react';
import Layout from "../../Layouts";
import Navigation from "../Component/Navigation";
import DataCenterNav from "./Navigation";
import RoleModel from "services/roleServices";
import AuthContext from "context";
import './capacityStyle.css';
import CapacityService from 'services/capacityService';
import moment from 'moment';
import {numberFormat} from 'common/helpers';
import Swal from 'sweetalert2';
import Floors from "services/floorServices";
import DataCenterPerformance from "services/DataCenterPerformance";
import saveAs from "file-saver";
import { myBase64Image } from 'components/common/getImage';
const ExcelJS = require('exceljs');


const Capacity = props => {
	const authContext = useContext(AuthContext);
	const [dataCenter, setDataCenter] = useState([])
	const [currentDataCenter, setCurrentDataCenter] = useState([])
	const [countryName, setCountryName] = useState("Country");
	const initialMount = useRef(true);
	const [capcityData,setCapacityData] = useState([]);
	const [month,setMonth] = useState("");
	const [year,setYear] = useState("");
	const modalRef = useRef(null);
	const [isSubmitEnabled,setSubmitEnabled] = useState(false);
	const [isReadOnly,setIsReadOnly] = useState(true);
	const [isDataChanged,setDataChanged] = useState(false);
	const [performanceState,setPerformanceState] = useState({
		data_center_id:'',
		month:'',
		year:'',
		availability:'',
		opertating_pue:'',
		design_pue:'',
		installed_kw:'',
		operating_kw:'',
		infra_incident_num:'',
		infra_incident_type:'',
		security_incident_num:'',
		security_incident_type:'',
		ehs_incident_num:'',
		ehs_incident_type:''
	});
	
	const [infraImpact,setInfraImpact] = useState([{
		impact:"-"
	}]);
	const [securityImpact,setSecurityImpact] = useState([{
		impact:"-"
	}]);
	const [ehsImpact,setEhsImpact] = useState([{
		impact:"-"
	}]);

	useEffect(async() => {
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

		capcityData.map(capacity => {
		
			if(capacity.id === data.id){
				setSubmitEnabled(true);
				setDataChanged(true);
				capacity.monthly_utilization[slug] = event.target.value
			}
		
		});
	}
	const getPeformanceData = async payload => {


		await DataCenterPerformance.index(authContext.token(),payload).then(data => {
			
			setPerformanceState(data.data.data);
			if(data.data.data?.infra_incidents && data.data.data.infra_incidents.length){

				setInfraImpact(data.data.data.infra_incidents);
			}else{
				setInfraImpact([{impact:"-"}]);
			}
			if(data.data.data?.security_incidents && data.data.data.security_incidents.length){

				setSecurityImpact(data.data.data.security_incidents);
			}else{
				setSecurityImpact([{impact:"-"}]);	
			}
			if(data.data.data?.ehs_incidents && data.data.data.ehs_incidents.length){

				setEhsImpact(data.data.data.ehs_incidents);
			}else{
				setEhsImpact([{impact:"-"}]);
			}
		})
	}
	const onSubmit = async () => {

		if(performanceState != undefined || performanceState != null ){
			delete performanceState.infra_incidents;
			delete performanceState.security_incidents;
			delete performanceState.ehs_incidents;
		}

		const performanceData = {
			...performanceState,
			data_center_id: currentDataCenter.id,
			month: month?month:authContext.getMonthYear.month -1,
			year: year?year:authContext.getMonthYear.year,
			infra:infraImpact,
			security:securityImpact,
			ehs:ehsImpact
		};

		

		let data = [];
		capcityData && capcityData.map(util => data.push(util.monthly_utilization));
		
		CapacityService.store(authContext.token(),{data}).then(res => {
			
			DataCenterPerformance.updateOrCreate(authContext.token(),performanceData)
			.then(() => {
				selectDataCenterFloor(currentDataCenter);
				findFloor();
				Swal.fire({
				  	icon: 'success',
					title: 'Success',
					text: 'Data Updated'
				});

			}).catch(() => {
				Swal.fire({
				    icon: 'error',
				    title: 'Oops...',
				    text: 'Something went wrong!'
				})
			});
			
			
			
			
		}).catch(() => {

			Swal.fire({
			    icon: 'error',
			    title: 'Oops...',
			    text: 'Something went wrong!'
			})
		});

		onClose();
	}
	const findFloor = () => {

		Floors.findAllFloor(authContext.token()).then(res => {
				
			authContext.setFloor(res.data.data);
			authContext.setDataCenterFloor(res.data.data);
		}).catch(err => {
			//500 internal server error
				
		})
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
	const getCapacity = async dataCenter => {

		const data = {
			dataCenterId: dataCenter.id,
			month: month?month:authContext.getMonthYear.month -1,
			year: year?year:authContext.getMonthYear.year
		};

		getPeformanceData(data);
		
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
		getPeformanceData(data);

		if(month >= Number(authContext.getMonthYear.month) || year > authContext.getMonthYear.year){
			Swal.fire("You can not select future date");
		}else{
			
			await CapacityService.index(authContext.token(),data).then(async res => {
				if(Number(authContext.getMonthYear.month)-1 === Number(month) && authContext.getMonthYear.year === year){
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
	const extractValue = data => {
		
		if(data === undefined){
			return "";
		}else{
			if(data === 0){
				return "-";
			}else{
				return data;
			}
		}
	}
	const extractValue2 = data => {
		
		if(data === undefined){
			return "-";
		}else{
			if(data === 0){
				return 0;
			}else{
				return data;
			}
		}
	}
	const extVal = (util,hall) => {

		if(isReadOnly === true){
		
			return extractValue(util);
		}else{
			
			return extractValue(hall);
		}
	}
	const addInfraInputField = () => {
        
        setInfraImpact([...infraImpact, {
            impact:'',
        }])
    }

    const removeInfraInputFields = index => {
        
        const rows = [...infraImpact];
        rows.splice(index, 1);
        setInfraImpact(rows);
   	}

   	const handleInfraChange = (index, evnt)=>{
    
    	setSubmitEnabled(true);
    	const { name, value } = evnt.target;
    	const list = [...infraImpact];
    	list[index][name] = value;
    	setInfraImpact(list);
	}

	const addSecurityInputField = () => {
        
        setSecurityImpact([...securityImpact, {
            impact:'',
        }])
    }

    const removeSecurityInputFields = index => {
        
        const rows = [...securityImpact];
        rows.splice(index, 1);
        setSecurityImpact(rows);
   	}

   	const handleSecurityChange = (index, evnt)=>{
    
    	setSubmitEnabled(true);
    	const { name, value } = evnt.target;
    	const list = [...securityImpact];
    	list[index][name] = value;
    	setSecurityImpact(list);
	}

	const addEHSInputField = () => {
        
        setEhsImpact([...ehsImpact, {
            impact:'',
        }])
    }

    const removeEHSInputFields = index => {
        
        const rows = [...ehsImpact];
        rows.splice(index, 1);
        setEhsImpact(rows);
   	}

   	const handleEHSChange = (index, evnt)=>{
    
    	setSubmitEnabled(true);
    	const { name, value } = evnt.target;
    	const list = [...ehsImpact];
    	list[index][name] = value;
    	setEhsImpact(list);
	}

	const downloadExcel = () => {
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('My Sheet');
		console.log(worksheet.id)
		let row = 6
		worksheet.mergeCells("A"+row+":B"+row);
		const customCell1 = worksheet.getCell("A"+row);
		customCell1.value = currentDataCenter.name

		worksheet.mergeCells("C"+row+":E"+row);
		const customCell2 = worksheet.getCell("C"+row);
		customCell2.value = "Total"

		worksheet.mergeCells("F"+row+":H"+row);
		const customCell3 = worksheet.getCell("F"+row);
		customCell3.value = "Installed/Sold"

		worksheet.mergeCells("I"+row+":K"+row);
		const customCell4 = worksheet.getCell("I"+row);
		customCell4.value = "Reserved"

		worksheet.mergeCells("L"+row+":N"+row);
		const customCell5 = worksheet.getCell("L"+row);
		customCell5.value = "Stranded/Hold"

		worksheet.mergeCells("O"+row+":Q"+row);
		const customCell6 = worksheet.getCell("O"+row);
		customCell6.value = "Available"

		worksheet.mergeCells("R"+row+":T"+row);
		const customCell7 = worksheet.getCell("R"+row);
		customCell7.value = "Delta"

		worksheet.addRow(['Floor', 'Data Hall', 'CabE', 'Cages', '(kW)', 'CabE', 'Cages', '(kW)', 'CabE', 'Cages', '(kW)','CabE', 'Cages', '(kW)','CabE', 'Cages', '(kW)','CabE', 'Cages', '(kW)' ]);
		worksheet.getRow(row).font = { bold: true };
		worksheet.getRow(row+1).font = { bold: true };
		capcityData.map(capacity => {

			let totalCabs = 0;
			let totalCages = 0;
			let totalpower = 0;

			if (capacity.monthly_utilization != null  ) {
				
				let utilCab = 0;
				let utilCage = 0;
				let utilPower = 0;
				let c_m = capacity.monthly_utilization;

				utilCab = Number(c_m?.sold_cabs || 0) + Number(c_m?.reserved_cabs || 0) + Number(c_m?.blocked_cabs || 0) + Number(c_m?.available_cabs || 0);

				utilCage = Number(c_m?.sold_cages || 0) + Number(c_m?.reserved_cages || 0) + Number(c_m?.blocked_cages || 0) + Number(c_m?.available_cages || 0);

				utilPower = Number(c_m?.sold_power || 0) + Number(c_m?.reserved_power || 0) + Number(c_m?.blocked_power || 0) + Number(c_m?.available_power || 0);



				if(isReadOnly){

					totalCabs = Number(c_m.total_cabs) - Number(utilCab);
					totalCages = Number(c_m.total_cages) - Number(utilCage);
					totalpower = Number(c_m.total_power) - Number(utilPower);
				}else{

					if(c_m.total_cabs == undefined){
						c_m.total_cabs = capacity.design_cabs;
					}
					totalCabs = Number(capacity.design_cabs) - Number(utilCab);
					totalCages = Number(capacity.design_cages) - Number(utilCage);
					totalpower = Number(capacity.design_power) - Number(utilPower);
				}

				
			}else{
				
				capacity.monthly_utilization = {
				  month: month?month:Number(authContext.getMonthYear.month) - 1,
				  year: authContext.getMonthYear.year,
				  data_hall_id: capacity.id,
				  data_center_id: currentDataCenter.id,
				  country_id: currentDataCenter.country_id,
			  }
			  totalCabs = isReadOnly?0:Number(capacity.design_cabs);
				totalCages = isReadOnly?0:Number(capacity.design_cages);
				totalpower = isReadOnly?0:Number(capacity.design_power);
			}

			let mu = capacity.monthly_utilization;

			worksheet.addRow([capacity.floor.name, capacity.name, extVal(mu.total_cabs,capacity.design_cabs), extVal(mu.total_cages,capacity.design_cages), extVal(mu.total_power,capacity.design_power), extractValue(mu.sold_cabs), extractValue(mu.sold_cages), extractValue(mu.sold_power), extractValue(mu.reserved_cabs), extractValue(mu.reserved_cages), extractValue(mu.reserved_power),extractValue(mu.blocked_cabs), extractValue(mu.blocked_cages), extractValue(mu.blocked_power),extractValue(mu.available_cabs), extractValue(mu.available_cages), extractValue(mu.available_power),numberFormat(totalCabs), numberFormat(totalCages), numberFormat(totalpower) ]);
		})
			const imageId2 = workbook.addImage({
			base64: myBase64Image,
			extension: 'png',
			});

			worksheet.addImage(imageId2, {
				tl: { col: 7, row: 0 },
				ext: { width: 300, height: 100 }
			  });
			workbook.xlsx.writeBuffer().then(function(buffer) {
				saveAs(
				  new Blob([buffer], { type: "application/octet-stream" }),
				  `${currentDataCenter.name}-${year}_${month}.xlsx`
				);
			  });
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

		                  				if(currentDataCenter && currentDataCenter.id === data.id){
		                  					return(
			                  					<li 
			                  					className={index === 0?'nav-item':'nav-item'}
			                  					key={index}>
			                  						<a 
			                  						onClick={() => 
														selectDataCenterFloor(data)}
			                  						style={{cursor:'pointer'}} 
			                  						className="nav-link active show"> 
			                  							<img 
			                  							className="down setting_down" 
			                  							alt="arrow"
			                  							src="\images\downward-arrow.png" />
			                  							{data.name}
			                  						</a> 
			                  					</li>
			                  				)
		                  				}else{

			                  				return(
			                  					<li 
			                  					className={index === 0?'nav-item':'nav-item'}
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
            <div className="col-12 col-sm-12 col-md-6 col-lg-9">
               	<div className="card-header" id="header">
                  	<div className="d-sm-flex d-block justify-content-between align-items-center">
                     	<div className="card-action coin-tabs mt-3 mt-sm-0">
                        	<ul className="nav nav-tabs" role="tablist">
                            	<li className="nav-item gap_s">
		                          	<a 
		                          	className="nav-link active" 
		                          	id="tab1" 
		                          	data-bs-toggle="tab" 
		                          	>Monthly Utilisation</a>
                           		</li>
	                           <li className="nav-item gap_s">
	                              	<a 
	                              	className="nav-link" 
	                              	id="tab2" 
	                              	data-bs-toggle="tab" 
	                              	> Thresholds</a>
	                           </li>
                        	</ul>
                     	</div>
                  	</div>
               </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3">
                <div className="left_box_month">
                	<div className="choose_date">
                
                		<select 
                		className="form-select w-3rem" 
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
                		className="form-select w-3rem" 
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
                  	<div className="excel_icon cap_icon">
                      	<img alt="excel" src="\images\excel.png" width="40px" onClick={downloadExcel}/> 
                  	</div>
               </div>
            </div>
            <div className="table_monthly mt-4" style={{overflowX:"auto"}}>
            	<div className="flex_table">
            	<table className="table table-borderless tb_dcp mb-4" style={{width:'350px',whiteSpace:'nowrap'}}>
                  <thead>
                     <tr>
                        <th colSpan="7" className="text-start" style={{
                        	fontWeight: "600 !important",
                        	fontSize: "1.2rem",
                        	border: "none"
                        }}>Data Center Performance</th>
                     </tr>
                     
                     <tr>
                        <td className="text-start" style={{fontWeight: 600}}>Service Availability:</td>
                        <td className="text-start">

                        	<input 
                        	type="text" 
                        	value={extractValue2(performanceState?.availability)}
                        	onChange={event =>{
                        	setSubmitEnabled(true);
                        	 setPerformanceState({...performanceState,availability:event.target.value})}}
                        	style={{
                        		width: "55px",
                        		color:"#58a1d6"
                        	}}/>
                        </td>
                        <td className="text-start"></td>
                        
                     </tr>
                     <tr>
                        <td className="text-start">Operating PUE</td>
                        <td className="text-start">
                        	<input 
                        	type="text" 
                        	value={extractValue2(performanceState?.opertating_pue)}
                        	onChange={event => {
                        		setSubmitEnabled(true);
                        		setPerformanceState({...performanceState,opertating_pue:event.target.value})}}
                        	style={{width: "55px"}} />
                        </td>
                        <td className="text-start"></td>
                       
                     </tr>
                     <tr>
                        <td className="text-start">Design PUE</td>
                        <td className="text-start">
                        	<input 
                        	type="text" 
                        	value={extractValue2(performanceState?.design_pue)}
                        	onChange={event => {
                        		setSubmitEnabled(true);
                        		setPerformanceState({...performanceState,design_pue:event.target.value})}}
                        	style={{width: "55px"}} />
                        </td>
                        
                     </tr>
                     <tr>
                        <td className="text-start">Installed IT Capacity (KVA)</td>
                        <td className="text-start">
                        	<input 
                        	type="text" 
                        	value={extractValue2(performanceState?.installed_kw)}
                        	onChange={event => {
                        		setSubmitEnabled(true);
                        		setPerformanceState({...performanceState,installed_kw:event.target.value})}}
                        	style={{width: "55px"}} />
                        </td>
                        
                     </tr>
                     <tr>
                        <td className="text-start">Operating IT Consumption</td>
                        <td className="text-start">
                        	<input 
                        	type="text" 
                        	value={extractValue2(performanceState?.operating_kw)}
                        	onChange={event => {
                        		setSubmitEnabled(true);
                        		setPerformanceState({...performanceState,operating_kw:event.target.value})}}
                        	style={{width: "55px"}} />
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
               <table className="table table-borderless tb_dcp mb-4" style={{
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
	                        	value={extractValue2(performanceState?.infra_incident_num)}
                        		onChange={event => {
                        			setSubmitEnabled(true);
                        			setPerformanceState({...performanceState,infra_incident_num:event.target.value})}}
	                        	style={{width:'55px'}} />
	                        </td>
	                         <td className="text-start">
	                        	<input 
	                        	type="text" 
	                        	value={extractValue2(performanceState?.security_incident_num)}
                        		onChange={event => {
                        			setSubmitEnabled(true);
                        			setPerformanceState({...performanceState,security_incident_num:event.target.value})}}
	                        	style={{width:'55px'}} />
	                        </td>
	                        <td className="text-start">
	                        	<input 
	                        	type="text" 
	                        	value={extractValue2(performanceState?.ehs_incident_num)}
                        		onChange={event => {
                        			setSubmitEnabled(true);
                        			setPerformanceState({...performanceState,ehs_incident_num:event.target.value})}}
	                        	style={{width:'55px'}} />
	                        </td>
                     	</tr>
                     	<tr>
                     		
                        	<td className="text-start">Types</td>
                        	<td className="text-start">
	                        	<input 
	                        	type="text" 
	                        	value={extractValue2(performanceState?.infra_incident_type)}
                        		onChange={event => {
                        			setSubmitEnabled(true);
                        			setPerformanceState({...performanceState,infra_incident_type:event.target.value})}}
	                        	style={{width:'55px'}} />
	                        </td>
	                         <td className="text-start">
	                        	<input 
	                        	type="text" 
	                        	value={extractValue2(performanceState?.security_incident_type)}
                        		onChange={event => {
                        			setSubmitEnabled(true);
                        			setPerformanceState({...performanceState,security_incident_type:event.target.value})}}
	                        	style={{width:'55px'}} />
	                        </td>
	                        <td className="text-start">
	                        	<input 
	                        	type="text" 
	                        	value={extractValue2(performanceState?.ehs_incident_type)}
                        		onChange={event => {
                        			setSubmitEnabled(true);
                        			setPerformanceState({...performanceState,ehs_incident_type:event.target.value})}}
	                        	style={{width:'55px'}} />
	                        </td>
                     
                     	</tr>
                     	<tr>
	                       <td className="text-start" valign="top">Who's Impacted</td>
	                       <td className="text-start" valign="top">

                        	{infraImpact && infraImpact.map((imp,index) => {

                        		if (index === 0) {

	                        		return(

			                        	<div key={index}>
			                        		<input 
			                        		type="text" 
			                        		name="impact"
			                        		onChange={(evnt) => handleInfraChange(index, evnt)} 
			                        		value={extractValue2(imp?.impact)}
			                        		style={{width:"55px"}} />
				                        	<span 
				                        	onClick={addInfraInputField}
				                        	style={{
				                        		marginLeft: "5px", 
				                        		cursor: "pointer", 
				                        		background: "green", 
				                        		color:"#fff", 
				                        		padding: "2px 5px", 
				                        		fontSize: "12px"
				                        	}}>
				                        
				                        	<i 
				                        	className="fa fa-plus" 
				                        	aria-hidden="true" 
				                        	
				                        	style={{
				                        		color:"#fff",
				                        		fontSize: "12px",
				                        		padding: "2px 5px"
				                        	}}></i>
				                        	</span>
			                        	</div>
	                        		);
                        		}else{
                        			return(

			                        	<div style={{marginTop:"5px"}} key={index}>
			                        		<input 
			                        		type="text"
			                        		name="impact" 
			                        		value={extractValue2(imp?.impact)}
			                        		onChange={(evnt) => handleInfraChange(index, evnt)}
			                        		style={{width:"55px"}} />
				                        	<span 
				                        	onClick={() =>removeInfraInputFields(index)}
				                        	style={{
				                        		marginLeft: "5px", 
				                        		cursor: "pointer", 
				                        		background: "red", 
				                        		color:"#fff", 
				                        		padding: "2px 5px", 
				                        		fontSize: "12px"
				                        	}}>
				                        
				                        	<i 
				                        	className="fa fa-times" 
				                        	aria-hidden="true" 
				                        	
				                        	style={{
				                        		color:"#fff",
				                        		fontSize: "12px",
				                        		padding: "2px 5px"
				                        	}}></i>
				                        	</span>
			                        	</div>
	                        		);
                        		}
                        	})}
                        	
                        </td>
	                        <td className="text-start" valign="top">
                        	{securityImpact && securityImpact.map((imp,index) => {

                        		if (index === 0) {

	                        		return(

			                        	<div key={index}>
			                        		<input 
			                        		type="text" 
			                        		name="impact"
			                        		onChange={(evnt)=> handleSecurityChange(index, evnt)} 
			                        		value={extractValue2(imp?.impact)}
			                        		style={{width:"55px"}} />
				                        	<span 
				                        	onClick={addSecurityInputField}
				                        	style={{
				                        		marginLeft: "5px", 
				                        		cursor: "pointer", 
				                        		background: "green", 
				                        		color:"#fff", 
				                        		padding: "2px 5px", 
				                        		fontSize: "12px"
				                        	}}>
				                        	<i 
				                        	className="fa fa-plus" 
				                        	aria-hidden="true" 
				                        	
				                        	style={{
				                        		color:"#fff",
				                        		fontSize: "12px",
				                        		padding: "2px 5px"
				                        	}}></i>
				                        	</span>
			                        	</div>
	                        		);
                        		}else{
                        			return(

			                        	<div style={{marginTop:"5px"}} key={index}>
			                        		<input 
			                        		type="text" 
			                        		name="impact"
			                        		value={extractValue2(imp?.impact)}
			                        		onChange={(evnt)=> handleSecurityChange(index, evnt)} 
			                        		style={{width:"55px"}} />
				                        	<span 
				                        	onClick={() => removeSecurityInputFields(index)}
				                        	style={{
				                        		marginLeft: "5px", 
				                        		cursor: "pointer", 
				                        		background: "red", 
				                        		color:"#fff", 
				                        		padding: "2px 5px", 
				                        		fontSize: "12px"
				                        	}}>
				                        	<i 
				                        	className="fa fa-times" 
				                        	aria-hidden="true" 
				                        	
				                        	style={{
				                        		color:"#fff",
				                        		fontSize: "12px",
				                        		padding: "2px 5px"
				                        	}}></i>
				                        	</span>
			                        	</div>
	                        		);
                        		}
                        	})}
                       		</td>
	                       	<td className="text-start" valign="top">
                        	{ehsImpact && ehsImpact.map((imp,index) => {

                        		if (index === 0) {

	                        		return(

			                        	<div key={index}>
			                        		<input 
			                        		type="text" 
			                        		name="impact"
			                        		onChange={(evnt)=> handleEHSChange(index, evnt)} 
			                        		value={extractValue2(imp.impact)}
			                        		style={{width:"55px"}} />
				                        	<span
				                        	onClick={addEHSInputField}
				                        	style={{
				                        		marginLeft: "5px", 
				                        		cursor: "pointer", 
				                        		background: "green", 
				                        		color:"#fff", 
				                        		padding: "2px 5px", 
				                        		fontSize: "12px",
				                        	}}>
				                        	<i 
				                        	className="fa fa-plus" 
				                        	aria-hidden="true" 
				                        	style={{
				                        		color:"#fff",
				                        		fontSize: "12px",
				                        		padding: "2px 5px"
				                        	}}></i>
				                        	</span>
			                        	</div>
	                        		);
                        		}else{
                        			return(

			                        	<div style={{marginTop:"5px"}} key={index}>
			                        		<input 
			                        		type="text" 
			                        		name="impact"
			                        		value={extractValue2(imp.impact)}
			                        		onChange={(evnt)=> handleEHSChange(index, evnt)} 
			                        		style={{width:"55px"}} />
				                        	<span
				                        	onClick={() => removeEHSInputFields(index)}
				                        	style={{
				                        		marginLeft: "5px", 
				                        		cursor: "pointer", 
				                        		background: "red", 
				                        		color:"#fff", 
				                        		padding: "2px 5px", 
				                        		fontSize: "12px"
				                        	}}>
				                        	<i 
				                        	className="fa fa-times" 
				                        	aria-hidden="true" 
				                        	
				                        	style={{
				                        		color:"#fff",
				                        		fontSize: "12px",
				                        		padding: "2px 5px"
				                        	}}></i>
				                        	</span>
			                        	</div>
	                        		);
                        		}
                        	})}
                       		</td>
                     	</tr>
                     	
                    </thead>
               </table>
            	
               </div>
              
               	<table className="table border border-light table-borderless">
               	<thead>
               		<tr>
               		<th 
               		scope="col" 
               		colSpan="2" 
               		style={{textAlign:"left",paddingLeft:"17px !important"}}>
               			{currentDataCenter.name}
               		</th>
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
      		<th scope="col" > Floor 
			
			</th>
      		<th scope="col" > Data Hall 
			
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
 

  			if (capacity.monthly_utilization != null  ) {
  				
  				let utilCab = 0;
  				let utilCage = 0;
  				let utilPower = 0;
  				let c_m = capacity.monthly_utilization;

  				utilCab = Number(c_m?.sold_cabs || 0) + Number(c_m?.reserved_cabs || 0) + Number(c_m?.blocked_cabs || 0) + Number(c_m?.available_cabs || 0);

  				utilCage = Number(c_m?.sold_cages || 0) + Number(c_m?.reserved_cages || 0) + Number(c_m?.blocked_cages || 0) + Number(c_m?.available_cages || 0);

  				utilPower = Number(c_m?.sold_power || 0) + Number(c_m?.reserved_power || 0) + Number(c_m?.blocked_power || 0) + Number(c_m?.available_power || 0);



  				if(isReadOnly){

  					totalCabs = Number(c_m.total_cabs) - Number(utilCab);
  					totalCages = Number(c_m.total_cages) - Number(utilCage);
  					totalpower = Number(c_m.total_power) - Number(utilPower);
  				}else{

  					if(c_m.total_cabs === undefined){
  						c_m.total_cabs = capacity.design_cabs;
  					}
  					totalCabs = Number(capacity.design_cabs) - Number(utilCab);
  					totalCages = Number(capacity.design_cages) - Number(utilCage);
  					totalpower = Number(capacity.design_power) - Number(utilPower);
  				}

	  			
  			}else{
  				
  				capacity.monthly_utilization = {
					month: month?month:Number(authContext.getMonthYear.month) - 1,
					year: authContext.getMonthYear.year,
					data_hall_id: capacity.id,
					data_center_id: currentDataCenter.id,
					country_id: currentDataCenter.country_id,
				}
				totalCabs = isReadOnly?0:Number(capacity.design_cabs);
  				totalCages = isReadOnly?0:Number(capacity.design_cages);
  				totalpower = isReadOnly?0:Number(capacity.design_power);
  			}

  			let mu = capacity.monthly_utilization;
  			return(
		    	<tr key={capacity.id}>
			      	<td>{capacity.floor.name} </td>
			      	<td>{capacity.name}</td>
			      	<td className="bg_gray">
			      
			      		<input type="text"
			      			value={ extVal(mu.total_cabs,capacity.design_cabs)}
			      			onChange={(event) => {
			      				capacity.design_cabs = event.target.value;
			      				onChangeData(event,capacity,'total_cabs')
			      			}}
			      		/>
			     
			      	</td>
			      	<td className="bg_gray">
			      	
			      		<input type="text"
			      			value={ extVal(mu.total_cages,capacity.design_cages)}
			      			onChange={(event) => {
			      				capacity.design_cages = event.target.value;
			      				onChangeData(event,capacity,'total_cages')
			      			}}
			      		/>
			      		
			      	</td>
			      	<td className="bg_gray">
			      		
			      		<input type="text"
			      			value={ extVal(mu.total_power,capacity.design_power)}
			      			onChange={(event) => {
			      				capacity.design_power = event.target.value;
			      				onChangeData(event,capacity,'total_power')
			      			}}
			      		/>
			      	
			      	</td>
			      	<td className="tbr">

			      		<input type="text"
			      			value={extractValue(mu.sold_cabs)}
			      			onChange={(event) =>  {

			      				onChangeData(event,capacity,'sold_cabs')
			      			}}
			      		/>

			      		
			      		
			      	</td>
			      	<td className="tbr">
			      		
			      		<input type="text"
			      		
			      			value={extractValue(mu.sold_cages)}
			      			onChange={(event) => onChangeData(event,capacity,'sold_cages')}
			      		/>
			      		
			      	</td>
			      	<td className="tbr">

			      		<input type="text"
			      		 
			      			value={extractValue(mu.sold_power)}
			      			onChange={(event) => onChangeData(event,capacity,'sold_power')}
			      		/>
			      		
			      	</td>
			      	<td className="tbr">
			      		
			      
			      		<input type="text"
			      		 
			      			value={extractValue(mu.reserved_cabs)}
			      			onChange={(event) => onChangeData(event,capacity,'reserved_cabs')}
			      		/>
			      	
			      	</td>
			      	<td className="tbr">
			      	
			      		<input type="text"
			      		 
			      			value={extractValue(mu.reserved_cages)}
			      			onChange={(event) => onChangeData(event,capacity,'reserved_cages')}
			      		/>
			      	
			      	</td>
			      	<td className="tbr">
			      		
			      	
			      		<input type="text"
			      		 
			      			value={extractValue(mu.reserved_power)}
			      			onChange={(event) => onChangeData(event,capacity,'reserved_power')}
			      		/>
			      		
			      	</td>
			      	<td className="tbr">
			      		
			      
			      		<input type="text"
			      		 
			      			value={extractValue(mu.blocked_cabs)}
			      			onChange={(event) => onChangeData(event,capacity,'blocked_cabs')}
			      		/>
			      		
			      	</td>
			      	<td className="tbr">
			      		
			      
			      		<input type="text"
			      		 
			      			value={extractValue(mu.blocked_cages)}
			      			onChange={(event) => onChangeData(event,capacity,'blocked_cages')}
			      		/>
			      		
			      	</td>
			      	<td className="tbr">
			      		
			      
			      		<input type="text"
			      		 
			      			value={extractValue(mu.blocked_power)}
			      			onChange={(event) => onChangeData(event,capacity,'blocked_power')}
			      		/>
			      		
			      	</td>
			      	<td className="tbr">
			      		
			      
			      		<input type="text"
			      		 
			      			value={extractValue(mu.available_cabs)}
			      			onChange={(event) => onChangeData(event,capacity,'available_cabs')}
			      		/>

			      	</td>
			      	<td className="tbr">
			      		
			      	
			      		<input type="text"
			      		 
			      			value={extractValue(mu.available_cages)}
			      			onChange={(event) => onChangeData(event,capacity,'available_cages')}
			      		/>
			      		
			      	</td>
			      	<td className="tbr">
			      
			      	<input type="text"
			      	 
			      			value={extractValue(mu.available_power)}
			      			onChange={(event) => onChangeData(event,capacity,'available_power')}
			      		/>
			      	
			      	</td>
			      	<td className="tbr" style={{backgroundColor: Number(totalCabs)< 0?'red':'white'}}>{numberFormat(totalCabs)}</td>
			      	<td className="tbr" style={{backgroundColor: Number(totalCages)< 0?'red':'white'}}>{numberFormat(totalCages)}</td>
			      	<td className="tbr" style={{backgroundColor: Number(totalpower)< 0?'red':'white'}}>{numberFormat(totalpower,3)}</td>
		    	</tr>
  			)
  		})}
  </tbody>
</table>
            </div> 
         
            <div className="monthly_last_btn">
               <div className="toolbar toolbar-bottom d-flex" role="toolbar">   
                   <button 
                   type="button" 
                   onClick={() => getCapacity(currentDataCenter)}
                   className="btn btn-outline-primary mr_1"> Cancel </button>
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
