import {axiosWithToken as axios} from 'utils/axios';

class FloorServices {

	async findAllFloor(token){

		return await axios(token).get(`Floors`);
	}
    /*
	|-------------------------------------------------------------------------------
	| Floor data by data center ID
	|-------------------------------------------------------------------------------
	*/
	async floorByDataCenterId (token,data){

		return await axios(token).get(`Floors?id=${data.id}`);
	}

	/*
	|-------------------------------------------------------------------------------
	| Floor data by Country ID
	|-------------------------------------------------------------------------------
	*/
	async floorByCountryId (token,data){

		return await axios(token).get(`Floors?country_id=${data.id}`);
	}

	/*
	|-------------------------------------------------------------------------------
	| Add Floor data by data center ID
	|-------------------------------------------------------------------------------
	*/
	async addFloor (token,data){

		return await axios(token).post(`addFloor`, data);
	}

	/*
	|-------------------------------------------------------------------------------
	| Update Floor data
	|-------------------------------------------------------------------------------
	*/
	async updateFloor (token,data){

		return await axios(token).post(`updateFloor`, data);
	}

	/*
	|-------------------------------------------------------------------------------
	| Delete Floor data
	|-------------------------------------------------------------------------------
	*/
	async deleteFloor (token,data){

		return await axios(token).post(`deleteFloor`, data);
	}
}

export default new  FloorServices()