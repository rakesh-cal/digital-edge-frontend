

export const validateEmail = email => {
	return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

export const numberFormat = (x,decimal = 0) => {
	if (decimal === 0 ) {

		let newNumber = parseInt(Math.round(x));
    	return newNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	}

	let newNumber = Number(x).toFixed(decimal);
	
   	return newNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}

export const numberFormat2 = (x,decimal = 0) => {
	if (decimal === 0 ) {

		let newNumber = Number(x);
		return isNaN(newNumber)?0:newNumber;
		
	}


	let newNumber = Number(x);
	return isNaN(newNumber)?0:newNumber;
	

}
