

export const validateEmail = email => {
	return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

export const numberFormat = (x) => {
	let newNumber = parseInt(Math.round(x));
    return  newNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
