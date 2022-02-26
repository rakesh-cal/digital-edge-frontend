import {
	axiosWithoutToken as axios
} from 'utils/axios';


class Common {

	async permission(){
		
		return await axios().get(`Permissions`);
	}

}

export default new Common();
