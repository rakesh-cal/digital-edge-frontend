import {axiosWithToken as axios} from 'utils/axios';

class Profile {

	async get(token){
		
		return await axios(token).get(`getProfile`);
	}

	async update(token,data){
		return await axios(token).post('profileUpdate',data);
	}
	

}

export default new Profile();
