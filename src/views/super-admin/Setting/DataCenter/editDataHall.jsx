import React,{useEffect,useState,useContext,useRef} from 'react';
import AuthContext from "context";
import { XError } from 'components/common';
import Swal from 'sweetalert2'
import DataHall from "services/dataHallServices"
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

const EditDataHall = (props) => {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const modalRef = useRef(null);
	const authContext = useContext(AuthContext);
    const [isLoading,setIsLoading] = useState(false);
	const [statusData,setStatusData] = useState([]);

    const [state,setState] = useState({
        data_hall_id:"",
		name:"",
        design_cabs: "",
        design_cages: "",
        design_power:"",
		sold_power:"",
		sold_cabs:"",
		sold_cages:"",
		reserved_power:"",
		reserved_cabs:"",
		reserved_cages:"",
		rofr_power:"",
		rofr_cabs:"",
		rofr_cages:"",
		blocked_power:"",
		blocked_cabs:"",
		blocked_cages:"",
		status:""
	});
    const [error,setError] = useState({
		name:"",
        design_cabs: "",
        design_cages: "",
        design_power:"",
		sold_power:"",
		sold_cabs:"",
		sold_cages:"",
		reserved_power:"",
		reserved_cabs:"",
		reserved_cages:"",
		rofr_power:"",
		rofr_cabs:"",
		rofr_cages:"",
		blocked_power:"",
		blocked_cabs:"",
		blocked_cages:"",
		status:""
	});

	useEffect(() => {
		Common.status().then(res => setStatusData(res.data.data));
        setIsOpen(props.show);
        setState({
            data_hall_id:props.editDataHall.id,
            name:props.editDataHall.name,
            design_cabs: props.editDataHall.design_cabs,
			design_cages:props.editDataHall.design_cages,
            design_power: props.editDataHall.design_power,
            sold_cabs: props.editDataHall.sold_cabs,
			sold_cages:props.editDataHall.sold_cages,
			sold_power:props.editDataHall.sold_power,
			reserved_cabs:props.editDataHall.reserved_cabs,
			reserved_cages:props.editDataHall.reserved_cages,
			reserved_power:props.editDataHall.reserved_power,
			rofr_cabs:props.editDataHall.rofr_cabs,
			rofr_cages:props.editDataHall.rofr_cages,
			rofr_power:props.editDataHall.rofr_power,
			blocked_cabs:props.editDataHall.blocked_cabs,
			blocked_cages:props.editDataHall.blocked_cages,
			blocked_power:props.editDataHall.blocked_power,
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

		    await DataHall.deleteDataHall(authContext.getToken,{
		    	...state,
		    	data_hall_id: props.editDataHall.id
		    }).then(async res => {
				
				setIsLoading(false);
               	let data = authContext.getFloor
				let newData = data.map(floor => {

					if(floor.id === res?.data?.data?.id){
						return res.data.data;
					}
					return floor;
				});
				
				await authContext.setFloor(newData);
				
				closeModal();

			}).catch(err => {

				setIsLoading(false);
				let error = {
					floor_id:"",
                    name:"",
                    design_cabs: "",
			        design_cages: "",
			        design_power:"",
					sold_power:"",
					sold_cabs:"",
					sold_cages:"",
					reserved_power:"",
					reserved_cabs:"",
					reserved_cages:"",
					rofr_power:"",
					rofr_cabs:"",
					rofr_cages:"",
					blocked_power:"",
					blocked_cabs:"",
					blocked_cages:"",
					status:""
				};
				const errors = err?.response?.data?.errors;

				if(errors?.name !== undefined || errors?.name !== "" || errors?.name !== null){
					error.name = errors.name;
				}
                if(errors?.design_cabs !== undefined || errors?.design_cabs !== "" || errors?.design_cabs !== null){
					error.design_cabs = errors.design_cabs;
				}
                if(errors?.design_power !== undefined || errors?.design_power !== "" || errors?.design_power !== null){
					error.design_power = errors.design_power;
				}
				if(errors?.design_cages !== undefined || errors?.design_cages !== "" || errors?.design_cages !== null){
					error.design_cages = errors.design_cages;
				}
				if(errors?.sold_cabs !== undefined || errors?.sold_cabs !== "" || errors?.sold_cabs !== null){
					error.sold_cabs = errors.sold_cabs;
				}
				if(errors?.sold_power !== undefined || errors?.sold_power !== "" || errors?.sold_power !== null){
					error.sold_power = errors.sold_power;
				}
				if(errors?.sold_cages !== undefined || errors?.sold_cages !== "" || errors?.sold_cages !== null){
					error.sold_cages = errors.sold_cages;
				}
				if(errors?.reserved_power !== undefined || errors?.reserved_power !== "" || errors?.reserved_power !== null){
					error.reserved_power = errors.reserved_power;
				}
				if(errors?.reserved_cabs !== undefined || errors?.reserved_cabs !== "" || errors?.reserved_cabs !== null){
					error.reserved_cabs = errors.reserved_cabs;
				}
				if(errors?.reserved_cages !== undefined || errors?.reserved_cages !== "" || errors?.reserved_cages !== null){
					error.reserved_cages = errors.reserved_cages;
				}
				if(errors?.rofr_power !== undefined || errors?.rofr_power !== "" || errors?.rofr_power !== null){
					error.rofr_power = errors.rofr_power;
				}
				if(errors?.rofr_cabs !== undefined || errors?.rofr_cabs !== "" || errors?.rofr_cabs !== null){
					error.rofr_cabs = errors.rofr_cabs;
				}
				if(errors?.rofr_cages !== undefined || errors?.rofr_cages !== "" || errors?.rofr_cages !== null){
					error.rofr_cages = errors.rofr_cages;
				}
				if(errors?.blocked_power !== undefined || errors?.blocked_power !== "" || errors?.blocked_power !== null){
					error.blocked_power = errors.blocked_power;
				}
				if(errors?.blocked_cabs !== undefined || errors?.blocked_cabs !== "" || errors?.blocked_cabs !== null){
					error.blocked_cabs = errors.blocked_cabs;
				}
				if(errors?.blocked_cages !== undefined || errors?.blocked_cages !== "" || errors?.blocked_cages !== null){
					error.blocked_cages = errors.blocked_cages;
				}
			})
		  }
		})
		
	}

    const onSubmit = async (data) => {


        setIsLoading(true);
		if(checkValidation()){
           setState({...state,data_hall_id:props.editDataHall.id})
            
			await DataHall.updateDataHall(authContext.getToken,{...state,data_hall_id: props.editDataHall.id}).then(async res => {
				
				setIsLoading(false);

				let data = authContext.getFloor
				let newData = data.map(floor => {

					if(floor.id === res?.data?.data?.id){
						return res.data.data;
					}
					return floor;
				});
				
				await authContext.setFloor(newData);
                
				//props.selectDataCenterFloor(props.data_center_id, props.floorIndex);
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
					"soldkva":"",
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
				// if(errors?.soldCabinet !== undefined || errors?.soldCabinet !== "" || errors?.soldCabinet !== null){
				// 	error.soldCabinet = errors.soldCabinet;
				// }
				if(errors?.cages !== undefined || errors?.cages !== "" || errors?.cages !== null){
					error.cages = errors.cages;
				 }
				// if(errors?.soldCages !== undefined || errors?.soldCages !== "" || errors?.soldCages !== null){
				// 	error.soldCages = errors.soldCages;
				// }

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
			"soldkva":"",
			"status":""
		};
		
		const { 
			name,
            cabinet,
            power,
            soldCabinet,
			cages,
			soldCages,
			soldkva,
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
        // if (soldCabinet === "" || soldCabinet === null || soldCabinet === undefined) {

		// 	error.soldCabinet = "The soldCabinet field is required.";
		// 	flag = false;
        // }
		if (cages === "" || cages === null || cages === undefined) {

			error.cages = "The cages field is required.";
			flag = false;
        }
		// if (soldCages === "" || soldCages === null || soldCages === undefined) {

		// 	error.soldCages = "The soldCages field is required.";
		// 	flag = false;
        // }
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
     {/*   <div className="row">
            <div className="mb-3 col-md-6 mt-2313">
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
            <div className="mb-3 col-md-6 mt-2313">
                <label className="form-label"> Sold Cabinets <small className="text-danger hide">*</small></label>
    
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
                <label className="form-label"> Sold Cages <small className="text-danger hide">*</small></label>
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
        </div>*/}
   {/*     <div className="row">
            <div className="mb-3 col-md-6 mt-2313">
                <label className="form-label"> Total kWs <small className="text-danger">*</small></label>
                
                <input
                type="number"
                min="0.00000" 
                step="0.00001"
                maxLength="11"
                className="form-control" 
                placeholder="# of kWs" 
                value={state.power} 
                onChange={(event) => validatePower(event)}
                //onChange={event => setState({...state,power:event.target.value})}
                />

                <XError message={error.power} />
            </div>	
			<div className="mb-3 col-md-6 mt-2313">
                <label className="form-label"> Sold kWs <small className="text-danger hide">*</small></label>
                <input 
                className="form-control" 
                type="number"
                maxLength={9}
                placeholder="Sold kWs"
                value={state.soldkva}
                onChange={(event) => validateSoldPower(event)}
                />
                <XError message={error.soldkva} />
            </div>								
        </div>*/}
        <div className="row">
            <div className="mb-3 col-md-12 mt-2313 dt_td">
                <table>
                	<thead>
	                	<tr style={{borderBottom:"2px solid black"}}>
	                		<th></th>
	                		<th style={{fontWeight:"bold",color:"black"}}>CabEs</th>
	                		<th style={{fontWeight:"bold",color:"black"}}>Cages</th>
	                		<th style={{fontWeight:"bold",color:"black"}}>kWs</th>
	                	</tr>
                	</thead>
                	<tbody>
                		<tr>
                			<td>Total: </td>
                			<td>
                				<input 
                				type="text"
                				value={state?.design_cabs || ""}
                				onChange={({target}) => setState({
                					...state,
                					design_cabs:target.value
                				})} />
                			</td>
                			<td>
                				<input 
                				type="text" 
                				value={state?.design_cages || ""}
                				onChange={({target}) => setState({
                					...state,
                					design_cages:target.value
                				})} />
                			</td>
                			<td>
                				<input 
                				type="text" 
                				value={state?.design_power || ""}
                				onChange={({target}) => setState({
                					...state,
                					design_power:target.value
                				})} />
                			</td>
                		</tr>
                		<tr>
                			<td>Sold: </td>
                			<td>
                				<input 
                				type="text" 
                				value={state?.sold_cabs || ""}
                				onChange={({target}) => setState({
                					...state,
                					sold_cabs:target.value
                				})} />
                			</td>
                			<td>
                				<input 
                				type="text" 
                				value={state?.sold_cages || ""}
                				onChange={({target}) => setState({
                					...state,
                					sold_cages:target.value
                				})} />
                			</td>
                			<td>
                				<input 
                				type="text" 
                				value={state?.sold_power || ""}
                				onChange={({target}) => setState({
                					...state,
                					sold_power:target.value
                				})} />
                			</td>
                		</tr> 
                		<tr>
                			<td>Reserved: </td>
                			<td>
                				<input 
                				type="text" 
                				value={state?.reserved_cabs || ""}
                				onChange={({target}) => setState({
                					...state,
                					reserved_cabs:target.value
                				})} />
                			</td>
                			<td>
                				<input 
                				type="text" 
                				value={state?.reserved_cages || ""}
                				onChange={({target}) => setState({
                					...state,
                					reserved_cages:target.value
                				})} />
                			</td>
                			<td>
                				<input 
                				type="text" 
                				value={state?.reserved_power || ""}
                				onChange={({target}) => setState({
                					...state,
                					reserved_power:target.value
                				})} />
                			</td>
                		</tr> 
                		<tr>
                			<td>ROFR: </td>
                			<td>
                				<input 
                				type="text" 
                				value={state?.rofr_cabs || ""}
                				onChange={({target}) => setState({
                					...state,
                					rofr_cabs:target.value
                				})} />
                			</td>
                			<td>
                				<input 
                				type="text" 
                				value={state?.rofr_cages || ""}
                				onChange={({target}) => setState({
                					...state,
                					rofr_cages:target.value
                				})} />
                			</td>
                			<td>
                				<input 
                				type="text" 
                				value={state?.rofr_power || ""}
                				onChange={({target}) => setState({
                					...state,
                					rofr_power:target.value
                				})} />
                			</td>
                		</tr> 
                		<tr>
                			<td>Blocked: </td>
                			<td>
                				<input 
                				type="text" 
                				value={state?.blocked_cabs || ""}
                				onChange={({target}) => setState({
                					...state,
                					blocked_cabs:target.value
                				})} />
                			</td>
                			<td>
                				<input 
                				type="text" 
                				value={state?.blocked_cages || ""}
                				onChange={({target}) => setState({
                					...state,
                					blocked_cages:target.value
                				})} />
                			</td>
                			<td>
                				<input 
                				type="text" 
                				value={state?.blocked_power || ""}
                				onChange={({target}) => setState({
                					...state,
                					blocked_power:target.value
                				})} />
                			</td>
                		</tr> 
                	</tbody>
                </table>
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


