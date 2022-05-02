import React, {useState,useEffect} from 'react';
import AuthenticatedRoutes from './AuthenticatedRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import { Navigate,useLocation } from "react-router-dom";
import StorageContext from "context";
import {auth} from 'services/auth';

const Index = () => {

	const contextData = React.useContext(StorageContext);

	useEffect(() => {
		
		const token = localStorage.getItem('token')

		auth(token).then(res => {

			contextData.setAuth(res.data.user);
			contextData.setMonthYear(res.data.currentMonth,res.data.currentYear);

			contextData.login(res.data.user.api_token)

		}).catch(err => {

			localStorage.removeItem('token');
		})

	},[]);

	return contextData.getToken?<AuthenticatedRoutes/>:<AuthenticationRoutes/>;
}

export default Index;