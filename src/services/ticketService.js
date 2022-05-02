import {axiosWithToken as axios} from 'utils/axios';

class TicketServices {

	/*
	|-------------------------------------------------------------------------------
	| 	get Ticket Service
	|-------------------------------------------------------------------------------
	*/
	async index (token){

		return await axios(token).get('Ticket');
	}
}

export default new TicketServices()