import React, { useContext, useEffect, useRef, useState } from 'react'
import networkServices from 'services/networkServices';
import CabinetService from 'services/CabinetService';
import AuthContext from "context";
import { XError } from 'components/common';
import Swal from 'sweetalert2'
export default function NetworkModel(props) {

   const [modalIsOpen, setIsOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const modalRef = useRef(null);
   const authContext = useContext(AuthContext);
   const [hostName, setHostName] = useState("");
   const [make, setMake] = useState("");
   const [modelName, setModelName] = useState("");
   const [function_name, setFunctionName] = useState("");
   const [sn, setSN] = useState("");
   const [cabinet_id, setCabinetID] = useState("");
   const [device_status, setDeviceStatus] = useState("");
   const [top_u_position, setTopUPosition] = useState("");
   const [support_status, setSupportStatus] = useState("");
   const [support_expiry, setSupportExpiry] = useState("");
   const [makeData, setMakeData] = useState([]);
   const [networkFunction, setNetworkFunction] = useState([]);
   const [modelData, setModelData] = useState([]);
   const [deviceStatusData, setDeviceStatusData] = useState([]);
   const  [cabinet, setCabinetData] = useState([])
   const [error,setError] = useState({
		name:"",
		status:""
	});

   useEffect(() => {
      networkServices.getMake(authContext.getToken).then((res) => {
         setMakeData(res.data.data)
      });
      networkServices.getModel(authContext.getToken).then(res => setModelData(res.data.data));
      networkServices.getNetworkFunction(authContext.getToken).then(res => setNetworkFunction(res.data.data));
      networkServices.getDeviceStatus(authContext.getToken).then(res => setDeviceStatusData(res.data.data));
      CabinetService.getAllCabinets(authContext.getToken).then(res => setCabinetData(res.data.data));
      setIsOpen(props.show);

   }, [props.show])

   const onSubmit = async (data) => {
      setIsLoading(true);
      if(checkValidation()){
         await networkServices.addNetworkDevice(authContext.getToken,
            {
               "name": hostName,
               "desc": "",
               "make": make,
               "model": modelName,
               "function_name": function_name,
               "sn": sn,
               "data_center": props.data_center_id.id,
               "cabinet_id": cabinet_id,
               "device_status": device_status,
               "support_status": support_status,
               "top_u_position": top_u_position,
               "support_expiry": support_expiry
            }).then(async res => {
   
               setIsLoading(false);
               props.selectDataCenterFloor(props.data_center_id);
               closeModal();
               Swal.fire('New Network Device Created');
   
            }).catch(err => {
   
               setIsLoading(false);
   
            })
      }else{
         setIsLoading(false);
      }
   }

   const checkValidation = () => {

		let error = {
			"make":"",
			"model":"",
         "function":""
		};
		

		let flag = true;

		if (make === "" || make === null || make === undefined) {

			error.make = "The make field is required.";
			flag = false;
        }
        if (modelName === "" || modelName === null || modelName === undefined) {

			error.model = "The model field is required.";
			flag = false;
        }
        if (function_name === "" || function_name === null || function_name === undefined) {

			error.function = "The function field is required.";
			flag = false;
        }

		setError({...error});

		return flag;
	}

   const closeModal = () => {

      setHostName("");
      setMake("");
      setModelName("");
      setSN("");
      setFunctionName("");
      setCabinetID("");
      setDeviceStatus("");
      setSupportExpiry("");
      setTopUPosition("");
      setSupportStatus("");

      setError({
			make:"",
         model:"",
         function: ""
		})

      modalRef.current.click();
   }
   return (
      <div className="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true">
         <div className="modal-dialog modal-lg">
            <div className="modal-content">
               <div className="modal-header mt-59">
                  <h3 className="modal-title">Add Device Details</h3>
                  <button type="button" className="btn-close" ref={modalRef} onClick={closeModal} data-bs-dismiss="modal"> </button>
               </div>
               <div className="modal-body">
                  <div className="card">
                     <div className="card-body" style={{ padding: "0px" }}>
                        <div className="basic-form">
                           <form>
                              <div className="row">
                                 <div className="col-md-6 mt-2313">
                                    <label className="form-label"> Hostname</label>
                                    <input type="text" value={hostName} className="form-control" onChange={event => setHostName(event.target.value)} placeholder="Hostname" />

                                 </div>
                                 <div className="col-md-6 col-sm-6 mt-2313">
                                    <label className="form-label"> Make <small className="text-danger">*</small></label>
                                    <select className="selectpicker" value={makeData} onChange={event => setMake(event.target.value)}>
                                    <option>Choose...</option>
                                       {
                                          makeData && makeData.map(m => {
                                             return <option
                                                key={m.id}
                                                value={m.id}>{m.name}</option>
                                          })
                                       }
                                    </select>
                                    <XError message={error.make} />
                                 </div>
                              </div>
                              <div className="row">
                                 <div className="col-md-6 mt-2313">
                                    <label className="form-label"> Function <small className="text-danger">*</small></label>
                                    <select className="selectpicker" value={function_name} onChange={event => setFunctionName(event.target.value)}>
                                    <option>Choose...</option>
                                       {
                                          networkFunction && networkFunction.map(nf => {
                                             return <option
                                                key={nf.id}
                                                value={nf.id}>{nf.name}</option>
                                          })
                                       }
                                    </select>
                                    <XError message={error.function} />
                                 </div>
                                 <div className="col-md-6 col-sm-6 mt-2313">
                                    <label className="form-label">Model <small className="text-danger">*</small></label>
                                    <select className="selectpicker" value={modelName} onChange={event => setModelName(event.target.value)}>
                                    <option>Choose...</option>
                                       {
                                          modelData && modelData.map(md => {
                                             return <option
                                                key={md.id}
                                                value={md.id}>{md.name}</option>
                                          })
                                       }
                                    </select>
                                    <XError message={error.model} />
                                 </div>
                              </div>
                              <div className="row">
                                 <div className="col-md-6 mt-2313">
                                    <label className="form-label"> Serial Number</label>
                                    <input type="text" value={sn} className="form-control" onChange={event => setSN(event.target.value)} placeholder="Serial Number" />

                                 </div>
                                 <div className="col-md-6 mt-2313">
                                    <label className="form-label"> Cabinet ID</label>
                                    <select className="selectpicker" value={cabinet_id} onChange={event => setCabinetID(event.target.value)}>
                                    <option>Choose...</option>
                                       {
                                          cabinet && cabinet.map(md => {
                                             return <option
                                                key={md.id}
                                                value={md.id}>{md.name}</option>
                                          })
                                       }
                                    </select>
                                 </div>
                              </div>
                              <div className="row">
                                 <div className="col-md-6 mt-2313">
                                    <label className="form-label"> Status</label>
                                    <select className="selectpicker" value={device_status} onChange={event => setDeviceStatus(event.target.value)}>
                                    <option>Choose...</option>
                                       {
                                          deviceStatusData && deviceStatusData.map(ds => {
                                             return <option
                                                key={ds.id}
                                                value={ds.id}>{ds.name}</option>
                                          })
                                       }
                                    </select>
                                 </div>
                                 <div className="col-md-6 mt-2313">
                                    <label className="form-label"> Top U Position</label>
                                    <input type="text" value={top_u_position} className="form-control" placeholder="Top U Position" onChange={event => setTopUPosition(event.target.value)} />

                                 </div>
                              </div>
                              <div className="row">
                                 <h5 className="mt-3" style={{ color: "#147AD6", fontWeight: "700", marginBottom: "0px" }}>Maintenance & Support</h5>
                                 <div className="col-md-6 mt-2">
                                    <label className="form-label"> Status</label>
                                    <select className="selectpicker" value={support_status} onChange={event => setSupportStatus(event.target.value)}>
                                    <option>Choose...</option>
                                       <option value={1}>Active</option>
                                       <option value={2}>Inactive</option>

                                    </select>
                                 </div>
                                 <div className="col-md-6 mt-2">
                                    <label className="form-label"> Expiry Date</label>
                                    <input type="date" value={support_expiry} className="form-control" placeholder="Expiry Date" onChange={event => setSupportExpiry(event.target.value)} onfocus="(this.type='date')" />

                                 </div>
                              </div>
                              <div className="toolbar toolbar-bottom mt-51 d-flex justify-content-end" role="toolbar">
                                 <button type="button" onClick={closeModal} className="btn btn-outline-primary mr_1"> Cancel </button>
                                 {isLoading ? (
                                    <button
                                       type="button"
                                       className="btn btn-primary"> Loading ... </button>
                                 ) : (
                                    <button type="button" onClick={() => onSubmit(props.data_center_id)} className="btn btn-primary">Save</button>
                                 )}
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
