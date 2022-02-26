import React,{useEffect,useState,useContext,useRef} from 'react';
import  AuthContext from "context";
import { XError } from 'components/common';
import Swal from 'sweetalert2'
import DataHall from "services/dataHallServices"

const CreateDataHall = (props) => {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const modalRef = useRef(null);
	const authContext = useContext(AuthContext);
    const [isLoading,setIsLoading] = useState(false);

    const [state,setState] = useState({
        floor_id:"",
		name:"",
        cabinet: "",
        power: "",
        soldCabinet:""
	});
    const [error,setError] = useState({
		floor_id:"",
		name:"",
        cabinet: "",
        power: "",
        soldCabinet:""
	});

	useEffect(() => {
        setIsOpen(props.show);
        setState({
            floor_id:"",
            name:"",
            cabinet: "",
            power: "",
            soldCabinet:""
        });

        return () => {
			//setCountries([]);
			//setDataCenters([]);
      		setState({}); 
    	};

	},[props.show]);


    const onSubmit = async (data) => {
        
       // setState({...state,data_center_id: props.data_center_id})
		setIsLoading(true);
		if(checkValidation()){
           // setState({...state,data_center_id:props.dataCenterId.id})
            
			await DataHall.addDataHall(authContext.getToken,{...state,floor_id: props.data_hall.id}).then(res => {
				
				setIsLoading(false);
            
				props.selectDataCenterFloor(props.data_center_id, props.floorIndex);
                //props.setFloorIndex(props.floorIndex)
				closeModal();
				Swal.fire('New Data Hall Created');
                //props.selectDataCenterFloor(props.dataCenterId)

			}).catch(err => {

				setIsLoading(false);
				let error = {
					"floor_id":"",
                    "name":"",
                    "cabinet": "",
                    "power": "",
                    "soldCabinet":""
				};
				const errors = err?.response?.data?.errors;

				if(errors?.name !== undefined || errors?.name !== "" || errors?.name !== null){
					error.name = errors.name;
				}
                if(errors?.cabinet !== undefined || errors?.cabinet !== "" || errors?.cabinet !== null){
					error.cabinet = errors.cabinet;
				}
				if(errors?.soldCabinet !== undefined || errors?.soldCabinet !== "" || errors?.soldCabinet !== null){
					error.soldCabinet = errors.soldCabinet;
				}
                if(errors?.power !== undefined || errors?.power !== "" || errors?.power !== null){
					error.power = errors.power;
				}
				

				setError({...error});
			})
		}
	}

    const checkValidation = () => {

		let error = {
			"name":"",
            "cabinet": "",
            "power": "",
            "soldCabinet":""
		};
		
		const { 
			name,
            cabinet,
            power,
            soldCabinet
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
        if (soldCabinet === "" || soldCabinet === null || soldCabinet === undefined) {

			error.soldCabinet = "The sold cabinet field is required.";
			flag = false;
        }
        if (power === "" || power === null || power === undefined) {

			error.power = "The power field is required.";
			flag = false;
        }
		setError({...error});
		return true;
	}

    const closeModal = () => {

		setState({
			floor_id:"",
            name:"",
            cabinet: "",
            power: "",
            soldCabinet:""
		});
		setError({
			floor_id:"",
            name:"",
            cabinet: "",
            power: "",
            soldCabinet:""
		})

		modalRef.current.click();
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
        <div className="modal fade" id="exampleModalCenter">
<div className="modal-dialog modal-lg">
<div className="modal-content">
<div className="modal-header mt-59">
<h3 className="modal-title"> Add Data Hall </h3>
<button type="button" className="btn-close" data-bs-dismiss="modal" ref={modalRef}> </button></div>
<div className="modal-body">
<div className="card">
<div className="card-body">
    <div className="basic-form">
        <form>
        <div className="row">
            <div className="mb-3 col-md-12 mt-2313">
                <label className="form-label"> Name <small className="text-danger">*</small></label>
                <input 
                type="text" 
                maxLength={45}
                className="form-control" 
                placeholder="Name of Data Hall" 
                value={state.name}
                onChange={event => setState({...state,name:event.target.value})}/>
                <XError message={error.name} />
            </div>									
        </div>
        <div className="row">
            <div className="mb-3 col-md-12 mt-2313">
                <label className="form-label"> Total Cabinets <small className="text-danger">*</small></label>
    
                <input 
                className="form-control" 
                type="number"
                maxLength={9}
                placeholder="Total Cabinets"
                value={state.cabinet}
                onChange={event => setState({
                	...state,
                	cabinet:event.target.value.length<=9?event.target.value.replace(/[^\d]/,''):state.cabinet.replace(/[^\d]/,'')
                })}
                />
                <XError message={error.cabinet} />
            </div>									
        </div>
           <div className="row">
            <div className="mb-3 col-md-12 mt-2313">
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
        </div>
        <div className="row">
            <div className="mb-3 col-md-12 mt-2313">
                <label className="form-label"> Number of kWs <small className="text-danger">*</small></label>
                <input
                type="number"
                min="0.00000" 
                step="0.00001"
                maxLength="11"
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
        
      

        <div className="toolbar toolbar-bottom mt-51 d-flex justify-content-between" role="toolbar">  
	        <div className="delt">
	        {/*<button type="button" className="btn btn-outline-primary mr_1 red_color">
	        	<img src="\images\trash-2.svg" style={{width: "11px", marginTop: "-0.188rem"}} /> 
	        	Delete
	        </button>*/}
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

export default CreateDataHall;


