import React from 'react';
import { Routes, Route, Navigate} from "react-router-dom";
import Login from 'views/super-admin/Auth/Login';
import ForgotPassword from 'views/super-admin/Auth/Forgot-Password';
import PasswordReset from 'views/super-admin/Auth/Password-Reset';
import Test from 'views/super-admin/test';

const AuthenticationRoutes = () => {
	
	return (
		<React.Fragment>
			<Routes>
	        	<Route path="/">
				  	<Route path=":token" element={<Login />} />
				  	<Route path="" element={<Login />} />
				</Route>
	        	<Route path="/forgot-password" exact element={<ForgotPassword />} />
	        	<Route path="/password/reset/:token" exact element={<PasswordReset />} />
	        	<Route path="/test" exact element={<Test />} />
	        	<Route path="*" element={<Navigate to ="/" />}/>
	      	</Routes>
      	</React.Fragment>
	);
}

export default AuthenticationRoutes;