import {axiosWithToken as axios} from 'utils/axios';


class DataCenterChart {

	async index(token,dataCenterId){
		
		return await axios(token).get(`getDataCenterChart?data_center_id=${dataCenterId}`);
	}
	
	async store(token,data){
		
		return await axios(token).post(`storeDataCenterChart`,data);
	}

}

export default new DataCenterChart();
