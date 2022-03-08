import React, {useState,useEffect} from 'react';
import Layout from '../Layouts';
import {
	XCard
} from 'components/Auth';
import { loginService,verifyEmail } from 'services/auth';
import StorageContext from "context";
import { useNavigate, Link,useParams, useLocation } from "react-router-dom";
import {validateEmail} from "common/helpers";
import { XError } from 'components/common';
import { 
	XAlert
 } from 'components/common';

const Login = () => {

	const HOME = '/data-center';

	let navigate = useNavigate();
	const location = useLocation();
	let { token } = useParams();

	const [state,setState] = useState({});
	const [message,setMessage] = useState({
		message:"",
		type:""
	});
	const [canShowPassword, setCanShowPassword] = useState(false);
	let contextData = React.useContext(StorageContext);


	useEffect(() => {
		if(location.pathname === "/" && token){

			verifyEmail({vToken:token}).then(res => {
				setMessage({
					message:res.data.message,
					type:"success"
				})
			}).catch(err => {
				setMessage({
					message:err.response.data.errors,
					type:"danger"
				})
			})
		}
	},[]);

	const onSubmit = (event) => {

		event.preventDefault();
		if(validation()){
			
			loginService({
				email: state.email,
				password: state.password
			}).then(res => {

				localStorage.setItem('token',res?.data?.api_token);
			
				contextData.login(res?.data?.api_token);
				contextData.setUser(res?.data?.data[0]);

				navigate(HOME);
			}).catch(err => {

				let error = {
					errEmail: '',
					errPassword: ''
				};

				const {email,password} = err?.response?.data?.errors;

				if(email !== undefined || email !== "" || email !== null){
					error.errEmail = email;
				}
				if(password !== undefined || password !== "" || password !== null){
					error.errPassword = password;
				}

				setState({...state,...error});
			})
		}
		
	}
	const validation = () => {

		let flag = true;
		let error = {
			errEmail: '',
			errPassword: ''
		};

		if(state.email === null || state.email === undefined || state.email === ""){

			error.errEmail = 'The email field is required.';

			flag = false;
		}else{

			if (!validateEmail(state.email)) {
	            error.errEmail = "The email must be a valid email address.";
	        }
		}

		if(state.password === null || state.password === undefined || state.password === ""){

			error.errPassword = 'The password field is required.';

			flag = false;
		}

		setState({...state,...error});

		return flag;
	}

	return (
		<Layout>
			<XCard title="Login">
				<XAlert message={message.message} type={message.type}/>
				<form onSubmit={onSubmit}>
					<div className="form_div">
						<label className="mb-1">
							<strong> Email Address </strong>
						</label>
						<input 
						type="email" 
						className="form-control" 
						onChange={(event) => setState({...state,email: event.target.value})}
						placeholder="Email Address" />
						<XError message={state.errEmail} />
						
					</div>

					<div className="form_div_2">
						<label className="mb-1">
							<strong> Password </strong>
						</label>
						<input 
						type={canShowPassword?"text":"password"} 
						className="form-control" 
						onChange={(event) => setState({...state,password: event.target.value})}
						placeholder="Password" />
						<i 
						className={`fa fa-eye${canShowPassword?'':'-slash'}`}
						onClick={() => setCanShowPassword(!canShowPassword)}
						aria-hidden="true"></i>
						<XError message={state.errPassword} />
						
					</div>
				
					<div className="row d-flex justify-content-between mt-4 mb-2">
						<div className="mb-3" id="forget">
							<Link to="/forgot-password">Forgot Password?</Link>
						</div>
					</div>
					<div className="text-center">
						<button 
						type="submit"
						className="btn btn-primary btn-block"> 
							Login 
						</button>
					</div>
				</form>
			</XCard>
		</Layout>
	);
}

export default Login;