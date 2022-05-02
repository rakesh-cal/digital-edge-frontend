import React,{useEffect,useState,useContext,useRef} from 'react';
import AuthContext from "context";
import { XError } from 'components/common';
import Swal from 'sweetalert2'
import DataHall from "services/dataHallServices"
import CabinetService from 'services/CabinetService';
import Modal from 'react-modal';
import Common from "services/commonService";
import './capacityStyle.css';

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

const EditCabinet = (props) => {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const modalRef = useRef(null);
	const authContext = useContext(AuthContext);
    const [isLoading,setIsLoading] = useState(false);
	const [statusData,setStatusData] = useState([]);

    const [state,setState] = useState({
        cabinet_id:"",
		ref_name: "",
		customer:"",
        max_kws:"",
        sold_kws:"",
        num_breakers:"",
        num_xconnects:"",
		status:""
	});
    const [error,setError] = useState({
		
		status:""
	});

	useEffect(() => {
		console.log(props.selectedDataHall)
		Common.status().then(res => setStatusData(res.data.data));
        setIsOpen(props.show);
        setState({
            cabinet_id:props.editCabinets.id,
			ref_name: props.editCabinets.ref_name,
            customer:props.editCabinets.customer,
            max_kws:props.editCabinets.max_kw,
            sold_kws:props.editCabinets.sold_kw,
            num_breakers:props.editCabinets.num_breakers,
            num_xconnects:props.editCabinets.num_xconnects,
            status:props.editCabinets.status
        });

        return () => {
			//setCountries([]);
			//setDataCenters([]);
      		setState({}); 
    	};

	},[props.show]);

    
	// const deleteDataHall = async () => {

	// 	closeModal();

	// 	setState({...state,data_hall_id:props.editCabinets.id})
	// 	Swal.fire({
	// 	  	title: 'Are you sure?',
	// 	  	text: "You won't be able to revert this!",
	// 	  	icon: 'warning',
	// 	  	showCancelButton: true,
	// 	  	cancelButtonColor: '#d33',
	// 	  	confirmButtonText: 'Yes, delete it!'
	// 	}).then(async (result) => {
	// 	  if (result.isConfirmed) {

	// 	    await DataHall.deleteDataHall(authContext.getToken,{
	// 	    	...state,
	// 	    	data_hall_id: props.editCabinets.id
	// 	    }).then(async res => {
				
	// 			setIsLoading(false);
    //            	let data = authContext.getFloor
	// 			let newData = data.map(floor => {

	// 				if(floor.id === res?.data?.data?.id){
	// 					return res.data.data;
	// 				}
	// 				return floor;
	// 			});
				
	// 			await authContext.setFloor(newData);
				
	// 			closeModal();

	// 		}).catch(err => {

	// 			setIsLoading(false);
	// 			let error = {
	// 				cabinet_id:"",
    //                 customer:"",
    //                 max_kws:"",
    //                 sold_kws:"",
    //                 num_breakers:"",
    //                 num_xconnects:"",
    //                 status:""
	// 			};
	// 			const errors = err?.response?.data?.errors;

	// 			if(errors?.name !== undefined || errors?.name !== "" || errors?.name !== null){
	// 				error.name = errors.name;
	// 			}
	// 		})
	// 	  }
	// 	})
		
	// }

    const onSubmit = async (data) => {


        setIsLoading(true);
		if(checkValidation()){
           setState({...state,cabinet_id:props.editCabinets.id})
            
			await CabinetService.updateCabinets(authContext.getToken,{...state,cabinet_id: props.editCabinets.id}).then(async res => {
				
				setIsLoading(false);

				// let data = authContext.getFloor
				// let newData = data.map(floor => {

				// 	if(floor.id === res?.data?.data?.id){
				// 		return res.data.data;
				// 	}
				// 	return floor;
				// });
				
				// await authContext.setFloor(newData);
                props.getCabinetsData(props.selectedDataHall)
				//props.selectDataCenterFloor(props.data_center_id, props.floorIndex);
				closeModal();
				Swal.fire('Cabinet Updated');
                //props.selectDataCenterFloor(props.dataCenterId)

			}).catch(err => {

				setIsLoading(false);
				
				let error = {
					customer:"",
					max_kws:"",
					sold_kws:"",
					num_breakers:"",
					num_xconnects:"",
					status:""
				};
				const errors = err?.response?.data?.errors;

				if(errors?.customer !== undefined || errors?.customer !== "" || errors?.customer !== null){
					error.customer = errors.customer;
				}
               

			})
		}
	}

    const checkValidation = () => {

		let error = {
			customer:"",
			max_kws:"",
			sold_kws:"",
			num_breakers:"",
			num_xconnects:"",
			status:""
		};
		
		const { 
			customer,
			max_kws,
			sold_kws,
			num_breakers,
			num_xconnects,
			status
		} = state;

		let flag = true;

		if (customer === "" || customer === null || customer === undefined) {

			error.customer = "The customer field is required.";
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

	const validateSoldPower = (e) => {
		let t = e.target.value;
		let newValue = state.soldkva;

		let value = e.target.value.replace(/[^\d]/,'');

		if( Number(t) <= Number(state.power)){
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
    	<div className="modal show" style={{display:"block"}} id="exampleModalCenter">
<div className="modal-dialog modal-lg">
<div className="modal-content">
<div className="modal-header mt-59">
<h3 className="modal-title"> Edit Cabinets </h3>
<button type="button" className="btn-close" onClick={closeModal} > </button></div>
<div className="modal-body">
<div className="card">
<div className="card-body">
    <div className="basic-form">
        <form>
		<div className="row">
		<div className="mb-3 col-md-6 mt-2313">
                <label className="form-label"> Cabinet ID <small className="text-danger hide">*</small></label>
                <input 
                className="form-control" 
                type="number"
                placeholder="Cabinet ID"
				disabled
                value={state.cabinet_id} 
                />
            </div>
			<div className="mb-3 col-md-6 mt-2313">
			<label className="form-label"> Reference Name <small className="text-danger hide">*</small></label>
				<input 
				className="form-control" 
				type="text"
				placeholder="Reference Name"
				value={state.ref_name} onChange={event => setState({
                	...state,
                	ref_name:event.target.value
                })}
				/>
				<XError message={error.ref_name} />
            </div>									
        </div>
        <div className="row">
            <div className="mb-3 col-md-12 mt-2313">
                <label className="form-label"> Customer <small className="text-danger">*</small></label>
                <input type="text" className="form-control" placeholder="" value={state.customer} name="customer" onChange={event => setState({...state,customer:event.target.value})}/>
                <XError message={error.customer} />
            </div>									
        </div>
		<div className="row">
		<div className="mb-3 col-md-6 mt-2313">
                <label className="form-label"> Max kWs <small className="text-danger hide">*</small></label>
                <input 
                className="form-control" 
                type="number"
                maxLength={9}
                placeholder="Max kWs"
                value={state.max_kws} onChange={event => setState({
                	...state,
                	max_kws:event.target.value.length<=9?event.target.value:state.max_kws
                })}
                />
                <XError message={error.max_kws} />
            </div>
			<div className="mb-3 col-md-6 mt-2313">
			<label className="form-label"> Sold kWs <small className="text-danger hide">*</small></label>
				<input 
				className="form-control" 
				type="number"
				maxLength={9}
				placeholder="Sold kWs"
				value={state.sold_kws} onChange={event => setState({
                	...state,
                	sold_kws:event.target.value.length<=9?event.target.value:state.sold_kws
                })}
				/>
				<XError message={error.sold_kws} />
            </div>									
        </div>
		<div className="row">
		<div className="mb-3 col-md-6 mt-2313">
                <label className="form-label"> # Breakers <small className="text-danger hide">*</small></label>
                <input 
                className="form-control" 
                type="number"
                maxLength={9}
                placeholder="# Breakers"
                value={state.num_breakers} onChange={event => setState({
                	...state,
                	num_breakers:event.target.value.length<=9?event.target.value:state.num_breakers
                })}
                />
                <XError message={error.num_breakers} />
            </div>
			<div className="mb-3 col-md-6 mt-2313">
			<label className="form-label"> # X-Connects <small className="text-danger hide">*</small></label>
				<input 
				className="form-control" 
				type="number"
				maxLength={9}
				placeholder="# X-Connects"
				value={state.num_xconnects} onChange={event => setState({
                	...state,
                	num_xconnects:event.target.value.length<=9?event.target.value:state.num_xconnects
                })}
				/>
				<XError message={error.num_xconnects} />
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
						
						{statusData && statusData.map(status => {
							return (
								<option value={status.id} key={status.id} >{status.name}</option>
							)
						})}
					</select>
                <XError message={error.status} />
            </div>									
        </div>
        
         <div className="toolbar toolbar-bottom mt-51 d-flex justify-content-between" role="toolbar">  
	        {/* <div className="delt">
	        <button 
	        type="button" 
	        onClick={() => deleteDataHall()}
	        className="btn btn-outline-primary mr_1 red_color">
	        	<img src="\images\trash-2.svg" style={{width: "11px", marginTop: "-0.188rem",marginRight:"0.5rem"}} /> 
	        	Delete
	        </button>
	        </div>   */}
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

export default EditCabinet;


