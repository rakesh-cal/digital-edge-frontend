import axios from 'axios';
import baseURL from './baseURL';

//api, localdedc,stgdedc

const endPoint = 'api';


const axiosWithToken = token => {

	const AuthHeader = {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'Authorization': token,
		"Ocp-Apim-Subscription-Key": "869163acffda4d148b9f490c72b8b13f",
		"Ocp-Apim-Trace": true
	};

	return axios.create({
		baseURL: `${baseURL+endPoint}/`,
		headers: AuthHeader
	});
}

const axiosWithoutToken = () => {

	const AuthHeader = {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		"Ocp-Apim-Subscription-Key": "869163acffda4d148b9f490c72b8b13f",
		"Ocp-Apim-Trace": true
	};

	return axios.create({
		baseURL: `${baseURL+endPoint}/`,
		headers: AuthHeader
	});
}

export {
	axiosWithoutToken,
	axiosWithToken
};