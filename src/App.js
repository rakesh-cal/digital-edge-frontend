import React,{useEffect,useState} from 'react';
import Routes from 'routes';
import StorageContext from "context";

function App() {
	
	const [apiToken,setApiToken] = useState("");
	const [authData,setAuthData] = useState({});
	const [roleContext,setRoleContext] = useState([]);
	const [userConext,setUserContext] = useState([]);
	const [countryContext,setCountryContext] = useState([]);
	const [dataCenterContext,setDataCenterContext] = useState([]);
	const [permissionContext,setPermissionContext] = useState([]);
	const [floorsContext,setFloorsContext] = useState([]);
	const [selectedCountryContext,setSelectedCountryContext] = useState("");

	const contextData = React.useMemo(() => {
		return {
			
			logout: () => {
				localStorage.removeItem('token');
				setApiToken("");
				setAuthData({});
				setRoleContext([]);
				setUserContext([]);
				setCountryContext([]);
				setDataCenterContext([]);
				setPermissionContext([]);
				setFloorsContext([]);
				setSelectedCountryContext("");
			},
			login: token => {
				setApiToken(token)
			},
			token:() => {
				return apiToken	
			},
			setAuth: data => {
				setAuthData(data);
			},
			setRole: data => {
				setRoleContext(data);
			},
			setUser: data => {
				setUserContext(data);
			},
			setCountry: data => {
				setCountryContext(data);
			},
			setDataCenter: data => {
				setDataCenterContext(data);
			},
			setPermission: data => {
				setPermissionContext(data);
			},
			setFloor: data => {
				setFloorsContext(data);
			},
			setSelectedCountry: data => {
				setSelectedCountryContext(data);
			},
			getAuth: authData,
			getToken: apiToken,
			getRole: roleContext,
			getUser: userConext,
			getCountries: countryContext,
			getDataCenters: dataCenterContext,
			getPermission: permissionContext,
			getFloor: floorsContext,
			selectedCountry:selectedCountryContext
		};
	}, [
		authData,
		apiToken,
		roleContext,
		userConext,
		countryContext,
		dataCenterContext,
		permissionContext,
		floorsContext,
		selectedCountryContext
	]);

  	return (
  		<StorageContext.Provider value={contextData}> 
    		<Routes />
    	</StorageContext.Provider>
  	);
}

export default App;
