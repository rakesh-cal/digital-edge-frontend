import {axiosWithToken as axios} from 'utils/axios';

class RoleService {
	/*
	|-------------------------------------------------------------------------------
	| Role and Permission Listing
	|-------------------------------------------------------------------------------
	*/
	async roleAndPermission (token) {

		return await axios(token).get(`RoleAndPermissions`);
	}
	/*
	|-------------------------------------------------------------------------------
	| Country List
	|-------------------------------------------------------------------------------
	*/
	async countryService (token){

		return await axios(token).get(`Countires`);
	}
	/*
	|-------------------------------------------------------------------------------
	| Data center
	|-------------------------------------------------------------------------------
	*/
	async dataCenter (token){

		return await axios(token).get(`DataCenters`);
	}
	/*
	|-------------------------------------------------------------------------------
	| Data center by country id list
	|-------------------------------------------------------------------------------
	*/
	async dataCenterByCountryId (token,data){

		return await axios(token).get(`DataCenters?id=${data.id}`);
	}
	/*
	|-------------------------------------------------------------------------------
	| Create new Role
	|-------------------------------------------------------------------------------
	*/
	async createRoleAndPermissions (token,data){

		return await axios(token).post(`CreateRoleAndPermissions`,data);
	}
	/*
	|-------------------------------------------------------------------------------
	| Update Role
	|-------------------------------------------------------------------------------
	*/
	async updateRoleAndPermissions (token,data){

		return await axios(token).post(`UpdateRoleAndPermission`,data);
	}
	/*
	|-------------------------------------------------------------------------------
	| Update Status
	|-------------------------------------------------------------------------------
	*/
	async updateStatus (token,data){

		return await axios(token).post(`UpdateRoleStatus`,data);
	}
	/*
	|-------------------------------------------------------------------------------
	| Destroy Role
	|-------------------------------------------------------------------------------
	*/
	async destroy (token,data){

		return await axios(token).post(`DeleteRole`,data);
	}
	/*
	|-------------------------------------------------------------------------------
	| Create Data center
	|-------------------------------------------------------------------------------
	*/
	async createDataCenter (token, data){

		return await axios(token).post(`addDataCenter`, data);
	}

}

export default new RoleService();
