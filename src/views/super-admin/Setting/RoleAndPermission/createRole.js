import React, {useState,useEffect,useRef} from 'react';
import RoleModel from 'services/roleServices';
import Select from 'react-select';
import { XError } from 'components/common';
import Swal from 'sweetalert2'
import CommonService from 'services/commonService';
import StorageContext from "context";

const errorInit = {
	"name":"",
	"country":"",
	//"dataCenter":"",
	"space":"",
	"monitorAndEvalution":"",
	"network":"",
}

const CreateRole = ({retriveCurrentData,token,permission}) => {

	const contextStore = React.useContext(StorageContext);
	const modalRef = useRef(null);
	const [countries,setCountries] = useState([]);
	const [dataCenters,setDataCenters] = useState([]);
	const [state,setState] = useState({
		"name":"",
		"country":"",
		"dataCenter":"",
		"space":1,
		"monitorAndEvalution":1,
		"network":1,
		"userManagement":false
	});
	const [errors,setError] = useState(errorInit);

	useEffect(() => {

		getCountries();

	},[]);

	const getCountries = async () => {

		const country = contextStore.getCountries;
		if (country.length) {

			setCountries(country);
		}else{

			await RoleModel.countryService(token)
			.then(async ({data}) => {
				await setCountries(data.data)
				contextStore.setCountry(data.data);
			} )
		}
	}

	const getDataCenters = async id => {

		const dataCenter = contextStore.getDataCenters
		
		if (dataCenter && dataCenter.length) {
			await setDataCenters(dataCenter.filter(center => center.country_id === Number(id)))
		}else{

			await RoleModel.dataCenterByCountryId(token,{id})
			.then(async ({data}) => {
				await setDataCenters(data.data);
				contextStore.setDataCenter(data.allData);
			} )
		}
	}

	const onChangeCountry = async id => {

		setState({...state,country:id})

		await getDataCenters(id);
	}

	const renderCountryList = () => {

		return countries && countries.map(country => {
			return <option value={country.id} key={country.id}>{country.name} </option>
		})
	}

	const renderDataCenterList = () => {

		return dataCenters && dataCenters.map(dataCenter => {
			return <option value={dataCenter.id} key={dataCenter.id}>{dataCenter.name} </option>
		})
	}

	const onSubmit = () => {

		if (checkValidation()) {

			RoleModel.createRoleAndPermissions(token,state).then(async res => {
				
				closeModal();
				Swal.fire('New Role Created');
				
				let newData = await contextStore.getRole;
				
				await contextStore.setRole(newData.push(res.data.data));

			}).catch(err => {

				let error = {
					"name":"",
					"country":"",
					//"dataCenter":"",
					"space":"",
					"monitorAndEvalution":"",
					"network":"",
				};
				let serverError = err.response.data.errors;

				if (serverError?.name) {
					error.name = serverError.name;
				}
				if (serverError?.country) {
					error.country = serverError.country;
				}
				/*if (serverError?.dataCenter) {
					error.dataCenter = serverError.dataCenter;
				}*/
				if (serverError?.space) {
					error.space = serverError.space;
				}
				if (serverError?.monitorAndEvalution) {
					error.monitorAndEvalution = serverError.monitorAndEvalution;
				}
				if (serverError?.network) {
					error.network = serverError.network;
				}
				setError({...error});
			})
		}
	}

	const checkValidation = () => {

		let error = {
			"name":"",
			"country":"",
			//"dataCenter":"",
			"space":"",
			"monitorAndEvalution":"",
			"network":"",
		};
		
		const { 
			name,
			country,
		//	dataCenter,
			space,
			monitorAndEvalution,
			network
		} = state;

		let flag = true;


		if (name === "" || name === null || name === undefined) {

			error.name = "The name field is required.";
			flag = false;
		}

		if (country === "" || country === null || country === undefined) {

			error.country = "The country field is required.";
			flag = false;
		}
		/*if (dataCenter === "" || dataCenter === null || dataCenter === undefined) {

			error.dataCenter = "The dataCenter field is required.";
			flag = false;
		}*/
		if (space.length == 0) {

			error.space = "The space field is required.";
			flag = false;
		}
		if (monitorAndEvalution.length == 0) {

			error.monitorAndEvalution = "The M&E field is required.";
			flag = false;
		}
		if (network.length == 0) {

			error.network = "The network field is required.";
			flag = false;
		}

		setError({...error});
		return flag;
	}
	const closeModal = () => {

		setState({
			"name":"",
			"country":"",
			"dataCenter":"",
			"space":1,
			"monitorAndEvalution":1,
			"network":1,
			"userManagement":false
		});
		modalRef.current.click();
	}

	return (
		<div className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog" aria-hidden="true">
		    <div className="modal-dialog modal-lg">
		        <div className="modal-content">
		            <div className="modal-header mt-59">
		                <h3 className="modal-title"> New Role 
		                </h3>
		                <button 
		                type="button" 
		                ref={modalRef}
		                className="btn-close" data-bs-dismiss="modal">

		                </button>
		            </div>
		            <div className="modal-body">
		                <div className="card">
		                    <div className="card-body">
		                        <div className="basic-form">
		                            <form>
		                                <div className="row">
		                                    <div className="mb-3 col-md-12 mt-2313">
		                                        <label className="form-label">
		                                            Name <small className="text-danger">*</small>
		                                        </label>
		                                        <input 
		                                        type="text" 
		                                        value={state.name}
		                                        className="form-control" 
		                                        onChange={event => setState({...state,name:event.target.value})}
		                                        placeholder="Name" />
		                                       <XError message={errors.name} />
		                                    </div>
		                                </div>
		                                <div className="row">
		                                    <div className="mb-3 col-md-6 mt-2313">
		                                        <label className="form-label">
		                                            Country <small className="text-danger">*</small>
		                                        </label>
		                                        <select 
		                                        defaultValue="" 
		                                        onChange={event => onChangeCountry(event.target.value)}
		                                        className="default-select form-control wide"
		                                        >	<option value="">Choose...</option>
		                                            {renderCountryList()}
		                                        </select>
		                                       	<XError message={errors.country} />
		                                    </div>
		                                    <div className="mb-3 col-md-6 mt-2313">
		                                        <label className="form-label"> 
		                                        Data Centers
		                                        </label>
		                                        <select 
		                                        defaultValue="" 
		                                        onChange={event => setState({...state,dataCenter:event.target.value})}
		                                        className="default-select form-control wide">
		                                            <option value="">All</option>
		                                            {renderDataCenterList()}
		                                        </select>
		                                        
		                                    </div>
		                                </div>

		                                <div className="row">
		                                    <div className="mb-3 col-md-6 mt-2313">
		                                        <label className="form-label"> 
		                                        Space <small className="text-danger">*</small>
		                                        </label>
		                                        <select 
		                                        onChange={event => {
		                                        	setState({...state,space:event.target.value});
		                                        }}
		                                        className="default-select form-control wide">
		                                           
		                                            {
		                                            	permission && permission.map(per => {
		                                            		return <option value={per.id}>{per.name}</option>
		                                            	})
		                                            }
		                                        </select>
												<XError message={errors.space} />
		                                    </div>
		                                    <div className="mb-3 col-md-6 mt-2313">
		                                        <label className="form-label">
		                                        M&E <small className="text-danger">*</small>
		                                        </label>
		                                        <select 
		                                      
		                                        onChange={event => {
		                                        	setState({
		                                        	...state,
		                                        	monitorAndEvalution:event.target.value
		                                        	});
		                                        	
		                                        }}
		                                        className="default-select form-control wide">
		                                           
		                                            {
		                                            	permission && permission.map(per => {
		                                            		return <option value={per.id}>{per.name}</option>
		                                            	})
		                                            }
		                                        </select>
												<XError message={errors.monitorAndEvalution} />
		                                    </div>
		                                </div>


		                                <div className="row">
		                                    <div className="mb-3 col-md-6 mt-2313">
		                                        <label className="form-label">
		                                        Network <small className="text-danger">*</small>
		                                        </label>
		                                        <select 
		                                        onChange={event => {
		                                        	setState({
		                                        	...state,
		                                        	network:event.target.value
		                                        	});
		                                        }}
		                                        className="default-select form-control wide">
		                                           
		                                            {
		                                            	permission && permission.map(per => {
		                                            		return <option value={per.id}>{per.name}</option>
		                                            	})
		                                            }
		                                        </select>
												<XError message={errors.network} />
		                                    </div>
		                                    <div className="mb-3 col-md-6 mt-2313">
		                                        <label className="form-label"> User Management </label>
		                                        <div className="row">
                                                      <div className="col-md-6 col-sm-6 mt_11">
                                                         <div className="form-check">
                                                             <input 
		                                                    type="radio"
		                                                    onChange={event => setState({...state,userManagement:true})} 
		                                                    name="optradio" />
                                                            <label className="form-check-label" for="flexRadioDefault1">
                                                            Allow
                                                            </label>
                                                         </div>
                                                      </div>
                                                      <div className="col-md-6 col-sm-6 mt_11">
                                                         <div className="form-check">
                                                           <input 
		                                                    type="radio" 
		                                                    onChange={event => setState({...state,userManagement:false})} 
		                                                    name="optradio" />
                                                            <label className="form-check-label" for="flexRadioDefault2">
                                                            Disallow
                                                            </label>
                                                         </div>
                                                      </div>
                                                   </div>
		                                       
		                                    </div>
		                                </div>

		                                 <div 
		                                 className="toolbar toolbar-bottom mt-51" 
		                                 style={{textAlign:'right'}}
		                                 role="toolbar">
		                                 <button 
		                                 type="button" 
		                                 onClick={closeModal}
		                                 style={{marginRight:"1rem"}}
		                                 className="btn btn-outline-primary mr_1"> Cancel </button>
		                                 <button 
		                                 type="submit" 
		                                 onClick={onSubmit} 
		                                 className="btn btn-primary"> Save </button>

		                                </div>
		                            </form>
		                        </div>
		                    </div>
		                </div>
		            </div>

		        </div>
		    </div>
		</div>
	);
}

export default CreateRole;