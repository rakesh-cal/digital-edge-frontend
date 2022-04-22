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

		// worksheet.columns = [
		// 	{ header: 'Id', key: 'id', width: 10 },
		// 	{ header: 'Name', key: 'name', width: 32 },
		// 	{ header: 'D.O.B.', key: 'DOB', width: 10, outlineLevel: 1 }
		//   ];
		  
		//   worksheet.addRow({id: 1, name: 'John Doe', DOB: new Date(1970,1,1)});
		// 	worksheet.addRow({id: 2, name: 'Jane Doe', DOB: new Date(1965,1,7)});
			// add image to workbook by buffer
			// const imageId2 = workbook.addImage({
			// 	buffer: fs.readFileSync('path/to.image.png'),
			// 	extension: 'png',
			// });

			const myBase64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABxsAAAR6CAYAAACTCBk6AAAACXBIWXMAAC4jAAAuIwF4pT92AAAgAElEQVR4nOzd23Id1bkv8NGakwtAskVVco14gognQM7K3pdB5mAOBiwle1USuLD9BLKfQHCRw1qVIJtDAmTVtsn1XkviCWyewMp1qPKUZPBFPPGuMT1EBD7JU5o9Rnf/flVdwilbs3t0zyFl/Of3jQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABA5wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwOwBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAt31OkAAALoSURBVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwOwBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMB4ppf8CtN8/lkzYtSgAAAAASUVORK5CYII=";
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
