import React,{useEffect,useState,useRef} from 'react';
import RoleModel from "services/roleServices";
import {validateEmail} from "common/helpers";
import { XError } from 'components/common';
import UserModal from "services/userServices";
import Swal from 'sweetalert2';
import StorageContext from "context";

const CreateUser = ({retriveCurrentData,token}) => {

	const contextStore = React.useContext(StorageContext);
	const modalRef = useRef(null);
	const [roles,setRoles] = useState([]);
	const [countries,setCountries] = useState([]);
	const [isLoading,setIsLoading] = useState(false);

	const [state,setState] = useState({
		name:"",
		email:"",
		country:"",
		role:""
	});

	const [error,setError] = useState({
		name:"",
		email:"",
		country:"",
		role:""
	});

	useEffect(() => {

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
	},[]);

	const onSubmit = async () => {

		setIsLoading(true);

		if(checkValidation()){

			await UserModal.store(token,state).then(async res => {
				
				setIsLoading(false);
				closeModal();
				
				let newData = await contextStore.getUser;
				await contextStore.setUser(newData.push(res.data.data));

				Swal.fire('New User Created');

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
	const closeModal = () => {

		setState({
			name:"",
			email:"",
			country:"",
			role:""
		});
		setError({
			name:"",
			email:"",
			country:"",
			role:""
		})

		modalRef.current.click();
	}

	return (
		<div className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog" aria-hidden="true">
		    <div className="modal-dialog modal-lg">
		        <div className="modal-content">
		            <div className="modal-header mt-59">
		                <h3 className="modal-title"> New User </h3>
		                <button 
		                type="button" 
		                ref={modalRef}
		                className="btn-close" data-bs-dismiss="modal"> </button>
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
		                                        className="form-control" 
		                                        onChange={event => setState({...state,name:event.target.value})}
		                                        placeholder="Name" />
		                                        <XError message={error.name} />
		                                    </div>
		                                    <div className="mb-3 col-md-12 mt-2313">
		                                        <label className="form-label"> Email/Username </label>
		                                        <input 
		                                        type="text" 
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
		                                        id="inputState" 
		                                        onChange={event => setState({...state,country:event.target.value})}
		                                        className="nice-select  default- form-control wide">
		                                            <option >Choose...</option>
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
		                                        id="inputState" 
		                                        onChange={event => setState({...state,role:event.target.value})}
		                                        className="default-select form-control wide">
		                                            <option >Choose...</option>
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

		                                <div 
		                                className="toolbar toolbar-bottom mt-51" 
		                                role="toolbar" style={{textAlign: "right"}}>
		                                    <button 
		                                    type="button" 
		                                    onClick={() => closeModal() }
		                                    style={{marginRight:"1rem"}}
		                                    className="btn btn-outline-primary mr_1"> Cancel </button>
		                                   	
		                                   	{isLoading?(
		                                    <button 
		                                    type="button" 
		                                    className="btn btn-primary mr_1"> Loading ... </button>
		                                   	):(
		                                   	<button 
		                                    type="button" 
		                                    onClick={() => onSubmit()}
		                                    className="btn btn-primary mr_1"> Save </button>
		                                   	)}
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

export default CreateUser;