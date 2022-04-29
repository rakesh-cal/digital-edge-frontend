import React, { useEffect, useState, useContext, useRef } from 'react';
import RoleModel from "services/roleServices";
import AuthContext from "context";
import Common from "services/commonService";
import networkServices from 'services/networkServices';
import NetworkModel from './NetworkModel';
import EditNetwork from './editNetwork';

export default function Network(props) {
	const authContext = useContext(AuthContext);
	const [dataCenter, setDataCenter] = useState([])
	const [currentDataCenter, setCurrentDataCenter] = useState([])
	const [allNetworkData, setAllNetworkData] = useState([]);
	const [floorIndex, setFloorIndex] = useState(0)
	const [countryName, setCountryName] = useState("Country");
	const [currentTab, setCurrentTab] = useState(0);
	const [activeTab, setActiveTab] = useState();
	const [country, setCountry] = useState(0)
	const initialMount = useRef(true);
	const [ascending, setAscending] = useState(true);
	const [isReadOnly, setIsReadOnly] = useState(true);
	const [statusData, setStatusData] = useState([]);
	const [editNetworkData,setEditNetworkData]= useState();
	const [showNetworkEdit,setShowNetworkEdit]= useState(false);

	useEffect(() => {
		Common.status().then(res => setStatusData(res.data.data));
		getData();

		if (authContext?.getAuth?.role?.space === 3 ||
			authContext?.getAuth?.role?.m_e === 3 ||
			authContext?.getAuth?.role?.network === 3) {
			setIsReadOnly(false);
		}

		if (initialMount.current === false) {
			selectDataCenterFloor(currentDataCenter, floorIndex);

		}
		getAllDataCenter();

	}, [authContext.getFloor, authContext.getDataCenters]);

	const getData = async () => {

		if (authContext.getCountries.length === 0) {

			await RoleModel.countryService(authContext.token()).then(res => {
				authContext.setCountry(res.data.data);

			});
		}


	}


	const getAllDataCenter = async () => {
		setCountryName("Country");
		if (authContext.getDataCenters.length === 0) {
			await RoleModel.dataCenter(authContext.token()).then(res => {
				authContext.setDataCenter(res.data.data);
				setDataCenter(res.data.data);
				//console.log(res.data.data);
				if (res.data.data.length > 0) {
					if (initialMount.current) {
						setActiveTab(res.data.data[0].id)
						selectDataCenterFloor(res.data.data[0])
						setCountry(res.data.data[0].country_id)
						initialMount.current = false
					}


				}
			});
		} else {

			if (initialMount.current) {
				setActiveTab(authContext.getDataCenters[0].id)
				selectDataCenterFloor(authContext.getDataCenters[0]);
				initialMount.current = false
			}
			setDataCenter(authContext.getDataCenters);
		}
	}

	const getDataCenterById = async (e) => {
		setCountryName(e.name)

		if (authContext.getDataCenters.length === 0) {
			await networkServices.getNetworkDevices(authContext.token(), e).then(res => {
				setDataCenter(res.data.data)
				if (res.data.data.length > 0) {
					setActiveTab(res.data.data[0].id)
					selectDataCenterFloor(res.data.data[0])
				}
			})
		} else {

			const data = authContext.getDataCenters.filter(data => data.country_id === e.id);
			setDataCenter(data)
			if (data.length > 0) {
				setActiveTab(data[0].id)
				selectDataCenterFloor(data[0])
			}
		}
	}
	const selectDataCenterFloor = async (e, floor_id = 0) => {
		console.log("called data center", e, floor_id)
		setAscending(true);
		setCurrentDataCenter(e)
		await networkServices.networkByDataCenterId(authContext.token(), e).then(res => {
			setAllNetworkData(res.data.data);
			console.log(res.data.data)
		})


	}


	const renderCountry = () => {

		return authContext.getCountries.length && authContext.getCountries.map((data, i) => {

			return <a className="dropdown-item"
				key={i}
				onClick={() => {
					setCurrentTab(0)
					setCountry(data.id)
					getDataCenterById(data)
				}}>{data.name} </a>
		})
	}
	const getEditNetworkPopup = (data) => {

		setEditNetworkData(data)
		setShowNetworkEdit(true)

	}
	return (
		<div className="row">
			<div className="col-xl-1" style={{ width: "11%" }}>
				<div className="leftside">
					<p> <a href="#" className="plink active">Inventory</a> </p>
					<p> <a href="#" className="plink">Rack Elevation</a> </p>
					<p> <a href="#" className="plink">Topology</a> </p>
					<p> <a href="#" className="plink">Fiber Map</a> </p>
				</div>
			</div>
			<div className="col-lg-11" style={{ width: "89%" }}>
				<div id="pro">
					<div className="profile-tab">
						<div className="custom-tab-1">
							<div className="main_scrll">
								<div className="btn_ul">
									<ul className="nav nav-tabs mb-3">
										<li className="nav-item"> <button className="btn btn-secondary" style={{ width: "100%" }} onClick={getAllDataCenter}> Global </button></li>
										<li className="nav-item">
											<div className="btn-group" role="group">
												<button type="button" className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{ width: "100%" }}> {countryName} </button>
												<div className="dropdown-menu" style={{ margin: "0px" }}>
													{renderCountry()}
												</div>
											</div>
										</li>
									</ul>
								</div>
								<div className="ul_scrll">
									<ul className="nav nav-tabs mb-3">
										{
											dataCenter && dataCenter.map((data, index) => {

												if (currentDataCenter && currentDataCenter.id === data.id) {
													return (
														<li
															className={index === 0 ? 'nav-item' : 'nav-item'}
															key={index}>
															<a
																onClick={() =>
																	selectDataCenterFloor(data)}
																style={{ cursor: 'pointer' }}
																className="nav-link active show">
																<img className="down setting_down" src="\images\downward-arrow.png" />
																{data.name}
															</a>
														</li>
													)
												} else {

													return (
														<li
															className={index === 0 ? 'nav-item' : 'nav-item'}
															key={index}>
															<a
																onClick={() => selectDataCenterFloor(data)}
																style={{ cursor: 'pointer' }}
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
					<div className="tblop-117">
						<div className="ttl_op-117">
							<h6>Latest Updates : 2022-04-22 12:22 HKT</h6>
							<a href="#" style={{ color: "#147AD6", fontWeight: "600", fontSize: "0.813rem" }} data-bs-toggle="modal" data-bs-target=".bd-example-modal-lg"><img src="\images\plus-circle-blue.svg" style={{ width: "1rem" }} /> &nbsp;Add Device</a>
						</div>
					</div>
					<div className="op-117_table mt-1">
						<div className="table-responsive" style={{ overflow: "auto", height: "350px" }}>
							<table className="table table-responsive-md" style={{ border: "1px solid #eee" }}>
								<thead>
									<tr style={{ border: "1px solid #eee" }}>
										<th><strong>Funtion</strong></th>
										<th><strong>Hostname</strong></th>
										<th><strong>Vendors</strong></th>
										<th><strong>Model</strong></th>
										<th><strong>S/N</strong></th>
										<th><strong>Status</strong></th>
										<th><strong>Cabinet ID</strong></th>
										<th><strong>Support</strong></th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{
										allNetworkData && allNetworkData.map((data, id) => {

											return (
												<tr key={id} className={activeTab === data.id?"tr_active":""}>
													<td>{data.network_function!=null?data.network_function.name:"N/A"} </td>
													<td> {data.name} </td>
													<td> {data.makes.name}</td>
													<td>{data.models.name} </td>
													<td> {data.sn}</td>
													<td> </td>
													<td>{data.cabinet_id} </td>
													<td>{data.support_expiry} </td>
													<td>
													{isReadOnly === false?(
														<td>
														<a
														onClick={() => getEditNetworkPopup(data)}
														style={{cursor:"pointer"}}>
														<i className="fas fa-edit"></i>
														</a>
														</td>
														):null}
													</td>

												</tr>
											)
										})


									}

								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<NetworkModel show={true} data_center_id={currentDataCenter} selectDataCenterFloor={selectDataCenterFloor}/>

			{showNetworkEdit && <EditNetwork network_data={editNetworkData} show={showNetworkEdit} setShow={setShowNetworkEdit} data_center_id={currentDataCenter} selectDataCenterFloor={selectDataCenterFloor}/>}
		</div>

	)
}
