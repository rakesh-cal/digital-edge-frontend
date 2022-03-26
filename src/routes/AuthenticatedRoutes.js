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

const AuthenticatedRoutes = () => {

	return (
		<React.Fragment>
		
			<Routes>
				<Route path="/data-center" element={<Dashboard />} />
				<Route path="/setting/role-and-permissions" element={
					<CanAccess>
						<RoleAndPermission name="roleandpermission"/>
					</CanAccess>
				} />
				<Route path="/setting/user" element={
					<CanAccess>
						<User name="user"/>
					</CanAccess>
				} />
				<Route path="/setting/data-center" element={
					<CanAccess>
						<DataCenter name="datacenter"/>
					</CanAccess>
				} />
				<Route path="/setting/capacity" element={
					<CanAccess>
						<Capacity name="capacity"/>
					</CanAccess>
				} />
				<Route path="/setting/reports" element={
					<CanAccess>
						<Reports name="report" />
					</CanAccess>
				} />
				<Route path="/test-graph" exact element={<Test />} />
				<Route path="/graph-state-chart" exact element={<StateChart />} />
				<Route path="/profile" element={<Profile />} />
			{/*	<Route path="/forbidden" element={<Forbidden />} />*/}
	        	<Route path="*" element={<Navigate to ="/data-center" />}/>
	      	</Routes>
      	</React.Fragment>
	);
}

export default AuthenticatedRoutes;