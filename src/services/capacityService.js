import {axiosWithToken as axios} from 'utils/axios';

class CapacityServices {

	/*
	|-------------------------------------------------------------------------------
	| 	get Monthly utilizastion
	|-------------------------------------------------------------------------------
	*/
	async index (token,{dataCenterId,month,year}){

		const url =`getMonthlyUtilization?data_center_id=${dataCenterId}&month=${month}&year=2022`;

		return await axios(token).get(url);
	}
	/*
	|-------------------------------------------------------------------------------
	| 	Store Monthly utilizastion
	|-------------------------------------------------------------------------------
	*/
	async store (token,data){

		const url =`createMonthlyUtilization`;
		
		return await axios(token).post(url, data);
	}
}

export default new CapacityServices()