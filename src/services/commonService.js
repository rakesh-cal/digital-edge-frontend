import {
	axiosWithoutToken as axios
} from 'utils/axios';


class Common {

	async permission(){
		
		return await axios().get(`Permissions`);
	}

	async status(){
		
		return await axios().get(`status`);
	}

}

export default new Common();
