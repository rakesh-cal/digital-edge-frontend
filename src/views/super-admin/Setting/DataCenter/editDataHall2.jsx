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
        power: ""
	});
    const [error,setError] = useState({
		name:"",
        cabinet: "",
        power: ""
	});

	useEffect(() => {
        setIsOpen(props.show);
        setState({
            data_hall_id:props.editDataHall.id,
            name:props.editDataHall.name,
            cabinet: props.editDataHall.design_power,
            power: props.editDataHall.design_cabs
        });

        return () => {
			//setCountries([]);
			//setDataCenters([]);
      		setState({}); 
    	};

	},[props.show]);

    const deleteDataHall = async (data) => {


        setIsLoading(true);
		if(checkValidation()){
           setState({...state,data_hall_id:props.editDataHall.id})
           
			await DataHall.deleteDataHall(authContext.getToken,{...state,data_hall_id: props.editDataHall.id}).then(res => {
				
				setIsLoading(false);
                
				props.selectDataCenterFloor(props.data_center_id, props.floorIndex);
				closeModal();
				Swal.fire('Floor Deleted');
                //props.selectDataCenterFloor(props.dataCenterId)

			}).catch(err => {

				setIsLoading(false);
				let error = {
					"floor_id":"",
                    "name":"",
                    "cabinet": "",
                    "power": ""
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
			})
		}
	}

    const onSubmit = async (data) => {


        setIsLoading(true);
		if(checkValidation()){
           setState({...state,data_hall_id:props.editDataHall.id})
            
			await DataHall.updateDataHall(authContext.getToken,{...state,data_hall_id: props.editDataHall.id}).then(res => {
				
				setIsLoading(false);
                
				props.selectDataCenterFloor(props.data_center_id, props.floorIndex);
				closeModal();
				Swal.fire('Floor Updated');
                //props.selectDataCenterFloor(props.dataCenterId)

			}).catch(err => {

				setIsLoading(false);
				let error = {
					"floor_id":"",
                    "name":"",
                    "cabinet": "",
                    "power": ""
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
			})
		}
	}

    const checkValidation = () => {

		let error = {
			"name":"",
            "cabinet": "",
            "power": ""
		};
		
		const { 
			name,
            cabinet,
            power
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
		setError({...error});
		return true;
	}

    const closeModal = () => {

		setIsOpen(false);
        props.setShow(false);
	}

    return (

<div>
      
      <Modal
      
        isOpen={modalIsOpen}
        style={customStyles}
        ariaHideApp={false}
      >
<div className="modal-header">
<h3 className="modal-title"> Edit Data Hall </h3>
<button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => closeModal()}> </button></div>
<div className="modal-body">
<div className="card">
<div className="card-body">
    <div className="basic-form">
        <form>
        <div className="row">
            <div className="mb-3 col-md-12">
                <label className="form-label"> Name</label>
                <input type="text" className="form-control" placeholder="" value={state.name} name="name" onChange={event => setState({...state,name:event.target.value})}/>
                <XError message={error.name} />
            </div>									
        </div>
        <div className="row">
            <div className="mb-3 col-md-12">
                <label className="form-label"> Number of Cabinets</label>
                <input type="number" className="form-control" placeholder="" value={state.cabinet} name="cabinet" onChange={event => setState({...state,cabinet:event.target.value})}/>
                <XError message={error.cabinet} />
            </div>									
        </div>
        <div className="row">
            <div className="mb-3 col-md-12">
                <label className="form-label"> Number of kWs</label>
                <input type="number" className="form-control" placeholder="" value={state.power} name="power" onChange={event => setState({...state,power:event.target.value})}/>
                <XError message={error.power} />
            </div>									
        </div>
        
        <div className="toolbar toolbar-bottom" role="toolbar" >	
        <button type="button" className="btn btn-outline-primary" onClick={() => deleteDataHall()}> Delete </button> 
        <button type="button" className="btn btn-outline-primary" onClick={closeModal} > Cancel </button>
        {isLoading?(
                <button 
                type="button" 
                className="btn btn-primary"> Loading ... </button>
                ):(
                <button 
                type="button" 
                onClick={() => onSubmit(props.data_center_id)}
                className="btn btn-primary"> Update Data Hall </button>
                )}
            </div>
        </form>
    </div>
</div>
</div>												
</div>
</Modal>
</div>
    )

}

export default EditDataHall;


