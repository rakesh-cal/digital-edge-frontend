import React,{useContext} from 'react';
import StorageContext from "context";
import { Navigate, Route, useLocation } from 'react-router-dom';

const CanAccess = ({children}) => {

	const contextStore = useContext(StorageContext);
	let location = useLocation();
	if(
		contextStore.getAuth && 
		contextStore.getAuth.role.user_management && 
		children?.props?.name === 'user'
	){

		return children;
	}


	if(contextStore.getAuth && contextStore.getAuth.role.country_id === 6){
		return children
	}

	return <Navigate to="/forbidden" state={{ from: location }} />;
	
}

export default CanAccess;