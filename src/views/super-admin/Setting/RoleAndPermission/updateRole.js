import React, {useState,useEffect,useRef} from 'react';
import Modal from 'react-modal';
import RoleModel from 'services/roleServices';
import Select from 'react-select';
import { XError } from 'components/common';
import Swal from 'sweetalert2';
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

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)

function App({token,data,show,setShow,retriveCurrentData,permission}) {
 	
 	const contextStore = React.useContext(StorageContext);
  	const [modalIsOpen, setIsOpen] = React.useState(false);
  	const modalRef = useRef(null);
	const [countries,setCountries] = useState([]);
	const [dataCenters,setDataCenters] = useState([]);
	const [disabled,setDisabled] = useState(true);
	const [state,setState] = useState({
		"name":"",
		"country":"",
		"dataCenter":"",
		"space":[],
		"monitorAndEvalution":[],
		"network":[],
		"userManagement":false,
		"status":""
	});
	const [errors,setError] = useState(errorInit);

	
	useEffect(() => {

		getCountries();
		getDataCenters(data.country_id);
		setIsOpen(show);
		setState({
			id: data.id,
			name:data.name,
			country:data.country_id,
			dataCenter: data.data_center_id,
			space: JSON.parse(data.space),
			monitorAndEvalution: JSON.parse(data.m_e),
			network: JSON.parse(data.network),
			userManagement:data.user_management?true:false,
			status:data.is_active

		});

		return () => {
			//setCountries([]);
			//setDataCenters([]);
      		setState({}); 
    	};

    	
	},[show,setState]);

	

	function openModal() {
	    setIsOpen(true);
	}


  function closeModal() {
    setIsOpen(false);
    setShow(false);
  }
  	

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

			return <option 
			value={country.id}
			key={country.id}>{country.name} </option>
		})
	}

	const renderDataCenterList = () => {

		return dataCenters && dataCenters.map(dataCenter => {
			return <option value={dataCenter.id} key={dataCenter.id}>{dataCenter.name} </option>
		})
	}
	const onChangeStatus = () => {

		const status = data.is_active?0:1;
		RoleModel.updateStatus(token,{
			status,
			id:data.id
		}).then(async() => {

			const newData = await contextStore.getRole.map(role => {

				if(role.id === data.id){
					role.is_active = status;
				}
				return role;
			})
			
			await contextStore.setRole(newData);

			closeModal();
		}).catch(err => {
			// 404 page
		})
	}

	const onSubmit = () => {

		if (checkValidation()) {

			RoleModel.updateRoleAndPermissions(token,state).then(async res => {
				
				let data = await contextStore.getRole;
				
				let newData = data.map(role => {
					
					if(role.id === state.id){
						return res.data.data;
					}
					return role;
				});
				
				await contextStore.setRole(newData);

				closeModal();

				Swal.fire('Role Updated');

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
	const onDelete = () => {

		closeModal();

		Swal.fire({
		  	title: 'Are you sure?',
		  	text: "You won't be able to revert this!",
		  	icon: 'warning',
		  	showCancelButton: true,
		  	cancelButtonColor: '#d33',
		  	confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
		  if (result.isConfirmed) {

		    RoleModel.destroy(token,{id:data.id}).then(async () => {

				const newData = await contextStore.getRole.filter(role => {
					if(role.id != state.id){
						return role;
					}
				})

				await contextStore.setRole(newData);
				
			}).catch(err => {
				// redirect 404
			})
		  }
		})
		
	}
	

  return (
    <div>
      
      <Modal
      
        isOpen={modalIsOpen}
        style={customStyles}
        ariaHideApp={false}
      >
        {/* <div className="modal-dialog modal-lg">
		        <div className="modal-content">*/}
		            <div className="modal-header mt-59">
		                <h3 className="modal-title"> Edit Role 
		                </h3>
		                <button 
		                type="button" 
		                onClick={() => closeModal()}
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
		                                        onChange={event => {
		                                        	setState({...state,name:event.target.value});
		                                        	setDisabled(false);
		                                        }}
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
		                                        value={state.country}
		                                        onChange={event => {
		                                        	onChangeCountry(event.target.value);
		                                        	setDisabled(false);
		                                        }}
		                                        className="default-select form-control wide"
		                                        >
		                                            {renderCountryList()}
		                                        </select>

		                                       	<XError message={errors.country} />
		                                    </div>
		                                    <div className="mb-3 col-md-6 mt-2313">
		                                        <label className="form-label"> 
		                                        Data Centers
		                                        </label>
		                                        <select 
		                                        value={state.dataCenter} 
		                                        onChange={event => {
		                                        	setState({...state,dataCenter:event.target.value});
		                                        	setDisabled(false)
		                                        }}
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
		                                        value={state.space} 
		                                        onChange={event => {
		                                        	setState({...state,space:event.target.value});
		                                        	setDisabled(false)
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
		                                        value={state.monitorAndEvalution} 
		                                        onChange={event => {
		                                        	setState({
		                                        	...state,
		                                        	monitorAndEvalution:event.target.value
		                                        	});
		                                        	setDisabled(false);
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
		                                        value={state.network} 
		                                        onChange={event => {
		                                        	setState({
		                                        	...state,
		                                        	network:event.target.value
		                                        	});
		                                        	setDisabled(false);
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
		                                                    checked={state.userManagement === true?true:false}
		                                                    onChange={event => {
		                                                    	setState({...state,userManagement:true})
		                                                    	setDisabled(false);
		                                                    }} 
		                                                    name="optradio" />
                                                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                            Allow
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-sm-6 mt_11">
                                                        <div className="form-check">
                                                            <input 
		                                                    type="radio" 
		                                                    checked={state.userManagement === true?false:true}
		                                                    onChange={event => {
		                                                    	setState({...state,userManagement:false})
		                                                    	setDisabled(false);
		                                                    }} 
		                                                    name="optradio" />
                                                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                            Disallow
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
		                                    </div>
		                                </div>


										<div className="toolbar toolbar-bottom mt-51 d-flex" role="toolbar">	 
                                            <button 
                                            type="button" 
                                            onClick={() => onChangeStatus()}
                                            style={{marginRight:"1rem"}}
                                            className="btn btn-outline-danger mr_1"> 
                                            {state.status?"Archive":"Active"}
                                            </button>
                                            <button 
                                            type="button"
                                            style={{marginRight:"1rem"}} 
                                            onClick={() => onDelete()}
                                            className="btn btn-danger mr_1"> 
                                            Delete
                                            </button>
                                            <button 
                                            type="button" 
                                            onClick={closeModal} 
                                            style={{marginRight:"1rem"}}
                                            className="btn btn-outline-primary mr_1"> 
                                            Cancel 
                                            </button>
                                            <button 
                                            type="button" 
                                            onClick={onSubmit} 
	                                        disabled={disabled}
                                            className="btn btn-primary"> 
                                            	Save
                                            </button>
                                        </div>
		                            </form>
		                        </div>
		                    </div>
		                </div>
		            </div>

		        {/*</div>
		    </div>*/}
      </Modal>
    </div>
  );
}

export default App;