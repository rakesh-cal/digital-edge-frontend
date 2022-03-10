import React,{useEffect,useState,useContext,useRef} from 'react';
import AuthContext from "context";
import { XError } from 'components/common';
import Swal from 'sweetalert2'
import Floors from "services/floorServices" 
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

const EditFloor = (props) => {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const modalRef = useRef(null);
	const authContext = useContext(AuthContext);
    const [isLoading,setIsLoading] = useState(false);

    const [state,setState] = useState({
        floor_id:"",
		name:"",
		soldCabinet:"",
		cabinet:"",
		cages:"",
		soldCages:"",
		status:"",
		kva:"",
		soldkva:""
	});
    const [error,setError] = useState({
		name:"",
		soldCabinet:"",
		cabinet:"",
		cages:"",
		soldCages:"",
		status:"",
		kva:"",
		soldkva:""
	});

	useEffect(() => {
        setIsOpen(props.show);
        setState({
            floor_id: props.floor_data.id,
            name: props.floor_data.name,
			cabinet: props.floor_data.design_cabs,
			kva: props.floor_data.design_power,
			soldCabinet: props.floor_data.sold_cabs,
			cages:props.floor_data.design_cages,
			soldCages:props.floor_data.sold_cages,
			soldkva:props.floor_data.sold_power,
			status:props.floor_data.status,
        });
        props.selectDataCenterFloor(props.data_center_id);

        return () => {
			//setCountries([]);
			//setDataCenters([]);
      		setState({}); 
    	};

	},[props.show]);

    const deleteFloor = async () => {

		closeModal();


		Swal.fire({
		  	title: 'Are you sure?',
		  	text: "You won't be able to revert this!",
		  	icon: 'warning',
		  	showCancelButton: true,
		  	cancelButtonColor: '#d33',
		  	confirmButtonText: 'Yes, delete it!'
		}).then(async (result) => {
		  if (result.isConfirmed) {

		    setState({...state,floor_id:props.floor_data.id})
            
			await Floors.deleteFloor(authContext.getToken,{...state,floor_id: props.floor_data.id}).then(async res => {
				
				let data = authContext.getFloor
				let newData = data.filter(floor => floor.id !== props.floor_data.id);
				
				await authContext.setFloor(newData);

			//	props.selectDataCenterFloor(props.data_center_id);
				closeModal();
				//Swal.fire('Floor Deleted');
                //props.selectDataCenterFloor(props.dataCenterId)

			}).catch(err => {

				let error = {
					"floor_id":"",
				};
				const errors = err?.response?.data?.errors;

				if(errors?.floor_id !== undefined || errors?.floor_id !== "" || errors?.floor_id !== null){
					error.floor_id = errors.floor_id;
				}
				

				setError({...error});
			})
		  }
		})
		
	}

    const onSubmit = async () => {
       // setState({...state,data_center_id: props.data_center_id})
		setIsLoading(true);
		if(checkValidation()){
           setState({...state,floor_id:props.floor_data.id})
            
			await Floors.updateFloor(authContext.getToken,{...state,floor_id: props.floor_data.id}).then(async res => {
				
				setIsLoading(false);

				let data = authContext.getFloor
				let newData = data.map(floor => {

					if(floor.id === props.floor_data.id){
						return res.data.data;
					}
					return floor;
				});
				
				await authContext.setFloor(newData);

				//props.selectDataCenterFloor(props.data_center_id);
				closeModal();
				Swal.fire('Floor Updated');
                //props.selectDataCenterFloor(props.dataCenterId)

			}).catch(err => {

				setIsLoading(false);
				let error = {
					"name":"",
				};
				const errors = err?.response?.data?.errors;

				if(errors?.name !== undefined || errors?.name !== "" || errors?.name !== null){
					error.name = errors.name;
				}
				

				setError({...error});
			})
		}else{
			setIsLoading(false);
		}
	}

    const checkValidation = () => {

		let error = {
			"name":"",
			soldCabinet:"",
			cabinet:"",
			kva:"",
			cages:"",
			soldCages:"",
			status:"",
			soldkva:""
		};
		
		const { 
			name,
			soldCabinet,
			cabinet,
			kva,
			cages,
			soldCages,
			status,
			soldkva
		} = state;

		let flag = true;

		if (name === "" || name === null || name === undefined) {

			error.name = "The name field is required.";
			flag = false;
        }

        //  if (soldCabinet === "" || soldCabinet === null || soldCabinet === undefined) {

		// 	error.soldCabinet = "The data hall field is required.";
		// 	flag = false;
        // }
        if (cabinet === "" || cabinet === null || cabinet === undefined) {

			error.cabinet = "The cabinet field is required.";
			flag = false;
        }
		if (cages === "" || cages === null || cages === undefined) {

			error.cages = "The cages field is required.";
			flag = false;
        }
        if (kva === "" || kva === null || kva === undefined) {

			error.kva = "The kva field is required.";
			flag = false;
        }

		setError({...error});

		return flag;
	}

    const closeModal = () => {

		setIsOpen(false);
        props.setShow(false);
	}
	const validatePower = (e) => {  
		
		let t = e.target.value;
		let newValue = state.kva;

		if(t.toString().split(".")[0].length <= 6){

	  		newValue = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 6)) : t;
	  		setState({...state,kva:Number(newValue)})
		}

		
	}

	const validateSoldPower = (e) => {
		let t = e.target.value;
		let newValue = state.soldkva;

		let value = e.target.value.replace(/[^\d]/,'');

		if( Number(t) <= Number(state.kva)){
			setError({
				...error,
				soldkva:""
			});
			if(t.toString().split(".")[0].length <= 6){

				newValue = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 6)) : t;
				setState({...state,soldkva:Number(newValue)})
		  }
			
		}else{
			setError({
				...error,
				soldkva:"Sold kWs should not greater than total kWs"
			})
		}
	}

    return (
    	<div className="modal show bd-example-modal-lg"
    	style={{display:'block'}}
    	tabIndex="-1" role="dialog" aria-hidden="true">
<div className="modal-dialog modal-lg">
<div className="modal-content">
<div className="modal-header mt-59">
<h3 className="modal-title"> Edit Floor </h3>
<button type="button" className="btn-close" onClick={() => closeModal()}> </button></div>
<div className="modal-body">
<div className="card">
<div className="card-body" style={{padding:'0px'}}>
    <div className="basic-form">
        <form>
        <div className="row">
            <div className="mb-3 col-md-12 mt-2313">
                <label className="form-label"> Name <small className="text-danger">*</small></label>
                <input 
                type="text" 
                className="form-control" 
                placeholder="" 
                defaultValue={state.name} 
                onChange={event => setState({...state,name:event.target.value})}/>
                <XError message={error.name} />
            </div>									
        </div>
        
        <div className="row">
            <div className="mb-3 col-md-6 mt-2313">
                <label className="form-label"> Total Cabinets <small className="text-danger">*</small></label>
               <input 
                className="form-control" 
                type="number"
                maxLength={9}
                placeholder="# of Cabinets"
                value={state.cabinet}
                onChange={event => setState({
                	...state,
                	cabinet:event.target.value.length<=9?event.target.value:state.cabinet
                })}
                />
                <XError message={error.cabinet} />
            </div>									
        
            <div className="mb-3 col-md-6 mt-2313">
                <label className="form-label"> Sold Cabinets <small className="text-danger">*</small></label>
                <input 
                className="form-control" 
                type="number"
                maxLength={9}
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
                maxLength={9}
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
                maxLength={9}
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
            <div className="mb-3 col-md-6 mt-2313">
                <label className="form-label"> Total kWs <small className="text-danger">*</small></label>
                 <input 
                type="number"
                min="0.00000" 
                step="0.00001"
                maxLength="11"
                className="form-control" 
                type="number"
                placeholder="# of kWs" 
                value={state.kva}
                //onInput={(event) => fnValidate(event)}
                onChange={(event) => validatePower(event)}
                
                />
                <XError message={error.kva} />
            </div>	
			<div className="mb-3 col-md-6 mt-2313">
                <label className="form-label"> Sold kWs <small className="text-danger">*</small></label>
                <input 
                className="form-control" 
                type="number"
                maxLength={9}
                placeholder="Sold kWs"
                value={state.soldkva}
                onChange={(event) => validateSoldPower(event)/*{
                	let value = event.target.value.replace(/[^\d]/,'');

                	if( Number(value) <= Number(state.kva)){
                		setError({
							...error,
							soldkva:""
						});
	                	setState({
		                	...state,
		                	soldkva:event.target.value.length<=9?value:state.soldkva
	                	});
                	}else{
				        setError({
							...error,
							soldkva:"Sold kWs should not greater than total kWs"
						})
                	}
                }*/}
                />
                <XError message={error.soldkva} />
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
	        onClick={() => deleteFloor()}
	        style={{marginRight:'1rem'}}
	        className="btn btn-outline-primary red_color mr_1">
	        	<img src="\images\trash-2.svg" 
	        	style={{width: "11px", marginTop: "-0.188rem",marginRight:"0.5rem"}} /> 
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
	                onClick={() => onSubmit()}
	                className="btn btn-primary"> Save </button>
	                )
	            }
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

export default EditFloor;


