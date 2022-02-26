import React, {useState,useEffect} from 'react';
import {validateEmail} from "common/helpers";
import Layout from '../Layouts';
import { Link } from "react-router-dom";
import { 
	XError,
	XAlert
 } from 'components/common';
import {forgotPassword} from 'services/auth';

const ForgotPassword = () => {

	const [email,setEmail] = useState("");
	const [error,setError] = useState("");
	const [isLoading,setIsLoading] = useState(false);
	const [message,setMessage] = useState({
		type:"",
		message:""
	});


	const onSubmit = async () => {
		
		setMessage({
			type:"",
			message:""
		});

		setIsLoading(true);
		if(isLoading === false){

			if(validationCheck()){
				await forgotPassword({email}).then(res => {

					setIsLoading(false);
					setEmail("");
					setMessage({
						type:"success",
						message:res.data.message
					});

				}).catch(err => {

					setIsLoading(false);

					if(err?.response?.data?.errors?.email){

						setError(err.response.data.errors.email);
					}
				})
			}
		}else{

			setMessage({
				type:"danger",
				message:"Please wait before retrying."
			});
		}
	}

	const validationCheck = () => {

		let flag = true;

		if(email === "" || email === null || email === undefined){
			setError('The email field is required.');
			flag = false;
		}else{
			if(!validateEmail(email)){
				setError("The email must be a valid email address.");
				flag = false;
			}
		}

		return flag;
	}

	return(
		<Layout>
		<div className="authincation-content">
			<div className="row no-gutters">
				<div className="col-xl-12">
					<div className="auth-form">
						<Link to="/">
							<h4 className="mb-4"> 
								<img className="arrow-left" src="/images/arrow-left@1x.png" /> 
								 Back to login 
							</h4>
						</Link>
						<XAlert message={message.message} type={message.type}/>
						<h3> Password Reset </h3>
						<p> Send a link to your email to reset the password </p>
									
                        <form action="index.html">
                        	<div className="mb-3">
                        		<label className="mb-1"><strong>Email Address </strong></label>
                        		<input 
                        		type="email" 
                        		className="form-control"
                        		placeholder="Email Address"
                        		onChange={event => setEmail(event.target.value)}
                        		value={email} />
                        		<XError message={error}/>
                        	</div>
                        	<div className="text-center">

                        		{isLoading === false?
                        		<button 
                        		type="button" 
                        		onClick={onSubmit}
                        		className="btn btn-primary btn-block"> Send Reset Link  </button>:
                        		<button 
                        		type="button"
                        		className="btn btn-primary btn-block"> Sending ...  </button>}
                        		
                        	</div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
		</Layout>
	);
}

export default ForgotPassword;