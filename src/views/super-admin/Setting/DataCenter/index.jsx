import React,{useEffect,useState,useContext,useRef} from 'react';
import Layout from "../../Layouts";
import Navigation from "../Component/Navigation";
import DataCenterNav from "./Navigation";
import RoleModel from "services/roleServices";
import CabinetServices from "services/CabinetService"
import DataCenterChart from "services/dataCenterChart";
import Floors from "services/floorServices"
import AuthContext from "context";
import Floor from "./floor"
import EditFloor from './editFloor';
import CreateDataHall from './dataHall'
import EditDataHall from './editDataHall' 
import EditCabinet from './editCabinet'
import CreateDataCenter from './dataCenter'
import './dataCenter.css';
import {numberFormat} from 'common/helpers';
import {Link} from 'react-router-dom';
import Swal from 'sweetalert2'
import Common from "services/commonService";

const DataCenter = (props) => {
	const authContext = useContext(AuthContext);
	const [state,setState] = useState([]);
	const [dataCenter, setDataCenter] = useState([])
	const [currentDataCenter, setCurrentDataCenter] = useState([])
	const [allFloorData, setAllFloorData] = useState([])
	const [dataHall, setDataHall] = useState([])
	const [selectedDataHall, setSelectedDataHall] = useState({})
	const [cabinets, setCabinets] = useState([])
	const [floorIndex, setFloorIndex] = useState(0)
	const [dataCenterId, setDataCenterId] = useState()
	const [editFloorData, setEditFloorData] = useState()
	const [showFloorEdit, setShowFloorEdit] = useState(false)
	const [editDataHall, setEditDataHall] = useState()
	const [showDataHallEdit, setShowDataHallEdit] = useState(false)
	const [editCabinets, setEditCabinets] = useState()
	const [showCabinetsEdit, setShowCabinetsEdit] = useState(false)
	const [countryName, setCountryName] = useState("Country");
	const [currentTab,setCurrentTab] = useState(0);
	const [activeTab,setActiveTab] = useState();
	const [country, setCountry] = useState(0)
	const initialMount = useRef(true);
	const [ascending,setAscending] = useState(true);
	const [dataHallAscending,setDataHallAscending] = useState(true);
	const [cabinetAscending,setCabinetAscending] = useState(true);
	const [isReadOnly,setIsReadOnly] = useState(true);
	const [statusData,setStatusData] = useState([]);

	useEffect(() => {
		Common.status().then(res => setStatusData(res.data.data));
		getData();

		if(authContext?.getAuth?.role?.space === 3 || 
			authContext?.getAuth?.role?.m_e === 3 || 
			authContext?.getAuth?.role?.network === 3){
				setIsReadOnly(false);
			}

		if(initialMount.current === false){
			selectDataCenterFloor(currentDataCenter, floorIndex);
			
		}
		getAllDataCenter();
		
	},[authContext.getFloor,authContext.getDataCenters]);

	const getData = async () => {

		if(authContext.getCountries.length === 0){

			await RoleModel.countryService(authContext.token()).then(res => {
				authContext.setCountry(res.data.data);
				
			});
		}
		
		
	}

	const getFloorData = data => {
		setDataHallAscending(true);
        const sortedData = data.data_halls.sort((a,b)=> (a.name < b.name ? 1 : -1))
        setDataHall(sortedData)
		if(sortedData.length > 0){	
			getCabinetsData(sortedData[0])	
		}else{	
			setCabinets([])	
		}
        setActiveTab(data.id)
		setFloorIndex(data.id)
    }

	const getStatus = id => {	
		let statusDataMod = statusData.filter((data) => {	
			return data.id == id	
		})	
		//console.log(statusDataMod)	
		return statusDataMod[0].name	
	}

	const getAllDataCenter = async () => {
		setCountryName("Country");
		if(authContext.getDataCenters.length === 0){

			await RoleModel.dataCenter(authContext.token()).then(res => {
				authContext.setDataCenter(res.data.data);
				setDataCenter(res.data.data);
				if(res.data.data.length > 0){
					if(initialMount.current){
						setActiveTab(res.data.data[0].id)
						selectDataCenterFloor(res.data.data[0])
						setCountry(res.data.data[0].country_id)
						initialMount.current = false
					}
					
					
				}
			});
		}else{
			
			if(initialMount.current){
				setActiveTab(authContext.getDataCenters[0].id)
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
						setActiveTab(res.data.data[0].id)
						selectDataCenterFloor(res.data.data[0])
					}
			})
		}else{

			const data = authContext.getDataCenters.filter(data => data.country_id === e.id);
			setDataCenter(data)
			if(data.length > 0){
				setActiveTab(data[0].id)
				selectDataCenterFloor(data[0])
			}	
		}
	}

	const getCabinetsData = async(e) => {	
		setCabinetAscending(true)	
			
		setSelectedDataHall(e)	
		await CabinetServices.selectByHallId(authContext.token(), {data_hall_id: e.id}).then(res => {	
				//console.log(res.data.data)	
			//	if(res.data.data.length > 0){	
				setCabinets(res.data.data.sort((a,b)=> (a.name < b.name ? 1 : -1)))	
			//	}	
		})	
	}
	
	const selectDataCenterFloor = async(e, floor_id = 0) => {
		//console.log("called data center",e,floor_id)
		setAscending(true);
		setCurrentDataCenter(e)
		setDataCenterId(e)

		if(authContext.getFloor.length === 0){

			await Floors.floorByDataCenterId(authContext.token(), e).then(res => {
			
				if(res.data.data.length > 0){
					authContext.setFloor(res.data.data);

					setAllFloorData(res.data.data);
				 	setDataHall(res.data.data[floor_id].data_halls)
					 if(res.data.data[floor_id].data_halls.length > 0){
						getCabinetsData(res.data.data[floor_id].data_halls[0])
					 }
					 
					setFloorIndex(floor_id)
					setActiveTab(floor_id)
				}
			});

		}else{
			const data = authContext.getFloor.filter(data => data.data_center_id === e.id);
			if(floor_id != 0){
				const dataObj = data.filter(data => data.id === floor_id)
				//console.log(data,floor_id,dataObj)
				setAllFloorData(data);
				setDataHall(dataObj[0].data_halls);
				if(dataObj[0].data_halls.length > 0){
					getCabinetsData(dataObj[0].data_halls[0])
				}
				setFloorIndex(dataObj[0].id)
				setActiveTab(dataObj[0].id)
			}else{
				setAllFloorData(authContext.getFloor.filter(data => data.data_center_id === e.id));
				setDataHall(data[floor_id].data_halls);
				if(data[floor_id].data_halls.length > 0){
					getCabinetsData(data[floor_id].data_halls[0])
				}
				setFloorIndex(data[floor_id].id)
				setActiveTab(data[floor_id].id)
			}
			
		}
	}

	const renderCountry = () => {

		return authContext.getCountries.length && authContext.getCountries.map((data,i) => {
			
			return <a className="dropdown-item" 
			key={i}
			onClick={() =>{
				setCurrentTab(0)
				setCountry(data.id)
				getDataCenterById(data)
			} }>{data.name} </a>
		})
	}

	const renderDataCenter = () => {

		return dataCenter && dataCenter.map((data, i) => {
			
			return (
				<li 
				className="nav-item" 
				key={i} 
				onClick={() => {
					setCurrentTab(data.id)
					selectDataCenterFloor(data)
				}}>
					<a 
					href="#" 
					className={`nav-link ${currentTab == 0 && i == 0 ?"active show":""}`}
					>
						
						{data.name}
					</a>
				</li>
			)
		})
	}

	const getEditFloorPopup = (res) => {
		
		setEditFloorData(res)
		setShowFloorEdit(true)
		
	}

	const getEditDataHallPopup = (res) => {
		
		setEditDataHall(res)
		setShowDataHallEdit(true)
	}

	const getEditCabinetPopup = (res) => {	
		setEditCabinets(res)	
		setShowCabinetsEdit(true)	
	}

	const deleteDataCenter = () => {

			Swal.fire({
		  	title: 'Are you sure?',
		  	text: "You won't be able to revert this!",
		  	icon: 'warning',
		  	showCancelButton: true,
		  	cancelButtonColor: '#d33',
		  	confirmButtonText: 'Yes, delete it!'
		}).then(async (result) => {
			if (result.isConfirmed) {
				await DataCenterChart.destroy(authContext.token(),{data_center_id:currentDataCenter.id}).then(async res => {
					await Floors.findAllFloor(authContext.token()).then(res => {
						Swal.fire("Data center has been deleted!")
						authContext.setFloor(res.data.data);
						authContext.setDataCenterFloor(res.data.data);
					}).catch(err => {
						/*500 internal server error*/
					})
				});
				
				const newDataCenter = authContext.getDataCenters.filter(center => center.id !== currentDataCenter.id);

				authContext.setDataCenter(newDataCenter);
				setCurrentDataCenter(newDataCenter[0]);
				setActiveTab(newDataCenter[0].id)
				selectDataCenterFloor(newDataCenter[0])
				setCountry(newDataCenter[0].country_id)
			}
			
		})
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
                                 {/* {renderDataCenter()}  */}
                              		</ul>
                                 </div>
                              </div>
                           </div>
                        </div>
							<div id="title" style={{marginBottom: "-2.687rem"}}>
								<div className="row"><h5 className="card-title col-md-6"> Inventory for {currentDataCenter.name} </h5><p className="col-md-6" style={{textAlign:"right"}}>
								{isReadOnly == false?(
								<a href="#" id="addnewdatacenter" data-bs-toggle="modal" data-bs-target=".bd-example-modal-lg2">
		<img src="\images\plus-circle-blue.svg"  style={{width:'1.25rem'}} /> &nbsp;Add Data Center</a>
								):null}

		 </p></div>
								<p> Each data center can set capacity thresholds at the data center, floor or data hall level. </p>
							</div>

							<div className="row">
				
	<div className="col-xl-4 col-lg-4">
		<div className="inv">
		<div className="invtab">
		<p>Floor</p>

		{isReadOnly == false?(
		<p><a href="#" id="addneww" data-bs-toggle="modal" data-bs-target=".bd-example-modal-lg">
		<img src="\images\plus-circle-blue.svg"  style={{width:'1.25rem'}} /> &nbsp;Add Floor</a> </p>
		):null}

	
		</div>
		<table>
		<thead>
			<tr>
			<th onClick={() => {
				setAscending(!ascending);
				if(ascending === true){

					allFloorData.sort((a,b)=> (a.name > b.name ? 1 : -1))
				}
				if (ascending === false) {
					allFloorData.sort((a,b)=> (a.name < b.name ? 1 : -1))
				}

			}} style={{cursor:"pointer"}}> Floor <i 
			className={`fa fa-solid fa-sort-${ascending?'down':'up'}`}

			></i></th>
			<th> Cabs </th>
			<th> kW </th>
			{isReadOnly == false ? (
			<th> </th>
			):null}
			</tr>
		</thead>
		<tbody>
			
			{allFloorData && allFloorData.map((res,id) => {
				
			    return <tr 
			    key={id}
			    className={activeTab === res.id?"tr_active":""}
			    onClick={() => getFloorData(res)} style={{cursor:"pointer"}} >
			    <td> {res.name}
			    <i className="fa fa-circle" 
			    style={{color:res.status === 1?"#3FEB7B":"#E0E2E5", marginLeft: "5px"}}
			    aria-hidden="true"></i> 
			    </td>
			    <td> {numberFormat(res.data_halls.reduce((previous,current) => previous += Number(current.design_cabs),0))} </td>
			     <td> {numberFormat(res.data_halls.reduce((previous,current) => previous += Number(current.design_power),0),3)} </td>
			     {isReadOnly == false?(
				    <td> 
				    <a 
				    onClick={() => getEditFloorPopup(res)} 
				    style={{cursor:"pointer"}}>
				    <i className="fas fa-edit"></i>
				    </a> 
				    </td>
			     	):null}
			    </tr>
			})}
		</tbody>


		</table>
		</div> 
		<button 
	        type="button" 
	        onClick={() => deleteDataCenter()}
	        style={{marginRight:'1rem'}}
	        className="btn btn-outline-primary red_color mr_1">
	        	<img src="\images\trash-2.svg" 
	        	style={{width: "11px", marginTop: "-0.188rem",marginRight:"0.5rem"}} /> 
	        	Delete
	    </button>
	</div> 

	<div className="col-xl-8 col-lg-8">	

			<div className="leftnav">
			<p> Data Halls </p>
			{isReadOnly == false?(
			<p>
			<a 
			href="#" 
			id="addneww" 
			data-bs-toggle="modal" 
			data-bs-target="#exampleModalCenter">
			<img src="\images\plus-circle-blue.svg"  style={{width:'1.25rem'}} /> &nbsp;Add Data Halls </a> </p>
			):null}

			

			</div>

	<div className="card-body data-hall-block">
	    <div className="table-responsive">
	        <table className="table header-border verticle-middle">
	            <thead>
	                <tr>
	                    <th scope="col" className="pd-l" width="25%"
	                    	onClick={() => {
	                    		setDataHallAscending(!dataHallAscending);
								if(dataHallAscending === true){

									dataHall.sort((a,b)=> (a.name > b.name ? 1 : -1))
								}
								if (dataHallAscending === false) {
									dataHall.sort((a,b)=> (a.name < b.name ? 1 : -1))
								}
	                    	}}
	                    	style={{cursor:"pointer"}}
	                    > 
	                    Name {" "}
	                    <i className={`fa fa-solid fa-sort-${dataHallAscending?'down':'up'}`}></i>
	                    </th>
	                    <th scope="col" > Status </th>
	                    <th scope="col" > Cabs </th>
	                    <th scope="col" > kW </th>
	                    {isReadOnly?(
	                    <th scope="col" >  </th>
	                    ):null}
	                </tr>
	            </thead>
	            <tbody id="cardnew">
	            {
	                dataHall && dataHall.length > 0 && dataHall.map((res)=>{
	                	if(res.deletedAt != null){
	                		return null;
	                	}
	                    return <tr key={res.id} className={selectedDataHall.id === res.id?"tr_active":""}>	
	                        <th className="pd-l bold-txt" onClick={() => getCabinetsData(res)} style={{cursor:"pointer"}}> 	
	                        {res.name} 	
	                        </th>
	                        <td>
	                            <div 
	                            style={{
	                            	height:'6px',
	                            	width:"5em",
	                            	overflow:'hidden',
	                            	backgroundColor:res.status === 1?"#3FEB7B":"#E0E2E5"
	                            }}>
	                                <div className="progress-bar bg-success" role="progressbar"> 
	                                </div>
	                            </div>
	                        </td>
	                         <td> {numberFormat(res.design_cabs)} </td>
			    			<td> {numberFormat(res.design_power,3)} </td>
	                      {isReadOnly == false?(
	                        <td> <a onClick={() => getEditDataHallPopup(res)}> <i className="fas fa-edit"></i></a> </td>
	                      ):null}
	                    </tr>
	                })
	            }
	            </tbody>
	        </table>
	    </div>
	</div>	



	</div>
	<div className="col-xl-4 col-lg-4"></div>

	<div className="col-xl-8 col-lg-8">	
			<h5 className="card-title">{selectedDataHall?.name || ""}</h5>
			<div className="leftnav mt-0">
			<p> Cabinets </p>
			{isReadOnly == false?(
			<p style={{display:'none'}}>
			<a 
			href="#" 
			id="addneww" 
			data-bs-toggle="modal" 
			data-bs-target="#exampleModalCenter">
			<img src="\images\plus-circle-blue.svg"  style={{width:'1.25rem'}} /> &nbsp;Add Data Halls </a> </p>
			):null}

			

			</div>

	<div className="card-body data-hall-block">
	    <div className="table-responsive" style={{'overflowX': 'auto', 'width': '100%', height: '400px', 'marginBottom': '1.5rem'}}>
	        <table className="table header-border verticle-middle" style={{'whiteSpace': 'nowrap'}}>
	            <thead>
	                <tr >
	                    <th scope="col" className="pd-l" width="25%"
	                    	onClick={() => {
	                    		setCabinetAscending(!cabinetAscending);
								if(cabinetAscending === true){

									cabinets.sort((a,b)=> (a.name > b.name ? 1 : -1))
								}
								if (cabinetAscending === false) {
									cabinets.sort((a,b)=> (a.name < b.name ? 1 : -1))
								}
	                    	}}
	                    	style={{cursor:"pointer"}}
	                    > 
	                    Name {" "}
	                    <i className={`fa fa-solid fa-sort-${cabinetAscending?'down':'up'}`}></i>
	                    </th>
	                    <th scope="col" className="pd-l" onClick={() => {
	                    		setCabinetAscending(!cabinetAscending);
								if(cabinetAscending === true){

									cabinets.sort((a,b)=> (a.customer > b.customer ? 1 : -1))
								}
								if (cabinetAscending === false) {
									cabinets.sort((a,b)=> (a.customer < b.customer ? 1 : -1))
								}
	                    	}}> Customer {" "} <i className={`fa fa-solid fa-sort-${cabinetAscending?'down':'up'}`}></i></th>
	                    <th scope="col" className="pd-l" onClick={() => {
	                    		setCabinetAscending(!cabinetAscending);
								if(cabinetAscending === true){

									cabinets.sort((a,b)=> (a.status > b.status ? 1 : -1))
								}
								if (cabinetAscending === false) {
									cabinets.sort((a,b)=> (a.status < b.status ? 1 : -1))
								}
	                    	}} > Status {" "} <i className={`fa fa-solid fa-sort-${cabinetAscending?'down':'up'}`}></i></th>
	                    <th scope="col" > Max kWs </th>
						<th scope="col" > Sold kWs </th>
						<th scope="col" > # Breakers </th>
						<th scope="col" > # X-Connects </th>
	                    {/* {isReadOnly?(
	                    <th scope="col" >  </th>
	                    ):null} */}
	                </tr>
	            </thead>
	            <tbody id="cardnew">
	            {
	                cabinets && cabinets.length > 0 && cabinets.map((res)=>{
	                	if(res.deletedAt != null){
	                		return null;
	                	}
	                    return <tr key={res.id}>
	                        <th className="pd-l bold-txt"> 
	                        {res.name} 


	                        </th>
							<th className="pd-l bold-txt" style={{cursor:"pointer"}}> 
	                        {res.customer}
	                        </th>
	                        <td>
								{getStatus(res.status)}
	                        </td>
	                         <td> {numberFormat(res.max_kw,3)} </td>
			    			<td> {numberFormat(res.sold_kw,3)} </td>
							<td> {res.num_breakers} </td>
							<td> {res.num_xconnects} </td>
	                      {/* {isReadOnly == false?(
	                        <td> <a onClick={() => getEditCabinetPopup(res)}> <i className="fas fa-edit"></i></a> </td>
	                      ):null} */}
	                    </tr>
	                })
	            }
	            </tbody>
	        </table>
	    </div>
	</div>	



	</div>
</div>

							{/* {currentDataCenter && <Floor allFloorData={allFloorData} dataCenterId={dataCenterId} selectDataCenterFloor={selectDataCenterFloor}/>} */}
							</div>
						</div>
					</div>
				
			</div>
			</div>
				<Floor data_center_id={currentDataCenter} show={true} selectDataCenterFloor={selectDataCenterFloor}/>
				{showFloorEdit && <EditFloor floor_data={editFloorData} show={showFloorEdit} setShow={setShowFloorEdit} data_center_id={currentDataCenter} selectDataCenterFloor={selectDataCenterFloor}/>}
				<CreateDataHall show={true} data_center_id={currentDataCenter} selectDataCenterFloor={selectDataCenterFloor} floorIndex={floorIndex} setFloorIndex={setFloorIndex}/>

				{showDataHallEdit && <EditDataHall data_hall={allFloorData[floorIndex]} show={showDataHallEdit} data_center_id={currentDataCenter} selectDataCenterFloor={selectDataCenterFloor} floorIndex={floorIndex} setFloorIndex={setFloorIndex} editDataHall={editDataHall} setShow={setShowDataHallEdit}/>}
				{showCabinetsEdit && <EditCabinet data_hall={allFloorData[floorIndex]} show={showCabinetsEdit} data_center_id={currentDataCenter} selectDataCenterFloor={selectDataCenterFloor} floorIndex={floorIndex} setFloorIndex={setFloorIndex} editCabinets={editCabinets} setShow={setShowCabinetsEdit} getCabinetsData={getCabinetsData} selectedDataHall={selectedDataHall}/>}

				<CreateDataCenter show={true} country={country} setDataCenter={setDataCenter} dataCenter={dataCenter}/>
		</Layout>
	)
}

export default DataCenter;
