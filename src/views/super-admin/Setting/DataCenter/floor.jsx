import React,{useEffect,useState,useContext,useRef} from 'react';
import AuthContext from "context";
import { XError } from 'components/common';
import Swal from 'sweetalert2'
import Floors from "services/floorServices" 

const Floor = (props) => {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const modalRef = useRef(null);
	const authContext = useContext(AuthContext);
    const [isLoading,setIsLoading] = useState(false);

    const [state,setState] = useState({
		name:"",
		cabinet:"",
		kva:"",
		soldCabinet:""
	});

    const [error,setError] = useState({
		name:"",
		cabinet:"",
		kva:"",
		soldCabinet:""
	});

	useEffect(() => {

        setIsOpen(props.show);
        setState({
            name:"",
			cabinet:"",
			kva:"",
			soldCabinet:""
        });

        return () => {
			//setCountries([]);
			//setDataCenters([]);
      		setState({}); 
    	};

	},[props.show]);


    const onSubmit = async (data) => {
        
		setIsLoading(true);
		if(checkValidation()){

			await Floors.addFloor(authContext.getToken,
				{...state,
					data_center_id: props.data_center_id.id
				}).then(res => {
				
				setIsLoading(false);
				props.selectDataCenterFloor(props.data_center_id);
				closeModal();
				Swal.fire('New Floor Created');

			}).catch(err => {

				setIsLoading(false);
				let error = {
					name:"",
					cabinet:"",
					kva:""
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
			name:"",
			cabinet:"",
			kva:"",
			soldCabinet:""
		};
		
		const { 
			name,
			dataHall,
			cabinet,
			kva,
			soldCabinet
		} = state;

		let flag = true;

		if (name === "" || name === null || name === undefined) {

			error.name = "The name field is required.";
			flag = false;
        }
        // if (dataHall === "" || dataHall === null || dataHall === undefined) {

		// 	error.dataHall = "The data hall field is required.";
		// 	flag = false;
        // }
        if (cabinet === "" || cabinet === null || cabinet === undefined) {

			error.cabinet = "The cabinet field is required.";
			flag = false;
        }
        if (soldCabinet === "" || soldCabinet === null || soldCabinet === undefined) {

			error.soldCabinet = "The sold cabinet field is required.";
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

		setState({
			name:"",
			cabinet:"",
			kva:"",
			soldCabinet:""
		});
		setError({
			name:"",
			cabinet:"",
			kva:"",
			soldCabinet:""
		})

		modalRef.current.click();
	}
	const validatePower = (e) => {  
		
		let t = e.target.value;
		let newValue = state.kva;

		if(t.toString().split(".")[0].length <= 6){

	  		newValue = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 6)) : t;
	  		setState({...state,kva:Number(newValue)})
		}

		
	}

    return (
        <div className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog" aria-hidden="true">
			<div className="modal-dialog modal-lg">
			<div className="modal-content">
			<div className="modal-header mt-59">
			<h3 className="modal-title"> Add Floor </h3>
			<button type="button" className="btn-close" data-bs-dismiss="modal" ref={modalRef}> </button></div>
			<div className="modal-body">
			<div className="card">
			<div className="card-body" style={{padding:'0px'}}>
    <div className="basic-form">
        <form>
       
                                     
        <div className="row">
            <div className="mb-3 col-md-12 mt-2313">
                <label className="form-label"> Name of Floor <small className="text-danger">*</small></label>
                <input 
                type="text" 
                className="form-control" 
                value={state.name}
                placeholder="Name of Floor"
                onChange={event => setState({...state,name:event.target.value})}/>
                <XError message={error.name} />
            </div>									
        </div>

     {/*   <div className="row">
            <div className="mb-3 col-md-12 mt-2313">
                <label className="form-label"> Number of Data Halls </label>
                <input 
                type="text" 
                className="form-control"
                type="number"
                value={state.dataHall} 
                placeholder="# of Data Halls"
                name="name" onChange={event => setState({...state,dataHall:event.target.value})}/>
                <XError message={error.dataHall} />
            </div>									
        </div>*/}
        
        <div className="row">
            <div className="mb-3 col-md-12 mt-2313">
                <label className="form-label"> Total Cabinets <small className="text-danger">*</small></label>
                <input 
                className="form-control" 
                type="number"
                maxLength={9}
                placeholder="Total Cabinets"
                value={state.cabinet.replace(/[^\d]/,'')}
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
                value={state.soldCabinet.replace(/[^\d]/,'')}
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
                placeholder="Number of kWs" 
                value={state.kva}
                //onInput={(event) => fnValidate(event)}
                onChange={(event) => validatePower(event)}
                
                />
                <XError message={error.kva} />
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

export default Floor;


