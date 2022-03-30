

export const validateEmail = email => {
	return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

export const numberFormat = (x,decimal = 0) => {
	if (decimal === 0 && x > 1 ) {

		let newNumber = parseInt(Math.round(x));
    	return  newNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	}else if(decimal === 0 && x < 1 && x > 0){
		return Number(x).toFixed(3);
	}


	let newNumber = Number(x).toFixed(decimal);
	
    return  newNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}
