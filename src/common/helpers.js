

export const validateEmail = email => {
	return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

export const numberFormat = (x,decimal = 0) => {
	if (decimal === 0 && x > 1 ) {

		let newNumber = parseInt(Math.round(x));
    	let replacedNumber = newNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    	return isNaN(replacedNumber)?0:replacedNumber;

	}else if(decimal === 0 && x < 1 && x > 0){
		let newNumber =  Number(x).toFixed(3);
		return isNaN(newNumber)?0:newNumber;		
	}


	let newNumber = Number(x).toFixed(decimal);
	
    let decimalNum = newNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return isNaN(decimalNum)?0:decimalNum;

}
