import React,{useEffect,useState,useContext,useRef} from 'react';
import AuthContext from "context";
import { XError } from 'components/common';
import Swal from 'sweetalert2'
import Floors from "services/floorServices" 
import Modal from 'react-modal';
import Common from "services/commonService";
import {numberFormat} from "common/helpers";

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
    const [statusData,setStatusData] = useState([]);
    const [dataState,setDataState] = useState({
    	design_power:0,
    	design_cabs:0,
    	design_cages:0,
    	sold_power:0,
    	sold_cabs:0,
    	sold_cages:0,
    	reserved_power:0,
    	reserved_cabs:0,
    	reserved_cages:0,
    	rofr_power:0,
    	rofr_cabs:0,
    	rofr_cages:0,
    	blocked_power:0,
    	blocked_cabs:0,
    	blocked_cages:0
    });

    const [state,setState] = useState({
        floor_id:"",
		name:"",
		status:""
	});
    const [error,setError] = useState({
		name:"",
		status:""
	});

	useEffect(() => {

		Common.status().then(res => setStatusData(res.data.data));
        setIsOpen(props.show);
        setState({
            floor_id: props.floor_data.id,
            name: props.floor_data.name,
			status:props.floor_data.status,
        });
        calculateDataHall();
        
        //props.selectDataCenterFloor(props.data_center_id);

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
				
				authContext.setFloor(newData);

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
			/*soldCabinet:"",
			cabinet:"",
			kva:"",
			cages:"",
			soldCages:"",
			soldkva:"",*/
			status:""
		};
		
		const { 
			name,
			/*soldCabinet,
			cabinet,
			kva,
			cages,
			soldCages,
			soldkva,*/
			status
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
       /* if (cabinet === "" || cabinet === null || cabinet === undefined) {

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
*/
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

	const calculateDataHall = () => {

		const data = props.floor_data.data_halls.reduce(
        	({
        		preTotalCabs,
        		preTotalCage,
        		preTotalPower,
        		preSoldCabs,
        		preSoldCage,
        		preSoldPower,
        		preReservedCabs,
        		preReservedCage,
        		preReservedPower,
        		preROFRCabs,
        		preROFRCage,
        		preROFRPower,
        		preBlockedCabs,
        		preBlockedCage,
        		preBlockedPower
        	},{
        		design_power,
	    		design_cabs,
	    		design_cages,
	    		sold_power,
	    		sold_cabs,
	    		sold_cages,
	    		reserved_power,
	    		reserved_cabs,
	    		reserved_cages,
	    		rofr_power,
	    		rofr_cabs,
	    		rofr_cages,
	    		blocked_power,
	    		blocked_cabs,
	    		blocked_cages
	    	}) => {
        		return {
        			design_power: Number(preTotalPower) + Number(design_power),
			    	design_cabs: Number(preTotalCabs) + Number(design_cabs),
			    	design_cages: Number(preTotalCage) + Number(design_cages),
			    	sold_power: Number(preSoldPower) + Number(sold_power),
			    	sold_cabs: Number(preSoldCabs) + Number(sold_cabs),
			    	sold_cages: Number(preSoldCage) + Number(sold_cages),
			    	reserved_power: Number(preReservedPower) + Number(reserved_power),
			    	reserved_cabs: Number(preReservedCabs) + Number(reserved_cabs),
			    	reserved_cages: Number(preReservedCage) + Number(reserved_cages),
			    	rofr_power: Number(preROFRPower) + Number(rofr_power),
			    	rofr_cabs: Number(preROFRCabs) + Number(rofr_cabs),
			    	rofr_cages: Number(preROFRCage) + Number(rofr_cages),
			    	blocked_power: Number(preBlockedPower) + Number(blocked_power),
			    	blocked_cabs: Number(preBlockedCabs) + Number(blocked_cabs),
			    	blocked_cages: Number(preBlockedCage) + Number(blocked_cages)
        		}
        	},
        	{
        		preTotalCabs: 0,
        		preTotalCage: 0,
        		preTotalPower: 0,
        		preSoldCabs: 0,
        		preSoldCage: 0,
        		preSoldPower: 0,
        		preReservedCabs: 0,
        		preReservedCage: 0,
        		preReservedPower: 0,
        		preROFRCabs: 0,
        		preROFRCage: 0,
        		preROFRPower: 0,
        		preBlockedCabs: 0,
        		preBlockedCage: 0,
        		preBlockedPower: 0
        	}
        );

		setDataState({...data})
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
                			<td>{numberFormat(dataState.design_cabs)}</td>
                			<td>{numberFormat(dataState.design_cages)}</td>
                			<td>{numberFormat(dataState.design_power,3)}</td>
                		</tr>
                		<tr>
                			<td>Sold: </td>
                			<td>{numberFormat(dataState.sold_cabs)}</td>
                			<td>{numberFormat(dataState.sold_cages)}</td>
                			<td>{numberFormat(dataState.sold_power,3)}</td>
                		</tr> 
                		<tr>
                			<td>Reserved: </td>
                			<td>{numberFormat(dataState.reserved_cabs)}</td>
                			<td>{numberFormat(dataState.reserved_cages)}</td>
                			<td>{numberFormat(dataState.reserved_power,3)}</td>
                		</tr> 
                		<tr>
                			<td>ROFR: </td>
                			<td>{numberFormat(dataState.rofr_cabs)}</td>
                			<td>{numberFormat(dataState.rofr_cages)}</td>
                			<td>{numberFormat(dataState.rofr_power,3)}</td>
                		</tr> 
                		<tr>
                			<td>Blocked: </td>
                			<td>{numberFormat(dataState.blocked_cabs)}</td>
                			<td>{numberFormat(dataState.blocked_cages)}</td>
                			<td>{numberFormat(dataState.blocked_power,3)}</td>
                		</tr> 
                	</tbody>
                </table>
            </div>									
        </div>
        
        {/*<div className="row">
            <div className="mb-3 col-md-6 mt-2313">
                <label className="form-label"> Total Cabinets <small className="text-danger">*</small></label>
               <input 
                className="form-control" 
                type="number"
                maxLength={9}
                placeholder="# of Cabinets"
                defaultValue={state.cabinet}
                style={{border:"oldlace"}}
                readOnly
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
                defaultValue={state.soldCabinet}
                style={{border:"oldlace"}}
                readOnly
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
                defaultValue={state.cages}
                style={{border:"oldlace"}}
                readOnly
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
                defaultValue={state.soldCages}
                style={{border:"oldlace"}}
                readOnly
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
                placeholder="# of kWs" 
                defaultValue={state.kva}
                style={{border:"oldlace"}}
                //onInput={(event) => fnValidate(event)}
                //onChange={(event) => validatePower(event)}
                readOnly
                
                />
                <XError message={error.kva} />
            </div>	*/}
			{/*<div className="mb-3 col-md-6 mt-2313">
                <label className="form-label"> Sold kWs <small className="text-danger hide">*</small></label>
                <input 
                className="form-control" 
                type="number"
                maxLength={9}
                placeholder="Sold kWs"
                defaultValue={state.soldkva}
                style={{border:"oldlace"}}
                readOnly
               
                />
                <XError message={error.soldkva} />
            </div>								
        </div>*/}
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


