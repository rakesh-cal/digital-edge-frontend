import React,{useEffect,useState,useContext,useRef} from 'react';
import AuthContext from "context";
import { XError } from 'components/common';
import Swal from 'sweetalert2'
import DataHall from "services/dataHallServices"
import Modal from 'react-modal';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

const EditDataHall = (props) => {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const modalRef = useRef(null);
	const authContext = useContext(AuthContext);
    const [isLoading,setIsLoading] = useState(false);

    const [state,setState] = useState({
        data_hall_id:"",
		name:"",
        cabinet: "",
        power: "",
        soldCabinet:"",
		cages:"",
		soldCages:"",
		status:""
	});
    const [error,setError] = useState({
		name:"",
        cabinet: "",
        power: "",
        soldCabinet:"",
		cages:"",
		soldCages:"",
		status:""
	});

	useEffect(() => {
        setIsOpen(props.show);
        setState({
            data_hall_id:props.editDataHall.id,
            name:props.editDataHall.name,
            cabinet: props.editDataHall.design_cabs,
            power: props.editDataHall.design_power,
            soldCabinet: props.editDataHall.sold_cabs,
			cages:props.editDataHall.design_cages,
			soldCages:props.editDataHall.sold_cages,
			status:props.editDataHall.status
        });

        return () => {
			//setCountries([]);
			//setDataCenters([]);
      		setState({}); 
    	};

	},[props.show]);

    
	const deleteDataHall = async () => {

		closeModal();

		setState({...state,data_hall_id:props.editDataHall.id})
		Swal.fire({
		  	title: 'Are you sure?',
		  	text: "You won't be able to revert this!",
		  	icon: 'warning',
		  	showCancelButton: true,
		  	cancelButtonColor: '#d33',
		  	confirmButtonText: 'Yes, delete it!'
		}).then(async (result) => {
		  if (result.isConfirmed) {

		    await DataHall.deleteDataHall(authContext.getToken,{...state,data_hall_id: props.editDataHall.id}).then(res => {
				
				setIsLoading(false);
               
				props.selectDataCenterFloor(props.data_center_id, props.floorIndex);
				closeModal();
				//Swal.fire('Floor Deleted');
                //props.selectDataCenterFloor(props.dataCenterId)

			}).catch(err => {

				setIsLoading(false);
				let error = {
					"floor_id":"",
                    "name":"",
                    "cabinet": "",
                    "power": "",
                    "soldCabinet":"",
					"cages":"",
					"soldCages":"",
					"status":""
				};
				const errors = err?.response?.data?.errors;

				if(errors?.name !== undefined || errors?.name !== "" || errors?.name !== null){
					error.name = errors.name;
				}
                if(errors?.cabinet !== undefined || errors?.cabinet !== "" || errors?.cabinet !== null){
					error.cabinet = errors.cabinet;
				}
                if(errors?.power !== undefined || errors?.power !== "" || errors?.power !== null){
					error.power = errors.power;
				}
				if(errors?.soldCabinet !== undefined || errors?.soldCabinet !== "" || errors?.soldCabinet !== null){
					error.soldCabinet = errors.soldCabinet;
				}
			})
		  }
		})
		
	}

    const onSubmit = async (data) => {


        setIsLoading(true);
		if(checkValidation()){
           setState({...state,data_hall_id:props.editDataHall.id})
            
			await DataHall.updateDataHall(authContext.getToken,{...state,data_hall_id: props.editDataHall.id}).then(res => {
				
				setIsLoading(false);
                
				props.selectDataCenterFloor(props.data_center_id, props.floorIndex);
				closeModal();
					Swal.fire('Data Hall Updated');
                //props.selectDataCenterFloor(props.dataCenterId)

			}).catch(err => {

				setIsLoading(false);
				let error = {
					"floor_id":"",
                    "name":"",
                    "cabinet": "",
                    "power": "",
                    "soldCabinet":"",
					"cages":"",
					"soldCages":"",
					"status":""
				};
				const errors = err?.response?.data?.errors;

				if(errors?.name !== undefined || errors?.name !== "" || errors?.name !== null){
					error.name = errors.name;
				}
                if(errors?.cabinet !== undefined || errors?.cabinet !== "" || errors?.cabinet !== null){
					error.cabinet = errors.cabinet;
				}
                if(errors?.power !== undefined || errors?.power !== "" || errors?.power !== null){
					error.power = errors.power;
				}
				if(errors?.soldCabinet !== undefined || errors?.soldCabinet !== "" || errors?.soldCabinet !== null){
					error.soldCabinet = errors.soldCabinet;
				}
				if(errors?.cages !== undefined || errors?.cages !== "" || errors?.cages !== null){
					error.cages = errors.cages;
				}
				if(errors?.soldCages !== undefined || errors?.soldCages !== "" || errors?.soldCages !== null){
					error.soldCages = errors.soldCages;
				}

			})
		}
	}

    const checkValidation = () => {

		let error = {
			"name":"",
            "cabinet": "",
            "power": "",
            "soldCabinet":"",
			"cages":"",
			"soldCages":"",
			"status":""
		};
		
		const { 
			name,
            cabinet,
            power,
            soldCabinet,
			cages,
			soldCages,
			status
		} = state;

		let flag = true;

		if (name === "" || name === null || name === undefined) {

			error.name = "The name field is required.";
			flag = false;
        }

        if (cabinet === "" || cabinet === null || cabinet === undefined) {

			error.cabinet = "The cabinet field is required.";
			flag = false;
        }
        if (power === "" || power === null || power === undefined) {

			error.power = "The power field is required.";
			flag = false;
        }
        if (soldCabinet === "" || soldCabinet === null || soldCabinet === undefined) {

			error.soldCabinet = "The soldCabinet field is required.";
			flag = false;
        }
		if (cages === "" || cages === null || cages === undefined) {

			error.cages = "The cages field is required.";
			flag = false;
        }
		if (soldCages === "" || soldCages === null || soldCages === undefined) {

			error.soldCages = "The soldCages field is required.";
			flag = false;
        }
		setError({...error});
		return true;
	}

    const closeModal = () => {

		setIsOpen(false);
        props.setShow(false);
	}

	const validatePower = (e) => {  
		
		let t = e.target.value;
		let newValue = state.power;

		if(t.toString().split(".")[0].length <= 6){

	  		newValue = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 6)) : t;
	  		setState({...state,power:Number(newValue)})
		}

		
	}

    return (
    	<div className="modal show" style={{display:"block"}} id="exampleModalCenter">
<div className="modal-dialog modal-lg">
<div className="modal-content">
<div className="modal-header mt-59">
<h3 className="modal-title"> Edit Data Hall </h3>
<button type="button" className="btn-close" onClick={closeModal} > </button></div>
<div className="modal-body">
<div className="card">
<div className="card-body">
    <div className="basic-form">
        <form>
        <div className="row">
            <div className="mb-3 col-md-12 mt-2313">
                <label className="form-label"> Name <small className="text-danger">*</small></label>
                <input type="text" className="form-control" placeholder="" value={state.name} name="name" onChange={event => setState({...state,name:event.target.value})}/>
                <XError message={error.name} />
            </div>									
        </div>
        <div className="row">
            <div className="mb-3 col-md-6 mt-2313">
                <label className="form-label"> Total Cabinets <small className="text-danger">*</small></label>
                <input 
                className="form-control" 
                type="number"
                maxlength={9}
                placeholder="Total Cabinets"
                value={state.cabinet}
                onChange={event => setState({
                	...state,
                	cabinet:event.target.value.length<=9?event.target.value.replace(/[^\d]/,''):state.cabinet.replace(/[^\d]/,'')
                })}
                />

                <XError message={error.cabinet} />
            </div>				
            <div className="mb-3 col-md-6 mt-2313">
                <label className="form-label"> Sold Cabinets <small className="text-danger">*</small></label>
    
                <input 
                className="form-control" 
                type="number"
                maxlength={9}
                placeholder="Sold Cabinets"
                value={state.soldCabinet}
                onChange={event => {
                	let value = event.target.value.replace(/[^\d]/,'');

                	if( Number(value) <= Number(state.cabinet)){
                		setError({
							...error,
							soldCabinet:""
						});
	                	setState({
		                	...state,
		                	soldCabinet:event.target.value.length<=9?value:state.soldCabinet
	                	});
                	}else{
				        setError({
							...error,
							soldCabinet:"Sold cabinet should not greater than total cabinet"
						})
                	}
                }}
                />
                <XError message={error.soldCabinet} />
            </div>				
            <div className="mb-3 col-md-6 mt-2313">
                <label className="form-label"> Total Cages <small className="text-danger">*</small></label>
               <input 
                className="form-control" 
                type="number"
                maxlength={9}
                placeholder="# of Cages"
                value={state.cages}
                onChange={event => setState({
                	...state,
                	cages:event.target.value.length<=9?event.target.value:state.cages
                })}
                />
                <XError message={error.cages} />
            </div>				
            <div className="mb-3 col-md-6 mt-2313">
                <label className="form-label"> Sold Cages <small className="text-danger">*</small></label>
                <input 
                className="form-control" 
                type="number"
                maxlength={9}
                placeholder="Sold Cages"
                value={state.soldCages}
                onChange={event => {
                	let value = event.target.value.replace(/[^\d]/,'');

                	if( Number(value) <= Number(state.cages)){
                		setError({
							...error,
							soldCages:""
						});
	                	setState({
		                	...state,
		                	soldCages:event.target.value.length<=9?value:state.soldCages
	                	});
                	}else{
				        setError({
							...error,
							soldCages:"Sold cages should not greater than total cages"
						})
                	}
                }}
                />
                <XError message={error.soldCages} />
            </div>									
        </div>
        <div className="row">
            <div className="mb-3 col-md-12 mt-2313">
                <label className="form-label"> Total kWs <small className="text-danger">*</small></label>
                
                <input
                type="number"
                min="0.00000" 
                step="0.00001"
                maxlength="11"
                className="form-control" 
                type="number"
                placeholder="# of kWs" 
                value={state.power} 
                onChange={(event) => validatePower(event)}
                //onChange={event => setState({...state,power:event.target.value})}
                />

                <XError message={error.power} />
            </div>									
        </div>
		<div className="row">
            <div className="mb-3 col-md-12 mt-2313">
                <label className="form-label"> Status <small className="text-danger">*</small></label>
                <select value={state.status}
					onChange={event => {
						setState({
						...state,
						status:event.target.value
						});
					}}
					className="default-select form-control wide">
						
						<option value="1" >In Service</option>
						<option value="2">Complete</option>
						<option value="3">Construction</option>
						<option value="4">Planning</option>
					</select>
                <XError message={error.status} />
            </div>									
        </div>
        
         <div className="toolbar toolbar-bottom mt-51 d-flex justify-content-between" role="toolbar">  
	        <div className="delt">
	        <button 
	        type="button" 
	        onClick={() => deleteDataHall()}
	        className="btn btn-outline-primary mr_1 red_color">
	        	<img src="\images\trash-2.svg" style={{width: "11px", marginTop: "-0.188rem",marginRight:"0.5rem"}} /> 
	        	Delete
	        </button>
	        </div>  
	        <div className="usr_cncl" >
	        	<button 
	        	type="button" 
	        	onClick={closeModal}  
	        	style={{marginRight:'1rem'}}
	        	className="btn btn-outline-primary">
	        	 	Cancel 
	        	</button>


		       {isLoading?(
                <button 
                type="button" 
                className="btn btn-primary"> Loading ... </button>
                ):(
                <button 
                type="button" 
                onClick={() => onSubmit(props.data_center_id)}
                className="btn btn-primary"> Save </button>
                )}
	        </div> 
        </div>
        </form>
    </div>
</div>
</div>												
</div>
</div>
</div>
</div>
    )

}

export default EditDataHall;


