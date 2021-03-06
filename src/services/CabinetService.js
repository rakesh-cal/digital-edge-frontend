import {axiosWithToken as axios} from 'utils/axios';

class CabinetServices {

	
	/*
	|-------------------------------------------------------------------------------
	| 	Get all Cabinets
	|-------------------------------------------------------------------------------
	*/
	async getAllCabinets (token){

		return await axios(token).get(`getCabinet`);
	}

	/*
	|-------------------------------------------------------------------------------
	| 	Cabinets
	|-------------------------------------------------------------------------------
	*/
	async selectByHallId (token,data){

		return await axios(token).post(`Cabinets`, data);
	}

	/*
	|-------------------------------------------------------------------------------
	| 	Update Cabinets
	|-------------------------------------------------------------------------------
	*/
	async updateCabinets (token,data){

		return await axios(token).post(`updateCabinets`, data);
	}
}

export default new CabinetServices()