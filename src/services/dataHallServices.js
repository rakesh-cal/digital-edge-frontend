import {axiosWithToken as axios} from 'utils/axios';

class DataHallServices {

	/*
	|-------------------------------------------------------------------------------
	| Add Data Hall by data Floor ID
	|-------------------------------------------------------------------------------
	*/
	async addDataHall (token,data){

		return await axios(token).post(`addDataHall`, data);
	}

	/*
	|-------------------------------------------------------------------------------
	| Update Data Hall
	|-------------------------------------------------------------------------------
	*/
	async updateDataHall (token,data){

		return await axios(token).post(`updateDataHall`, data);
	}

	/*
	|-------------------------------------------------------------------------------
	| Delete Data Hall
	|-------------------------------------------------------------------------------
	*/
	async deleteDataHall (token,data){

		return await axios(token).post(`deleteDataHall`, data);
	}
}

export default new  DataHallServices()