import {axiosWithToken as axios} from 'utils/axios';

class CabinetServices {

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