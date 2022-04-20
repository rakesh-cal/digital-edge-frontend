import {axiosWithToken as axios} from 'utils/axios';

class ESGServices {

	/*
	|-------------------------------------------------------------------------------
	| 	get Monthly utilizastion
	|-------------------------------------------------------------------------------
	*/
	async index (token,{month,year}){

		let url;
		if (month && year) {
			url = `esg?month=${month}&year=${year}`;
		}else{

			url =`esg`;
		}

		return await axios(token).get(url);
	}
}

export default new ESGServices()