import React,{useEffect,useState,useContext,useRef} from 'react';
import AuthContext from "context";
import { XError } from 'components/common';
import Swal from 'sweetalert2'
import Floors from "services/floorServices" 
import RoleServices from "services/roleServices"

const CreateDataCenter = (props) => {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const modalRef = useRef(null);
	const authContext = useContext(AuthContext);
    const [isLoading,setIsLoading] = useState(false);

    const [state,setState] = useState({
		name:"",
		status:""
	});

    const [error,setError] = useState({
		name:"",
		status:""
	});

	useEffect(() => {
        setIsOpen(props.show);
        setState({
            name:"",
			status: ""
        });

        return () => {
			//setCountries([]);
			//setDataCenters([]);
      		setState({}); 
    	};

	},[props.show]);


    const onSubmit = async (data) => {
        
        console.log(props.country)
		setIsLoading(true);
		if(checkValidation()){

			await RoleServices.createDataCenter(authContext.getToken,
				{...state,
					country_id: props.country
				}).then(res => {
				
				setIsLoading(false);
				//props.selectDataCenterFloor(props.data_center_id);
				closeModal();
				Swal.fire('New Data Center Created');

			}).catch(err => {

				setIsLoading(false);
				let error = {
					name:"",
					status: ""
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
			status: ""
		};
		
		const { 
			name,
			status
		} = state;

		let flag = true;

		if (name === "" || name === null || name === undefined) {

			error.name = "The name field is required.";
			flag = false;
        }
        

		setError({...error});
		return flag;
	}

    const closeModal = () => {

		setState({
			name:""
		});
		setError({
			name:""
		})

		modalRef.current.click();
	
	
    }
    return (
        <div className="modal fade bd-example-modal-lg2" tabIndex="-1" role="dialog" aria-hidden="true">
			<div className="modal-dialog modal-lg">
			<div className="modal-content">
			<div className="modal-header mt-59">
			<h3 className="modal-title"> Add Data Center </h3>
			<button type="button" className="btn-close" data-bs-dismiss="modal" ref={modalRef}> </button></div>
			<div className="modal-body">
			<div className="card">
			<div className="card-body" style={{padding:'0px'}}>
    <div className="basic-form">
        <form>
       
                                     
        <div className="row">
            <div className="mb-3 col-md-12 mt-2313">
                <label className="form-label"> Name of Data Center <small className="text-danger">*</small></label>
                <input 
                type="text" 
                className="form-control" 
                value={state.name}
                placeholder="Name of Data Center"
                onChange={event => setState({...state,name:event.target.value})}/>
                <XError message={error.name} />
            </div>									
        </div>

     
		<div className="row">
            <div className="mb-3 col-md-12 mt-2313">
                <label className="form-label"> Status <small className="text-danger">*</small></label>
                <select 
					onChange={event => {
						setState({
						...state,
						status:event.target.value
						});
					}}
					className="default-select form-control wide">
						
						<option value="1">In Service</option>
						<option value="2">Complete</option>
						<option value="3">Construction</option>
						<option value="4">Planning</option>
					</select>
                <XError message={error.status} />
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

export default CreateDataCenter;


