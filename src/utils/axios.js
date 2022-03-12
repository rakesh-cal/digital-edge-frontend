import axios from 'axios';
import baseURL from './baseURL';

const axiosWithToken = token => {

	const AuthHeader = {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'Authorization': token,
		"Ocp-Apim-Subscription-Key": "869163acffda4d148b9f490c72b8b13f",
		"Ocp-Apim-Trace": true
	};

	return axios.create({
		baseURL: `${baseURL}api/`,
		headers: AuthHeader
	});
}

const axiosWithoutToken = () => {

	return axios.create({
		baseURL: `${baseURL}api/`,
		"Ocp-Apim-Subscription-Key": "869163acffda4d148b9f490c72b8b13f",
		"Ocp-Apim-Trace": true
	});
}

/*const axiosWithToken = token => {

	const AuthHeader = {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'Authorization': token,
		"Ocp-Apim-Subscription-Key": "869163acffda4d148b9f490c72b8b13f",
		"Ocp-Apim-Trace": true
	};

	return axios.create({
		baseURL: `${baseURL}localdedc/`,
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
		baseURL: `${baseURL}localdedc/`,
		headers: AuthHeader
	});
}*/


export {
	axiosWithoutToken,
	axiosWithToken
};