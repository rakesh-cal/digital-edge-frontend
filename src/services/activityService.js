import {axiosWithToken as axios} from 'utils/axios';


class Activity {

	async getActivity(token, type, id){
		
		return await axios(token).get(`CountryActivityLog?type=`+type+'&id='+id);
	}

}

export default new Activity();
