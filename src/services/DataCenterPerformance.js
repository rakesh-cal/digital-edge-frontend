import {axiosWithToken as axios} from 'utils/axios';


class DataCenterPerformance {

	async index(token,data){
		
		return await axios(token).post(`DataCenterPerformance`,data);
	}
	
	async updateOrCreate(token,data){
		
		return await axios(token).post(`UpdateDataCenterPerformance`,data);
	}

}

export default new DataCenterPerformance();
