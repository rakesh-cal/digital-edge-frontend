import React, {useState,useEffect,useRef} from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import { XError } from 'components/common';
import Swal from 'sweetalert2'
import RoleModel from "services/roleServices";
import {validateEmail} from "common/helpers";
import UserModal from "services/userServices";
import StorageContext from "context";


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


function App({token,data,show,setShow,retriveCurrentData}) {
 	
 	const contextStore = React.useContext(StorageContext);
  	const [modalIsOpen, setIsOpen] = React.useState(false);
  	const modalRef = useRef(null);
  	const [roles,setRoles] = useState([]);
	const [countries,setCountries] = useState([]);
	const [isLoading,setIsLoading] = useState(false);
	
	const [state,setState] = useState({
		name:"",
		email:"",
		country:"",
		role:"",
		uuid:"",
		status:""
	});

	const [error,setError] = useState({
		name:"",
		email:"",
		country:"",
		role:""
	});
	
	useEffect(() => {

		
		setIsOpen(show);

		const role = contextStore.getRole;
		const country = contextStore.getCountries;

		if(role.length){
			setRoles(role);
		}else{
			RoleModel.roleAndPermission(token).then(res => {

				setRoles(res.data.data);
				contextStore.setRole(res.data.data);
			}).catch(err => {

				/*redirect to 500 page */
			});
		}
		if(country.length){

			setCountries(country);

		}else{

			RoleModel.countryService(token).then(payload => {

				setCountries(payload.data.data);

				contextStore.setCountry(payload.data.data);

			}).catch(err => {

				/*redirect to 500 page */
			});
		}
		

		setState({
			name:data.name,
			email:data.email,
			country:data.country_id,
			role:data.role_id,
			uuid:data.uuid,
			status:data.status
		})
		
		//retriveCurrentData();

		return () => {
			
    	};

	},[show]);

	

  function openModal() {
    setIsOpen(true);
  }


  function closeModal() {
    setIsOpen(false);
    setShow(false);
  }
  	const checkValidation = () => {

		let error = {
			"name":"",
			"email":"",
			"country":"",
			"role":""
		};
		
		const { 
			name,
			email,
			country,
			role
		} = state;

		let flag = true;

		if (name === "" || name === null || name === undefined) {

			error.name = "The name field is required.";
			flag = false;
		}

		if (email === "" || email === null || email === undefined) {

			error.email = "The email field is required.";
			flag = false;

		}else{

			if (!validateEmail(email)) {
	            error.email = "The email must be a valid email address.";
	            flag = false;
	        }
		}

		if (country === "" || country === null || country === undefined) {

			error.country = "The country field is required.";
			flag = false;
		}

		if (role === "" || role === null || role === undefined) {

			error.role = "The role field is required.";
			flag = false;
		}
		

		setError({...error});
		return true;
	}

	const resendEmail = async () => {
		setIsLoading(true);

		await UserModal.resend(token,state).then(async res => {
				
			setIsLoading(false);
			closeModal();
			Swal.fire('Email Sent!');

		}).catch(err => {

			setIsLoading(false);
		})

	}

	const onSubmit = async () => {

		setIsLoading(true);

		if(checkValidation()){

			await UserModal.update(token,state).then(async res => {
				
				setIsLoading(false);
				closeModal();

				let data = await contextStore.getUser
				let newData = data.map(user => {
					if(user.uuid === state.uuid){
						return res.data.data;
					}
					return user;
				});
				
				await contextStore.setUser(newData);
				Swal.fire('User Updated');

			}).catch(err => {

				setIsLoading(false);
				let error = {
					"name":"",
					"email":"",
					"country":"",
					"role":""
				};
				const errors = err?.response?.data?.errors;

				if(errors?.name !== undefined || errors?.name !== "" || errors?.name !== null){
					error.name = errors.name;
				}
				if(errors?.email !== undefined || errors?.email !== "" || errors?.email !== null){
					error.email = errors.email;
				}
				if(errors?.country !== undefined || errors?.country !== "" || errors?.country !== null){
					error.country = errors.country;
				}
				if(errors?.role !== undefined || errors?.role !== "" || errors?.role !== null){
					error.role = errors.role;
				}

				setError({...error});
			})
		}
	}

	const onChangeStatus = async () => {

		const status = state.status === 1?2:1;

		await UserModal.changeStatus(token,{status,uuid:state.uuid}).then(async res => {
			
			closeModal();

			const newData = await contextStore.getUser.map(user => {

				if(user.uuid === state.uuid){
					user.status = status;
				}
				return user;
			})
			
			await contextStore.setUser(newData);

		}).catch(err => {

			// redirect to 500 page
		});
	}

	const onDelete = async () => {

		closeModal();


		Swal.fire({
		  	title: 'Are you sure?',
		  	text: "You won't be able to revert this!",
		  	icon: 'warning',
		  	showCancelButton: true,
		  	cancelButtonColor: '#d33',
		  	confirmButtonText: 'Yes, delete it!'
		}).then(async (result) => {
		  if (result.isConfirmed) {

		    await UserModal.destroy(token,{uuid:state.uuid}).then(async res => {
				
				const newData = await contextStore.getUser.filter(user => {
					if(user.uuid != state.uuid){
						return user;
					}
				})

				await contextStore.setUser(newData);

			}).catch(err => {

				// redirect to 500 page
			});
		  }
		})
		
	}

	const getStatus = () => {

		
		let button = ""
		switch(state.status) {
		  case 1:
		    button = <button type="button" style={{marginRight:"1rem"}} onClick={() => onChangeStatus()} className="btn btn-outline-primary1 mr_1"> Inactive</button>
		    break;
		  case 2:
		    button = <button type="button" style={{marginRight:"1rem"}}  onClick={() => onChangeStatus()} className="btn btn-outline-primary1 mr_1"> Active</button>
		    break;
		  default:
		    button = null;
		}

		return  button;
	}
  	

  return (
    <div>
      
      <Modal
      
        isOpen={modalIsOpen}
        style={customStyles}
        ariaHideApp={false}
      >
		            <div className="modal-header mt-59">
		                <h3 className="modal-title"> Edit User 
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
		                                        <label className="form-label"> Name</label>
		                                        <input 
		                                        type="text" 
		                                        defaultValue={state.name}
		                                        className="form-control" 
		                                        onChange={event => setState({...state,name:event.target.value})}
		                                        placeholder="Name" />
		                                        <XError message={error.name} />
		                                    </div>
		                                    <div className="mb-3 col-md-12 mt-2313">
		                                        <label className="form-label"> Email/Username </label>
		                                        <input 
		                                        type="text" 
		                                        defaultValue={state.email}
		                                        className="form-control" 
		                                        onChange={event => setState({...state,email:event.target.value})}
		                                        placeholder="jennifersmith@mail.com" />
		                                         <XError message={error.email} />
		                                    </div>
		                                </div>

		                                <div className="row">
		                                    <div className="mb-3 col-md-12 mt-2313">
		                                        <label className="form-label"> Country </label>
		                                        <select 
		                                        
		                                        value={state.country} 
		                                        onChange={event => setState({...state,country:event.target.value})}
		                                        className="nice-select  default- form-control wide">
		                                          
		                                            {countries && countries.map(country => {
		                                            	return <option 
		                                            	value={country.id}
		                                            	key={country.id}
		                                            	>{country.name} </option>
		                                            })}
		                                            
		                                        </select>
		                                         <XError message={error.country} />

		                                    </div>
		                                    <div className="mb-3 col-md-12 mt-2313">
		                                        <label className="form-label"> Role </label>
		                                        <select 
		                                        value={state.role}
		                                        onChange={event => setState({...state,role:event.target.value})}
		                                        className="default-select form-control wide">
		                                        
		                                            {roles && roles.map(role => {
		                                            	return <option 
		                                            	value={role.id}
		                                            	key={role.id}
		                                            	>{role.name} </option>
		                                            })}
		                                        </select>
		                                         <XError message={error.role} />
		                                    </div>
		                                </div>

<div className="toolbar toolbar-bottom mt-51 d-flex" role="toolbar">
  	{getStatus()}
  	<button type="button" 
  	onClick={() => onDelete()}
  	style={{marginRight:"1rem"}} 
  	className="btn btn-danger mr_1"> Delete</button>
	  {data.status == 0 && <button 
  	  onClick={() => resendEmail() }
  	  style={{marginRight:"1rem"}} 
  	type="button" className="btn btn-outline-primary mr_1"> Resend </button>}
  	<button 
  	  onClick={() => closeModal() }
  	  style={{marginRight:"1rem"}} 
  	type="button" className="btn btn-outline-primary mr_1"> Cancel </button>
  	{isLoading?(
		                                    <button 
		                                    type="button" 
		                                    className="btn btn-primary"> Loading ... </button>
		                                   	):(
		                                   	<button 
		                                    type="button" 
		                                    onClick={() => onSubmit()}
		                                    className="btn btn-primary"> Submit </button>
		                                   	)}
</div>
		                               
		                              
		                            </form>
		                        </div>
		                    </div>
		                </div>
		            </div>
      </Modal>
    </div>
  );
}

export default App;