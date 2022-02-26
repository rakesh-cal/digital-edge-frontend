import {axiosWithToken as axios} from 'utils/axios';

class User {

	async index(token){
		
		return await axios(token).get(`UserList`);
	}

	async store(token,data){

		return await axios(token).post(`UserCreate`,data);
	}
	async changeStatus(token,data){

		return await axios(token).post(`UserStatus`,data);	
	}
	async update(token,data){
		return await axios(token).post('UserUpdate',data);
	}
	async destroy(token,data){
		return await axios(token).post('DeleteUser',data);	
	}
	async resend(token,data){
		return await axios(token).post('ResendEmail',data);
	}

}

export default new User();
