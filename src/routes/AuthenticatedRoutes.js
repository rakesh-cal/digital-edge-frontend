import React,{useContext,useEffect} from 'react';
import { Routes, Route,Navigate} from "react-router-dom";
import Dashboard from 'views/super-admin/Dashboard';
import RoleAndPermission from 'views/super-admin/Setting/RoleAndPermission';
import User from 'views/super-admin/Setting/User';
import DataCenter from 'views/super-admin/Setting/DataCenter';
import Reports from 'views/super-admin/Setting/Reports'
import Test from 'views/super-admin/test';
import StateChart from 'views/super-admin/stateChart';
import Profile from 'views/profile'
import CanAccess from "./CanAccess";
import Forbidden from "./Forbidden";
import Capacity from "views/super-admin/Setting/DataCenter/capacity";
import ESG from "views/super-admin/ESG";

const AuthenticatedRoutes = () => {

	return (
		<React.Fragment>
		
			<Routes>
				<Route path="/data-center" element={<Dashboard />} />
				<Route path="/setting/role-and-permissions" element={
					
						<RoleAndPermission name="roleandpermission"/>
					
				} />
				<Route path="/setting/user" element={
					
						<User name="user"/>
					
				} />
				<Route path="/setting/data-center" element={
				
						<DataCenter name="datacenter"/>
					
				} />
				<Route path="/setting/capacity" element={
					
						<Capacity name="capacity"/>
					
				} />
				<Route path="/setting/reports" element={
					
						<Reports name="report" />
					
				} />
				<Route path="/test-graph" exact element={<Test />} />
				<Route path="/graph-state-chart" exact element={<StateChart />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/esg" element={<ESG />} />
				
			{/*	<Route path="/forbidden" element={<Forbidden />} />*/}
	        	<Route path="*" element={<Navigate to ="/data-center" />}/>
	      	</Routes>
      	</React.Fragment>
	);
}

export default AuthenticatedRoutes;