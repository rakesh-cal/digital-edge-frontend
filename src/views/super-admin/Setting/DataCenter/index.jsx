import React,{useEffect,useState,useContext} from 'react';
import Layout from "../../Layouts";
import Navigation from "../Component/Navigation";
//import Navigation from "./Navigation";
import RoleModel from "services/roleServices";
import Floors from "services/floorServices"
import AuthContext from "context";
import Floor from "./floor"
import EditFloor from './editFloor';
import CreateDataHall from './dataHall'
import EditDataHall from './editDataHall' 
import CreateDataCenter from './dataCenter'
import './dataCenter.css';

const DataCenter = (props) => {
	const authContext = useContext(AuthContext);
	const [state,setState] = useState([]);
	const [dataCenter, setDataCenter] = useState([])
	const [currentDataCenter, setCurrentDataCenter] = useState([])
	const [allFloorData, setAllFloorData] = useState([])
	const [dataHall, setDataHall] = useState([])
	const [floorIndex, setFloorIndex] = useState(0)
	const [dataCenterId, setDataCenterId] = useState()
	const [editFloorData, setEditFloorData] = useState()
	const [showFloorEdit, setShowFloorEdit] = useState(false)
	const [editDataHall, setEditDataHall] = useState()
	const [showDataHallEdit, setShowDataHallEdit] = useState(false)
	const [countryName, setCountryName] = useState("Country");
	const [currentTab,setCurrentTab] = useState(0);
	const [activeTab,setActiveTab] = useState();
	const [country, setCountry] = useState(0)

	useEffect(() => {

		getData()

	},[]);

	const getData = async () => {

		await RoleModel.countryService(authContext.token()).then(res => {
			setState(res.data.data);
		});
		getAllDataCenter()
		
	}

	const getFloorData = (id) => {
        
        setDataHall(allFloorData[id].data_halls)
        setActiveTab(allFloorData[id])
		setFloorIndex(id)
    }

	const getAllDataCenter = async () => {
		setCountryName("Country")
		await RoleModel.dataCenter(authContext.token()).then(res => {
			setDataCenter(res.data.data)
			if(res.data.data.length > 0){
				setActiveTab(res.data.data[0])
				selectDataCenterFloor(res.data.data[0])
				setCountry(res.data.data[0].country_id)
			}
		})
	}

	const getDataCenterById = async(e) => {
		setCountryName(e.name)
		await RoleModel.dataCenterByCountryId(authContext.token(), e).then(res => {
			setDataCenter(res.data.data)
			if(res.data.data.length > 0){
				setActiveTab(res.data.data[0])
				selectDataCenterFloor(res.data.data[0])
			}
		})
	}
	
	const selectDataCenterFloor = async(e, floor_id = 0) => {
		
		setCurrentDataCenter(e)
		setDataCenterId(e)
		await Floors.floorByDataCenterId(authContext.token(), e).then(res => {
		
			// var changedData = []
			// var finalData = []
			if(res.data.data.length > 0){
			// 	var groupBy = function(xs, key) {
			// 		return xs.reduce(function(rv, x) {
			// 		  (rv[x[key]] = rv[x[key]] || []).push(x);
			// 		  return rv;
			// 		}, {});
			// 	  };
				  
			// 	  changedData = groupBy(res.data.data, 'floor_id');
			// 	  let i=0
				 for(const k in res.data.data){
						 var totalPower = 0 , totalCabs = 0
						 res.data.data[k].data_halls.forEach((res, innerKey) => {
						totalPower += res.design_power ? parseFloat(parseFloat(res.design_power).toFixed(3)) : 0
						totalCabs += res.design_cabs ? parseFloat(parseFloat(res.design_cabs).toFixed(3)) : 0
						//finalData[key]
					})
					res.data.data[k].totalPower = totalPower
					res.data.data[k].totalCabs = totalCabs
				}
			//		finalData[i] = {floor_id: k, data:changedData[k], name:changedData[k][0].floor_name, totalPower: totalPower, totalCabs:totalCabs}
					 
			// 		  i++
			// 	  }
			
				setAllFloorData(res.data.data)
			 	setDataHall(res.data.data[floor_id].data_halls)
				setFloorIndex(floor_id)
			}else{
				setAllFloorData([])
			 	setDataHall([])
				setFloorIndex(0)
			}
			
			 
			
		})
	}

	const renderCountry = () => {

		return state && state.map((data,i) => {
			
			return <a className="dropdown-item" 
			href="javascript:void(0);" 
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


	return(
		
		<Layout>
			<div className="content-body" >
        			<Navigation/>
					<hr className="main" />
				<div className="container-fluid pt-0">
        			  
        	
					<div className="row ">
						<div className="col-xl-1">
							<div className="leftside">
							<p> <a href="#"  className="plink active"> Inventory </a> </p>
							<p> <a href="#"  className="plink "> Capacity </a> </p>                 
							</div>
						</div>
						<div className="col-lg-11">
							<div id="pro">
							   <div class="profile-tab">
                           <div class="custom-tab-1">
                              <div class="main_scrll">
                                 <div class="btn_ul">
                                    <ul class="nav nav-tabs mb-3">
                                 <li class="nav-item"> <button class="btn btn-secondary" style={{width: '100%'}} onClick={getAllDataCenter}> Global </button></li>
                                 <li class="nav-item">
                                    <div class="btn-group" role="group">
                                       <button type="button" class="btn btn-light dropdown-toggle" style={{width: '100%'}} data-bs-toggle="dropdown" aria-expanded="false"> {countryName} </button>
                                       <div class="dropdown-menu" style={{margin: '0px'}}>
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
								<div className="row"><h5 className="card-title col-md-6"> Inventory for {currentDataCenter.name} </h5><p className="col-md-6" style={{textAlign:"right"}}><a href="#" id="addnewdatacenter" data-bs-toggle="modal" data-bs-target=".bd-example-modal-lg2">
		<img src="\images\plus-circle-blue.svg"  style={{width:'1.25rem'}} /> &nbsp;Add Data Center</a> </p></div>
								<p> Each data center can set capacity thresholds at the data center, floor or data hall level. </p>
							</div>

							<div className="row">
				
	<div className="col-xl-4 col-lg-4">
		<div className="inv">
		<div className="invtab">
		<p>Floor</p>

		<p><a href="#" id="addneww" data-bs-toggle="modal" data-bs-target=".bd-example-modal-lg">
		<img src="\images\plus-circle-blue.svg"  style={{width:'1.25rem'}} /> &nbsp;Add Floor</a> </p>

	
		
		</div>
		<table>
		<tr>
		<th> Floor </th>
		<th> Cabs </th>
		<th> kW </th>
		<th> </th>
		</tr>


		{allFloorData && allFloorData.map((res,id) => {
			
		    return <tr 
		    class={activeTab.id === res.id?"tr_active":""}
		    onClick={() => getFloorData(id)} style={{cursor:"pointer"}} >
		    <td> {res.name}
		    <i className="fa fa-circle" 
		    style={{color:res.status === 1?"#3FEB7B":"#E0E2E5"}}
		    aria-hidden="true"></i> 
		    </td>
		    <td> {res.totalCabs} </td>
		    <td> {res.totalPower} </td>
		    <td> 
		    <a 
		    onClick={() => getEditFloorPopup(res)} 
		    style={{cursor:"pointer"}}>
		    <i className="fas fa-edit"></i>
		    </a> 
		    </td>
		    </tr>
		})}
		</table>
		</div> 
	</div> 

	<div className="col-xl-8 col-lg-8">	

			<div className="leftnav">
			<p> Data Halls </p>

			<p>
			<a 
			href="#" 
			id="addneww" 
			data-bs-toggle="modal" 
			data-bs-target="#exampleModalCenter">
			<img src="\images\plus-circle-blue.svg"  style={{width:'1.25rem'}} /> &nbsp;Add Data Halls </a> </p>

			

			</div>

	<div className="card-body data-hall-block">
	    <div className="table-responsive">
	        <table className="table header-border table-hover verticle-middle">
	            <thead>
	                <tr>
	                    <th scope="col" className="pd-l" width="25%"> Name </th>
	                    <th scope="col" > Status </th>
	                    <th scope="col" > Cabs </th>
	                    <th scope="col" > kW </th>
	                    <th scope="col" >  </th>
	                </tr>
	            </thead>
	            <tbody id="cardnew">
	            {
	                dataHall && dataHall.length > 0 && dataHall.map((res)=>{
	                    return <tr>
	                        <th className="pd-l bold-txt"> {res.name} </th>
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
	                        <th> {res.design_cabs ? parseFloat(parseFloat(res.design_cabs).toFixed(3)) : 0 } </th>
	                        <th> {res.design_power ? parseFloat(parseFloat(res.design_power).toFixed(3)) : 0} </th>
	                        <td> <a onClick={() => getEditDataHallPopup(res)}> <i className="fas fa-edit"></i></a> </td>
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
				<CreateDataHall data_hall={allFloorData[floorIndex]} show={true} data_center_id={currentDataCenter} show={true} selectDataCenterFloor={selectDataCenterFloor} floorIndex={floorIndex} setFloorIndex={setFloorIndex}/>

				{showDataHallEdit && <EditDataHall data_hall={allFloorData[floorIndex]} show={showDataHallEdit} data_center_id={currentDataCenter} selectDataCenterFloor={selectDataCenterFloor} floorIndex={floorIndex} setFloorIndex={setFloorIndex} editDataHall={editDataHall} setShow={setShowDataHallEdit}/>}
				<CreateDataCenter show={true} country={country} setDataCenter={setDataCenter} dataCenter={dataCenter}/>
		</Layout>
	)
}

export default DataCenter;
