import {axiosWithToken as axios} from 'utils/axios';

class NetworkServices {

	async getNetworkFunction (token){

		return await axios(token).get('getNetworkFunction');
	}
	async getMake (token){

		return await axios(token).get('getMake');
	}
	async getModel (token){

		return await axios(token).get('getModel');
	}
	async getDeviceStatus (token){

		return await axios(token).get('getDeviceStatus');
	}
	/*
	|-------------------------------------------------------------------------------
	| 	get Network Service
	|-------------------------------------------------------------------------------
	*/
	async getNetworkDevices (token){

		return await axios(token).get('getNetworkDevices');
	}
    async networkByDataCenterId (token,data){

		return await axios(token).get(`getNetworkDevices?data_center_id=${data.id}`);
	}
	async addNetworkDevice (token,data){

		return await axios(token).post(`CreateNetworkDevice`, data);
	}
	async updateNetworkDevice (token,data){

		return await axios(token).post(`updateNetworkDevices`, data);
	}

}

export default new NetworkServices()