import React, {useState} from 'react';
import Layout from '../Layouts';
import { XError } from 'components/common';
import { useParams } from "react-router-dom";
import {resetPassword} from "services/auth";
import Swal from 'sweetalert2';
import { useNavigate, Link } from "react-router-dom";

const PasswordReset = () => {

	const params = useParams();
	let navigate = useNavigate();

	const [state, setState] = useState({
		password:"",
		confirmPassword:""
	});
	const [isLoading,setIsLoading] = useState(false);

	const [errorState,setErrorState] = useState({
		password:"",
		confirmPassword:""
	});

	const [showPassword,setShowPassword] = useState(false);


	const onSubmit = async () => {

		setIsLoading(true);

		if(validationCheck()){
			
			await resetPassword({
				token: params.token,
				password: state.password,
				confirmPassword: state.confirmPassword
			}).then(res => {

				setIsLoading(false);
				setState({
					password:"",
					confirmPassword:""
				});

				Swal.fire(res.data.message).then((result) => {
				  /* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
					  	navigate("/");
					}
				})

			}).catch(err => {
				
				setIsLoading(false);
				let error = {
					password:"",
					confirmPassword:""
				};

				if(err?.response?.data?.errors?.password){
					error.password = err.response.data.errors.password;
				}
				if(err?.response?.data?.errors?.confirmPassword){
					error.confirmPassword = err.response.data.errors.confirmPassword;
				}

				setErrorState({...error});
			})
		}
	};

	const validationCheck = () => {

		let error = {
			password:"",
			confirmPassword:""
		};
		let flag = true;

		if (state.password === "" || state.password === null || state.password === undefined) {
			
			error.password = 'The password field is required.';
			flag = false;
		}
		if (state.confirmPassword === "" || state.confirmPassword === null || state.confirmPassword === undefined) {
			
			error.confirmPassword = 'The confirm password field is required.';
			flag = false;
		}

		if (state.password && state.confirmPassword && state.password !== state.confirmPassword) {

			error.password = "The password confirmation does not match.";
		}

		setErrorState({...error});
		return flag;
	}

	return (
		<Layout>
		<div className="authincation-content">
            <div className="row no-gutters">
                <div className="col-xl-12">
                    <div className="auth-form">
                        <h3 className="mb-4"> Change Password </h3>
                        <form action="index.html">
                            <div className="mb-3">
                                <label className="mb-1"><strong> New Password </strong></label>
                                <input 
                                type={showPassword?"text":"password"} 
                                placeholder="New Password"
                                onChange={event => setState({...state,password:event.target.value})}
                                className="form-control"/>
                                <XError message={errorState.password} />
                            </div>
                            <div className="mb-3">
                                <label className="mb-1"><strong> Confirm New Password </strong></label>
                                <input 
                                type={showPassword?"text":"password"}  
                                className="form-control"
                                onChange={event => setState({...state,confirmPassword:event.target.value})}
                                placeholder="Confirm New Password"
                                />
								<span>
								<i
								onClick={() => setShowPassword(!showPassword)}
								 className={`fa fa-eye${showPassword?'':'-slash'}`}
								 aria-hidden="true"></i> 
								</span>
								<XError message={errorState.confirmPassword} />
                            </div>
									 
							<div className="text-center">
                                <button 
                                type="button"
                                onClick={onSubmit} 
                                className="btn btn-primary btn-block">  Continue </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
		</Layout>
	);
}

export default PasswordReset;