import React, { useRef, useState, useContext, useEffect } from 'react'
import Swal from 'sweetalert2'
import AuthContext from "context";
import networkServices from 'services/networkServices';
export default function EditNetwork(props) {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const modalRef = useRef(null);
    const authContext = useContext(AuthContext);
    const [hostName, setHostName] = useState("");
    const [makeid, setMake] = useState("");
    const [modelName, setModelName] = useState("");
    const [function_name, setFunctionName] = useState("");
    const [sn, setSN] = useState("");
    const [cabinet_id, setCabinetID] = useState("");
    const [device_status, setDeviceStatus] = useState("");
    const [top_u_position, setTopUPosition] = useState("");
    const [support_status, setSupportStatus] = useState("");
    const [support_expiry, setSupportExpiry] = useState("");
    const [makeData,setMakeData]=useState([]);
    const [networkFunction,setNetworkFunction] = useState([]);
    const [modelData,setModelData]= useState([]);
    const [deviceStatusData,setDeviceStatusData] = useState([]);

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

        modalRef.current.click();
    }
    useEffect(() => {
        networkServices.getMake(authContext.getToken).then((res) =>{
            console.log("function Data"+res.data.data)
            setMakeData(res.data.data)
        }

            );
        networkServices.getModel(authContext.getToken).then(res =>setModelData(res.data.data));
        networkServices.getNetworkFunction(authContext.getToken).then(res =>setNetworkFunction(res.data.data));
        networkServices.getDeviceStatus(authContext.getToken).then(res =>setDeviceStatusData(res.data.data));

		setIsOpen(props.show);
        setHostName(props.network_data.name);
        setMake(props.network_data.makes.id);
        setModelName(props.network_data.models.name);
        setSN(props.network_data.sn);
        setFunctionName(props.network_data.network_function.name);
        setCabinetID(props.network_data.cabinet_id);
        setDeviceStatus("");
        setSupportExpiry(props.network_data.support_expiry);
        setTopUPosition("");
        setSupportStatus("");


	}, [props.show]);
    const onSubmit = async () => {
        setIsLoading(true);
        alert(props.network_data.id);
        await networkServices.updateNetworkDevice(authContext.getToken,
           {
               "id":props.network_data.id,
              "name": hostName,
              "desc": "test",
              "make": makeid,
              "model": modelName,
              "function_name": function_name,
              "sn": sn,
              "data_center": props.network_data.data_center,
              "cabinet_id": cabinet_id,
              "device_status": device_status,
              "support_status": support_status,
              "top_u_position": top_u_position,
              "support_expiry": support_expiry
           }).then(async res => {

              setIsLoading(false);
              props.selectDataCenterFloor(props.data_center_id);
              closeModal();
              Swal.fire('Network Device Updated');

           }).catch(err => {

              setIsLoading(false);

           })
        }
    return (
        <div className="modal show bd-example-modal-lg" style={{ display: 'block' }} tabindex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header mt-59">
                        <h3 className="modal-title">Update Device Details</h3>
                        <button type="button" className="btn-close" ref={modalRef} data-bs-dismiss="modal"> </button>
                    </div>
                    <div className="modal-body">
                        <div className="card">
                            <div className="card-body" style={{ padding: "0px" }}>
                                <div className="basic-form">
                                    <form>
                                        <div className="row">
                                            <div className="col-md-6 mt-2313">
                                                <label className="form-label"> Hostname</label>
                                                <input type="text" value={hostName} className="form-control" onChange={event => setHostName(event.target.value)} placeholder="Distributed Routers" />

                                            </div>
                                            <div className="col-md-6 col-sm-6 mt-2313">
                                                <label className="form-label"> Make</label>
                                                <select className="selectpicker" value={makeid} onChange={event => setMake(event.target.value)}>
                                                {
		                                            	makeData && makeData.map(m => {
		                                            		return <option
		                                            		key={m.id}
		                                            		value={m.id}>{m.name}</option>
		                                            	})
		                                            }
                                                </select>

                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mt-2313">
                                                <label className="form-label"> Function</label>

                                                <select className="selectpicker" value={function_name} onChange={event => setFunctionName(event.target.value)}>
                                                    {
		                                                networkFunction && networkFunction.map(nf => {
		                                            		return <option
		                                            		key={nf.id}
		                                            		value={nf.id}>{nf.name}</option>
		                                            	})
		                                            }
                                                </select>
                                            </div>
                                            <div className="col-md-6 col-sm-6 mt-2313">
                                                <label className="form-label">Model</label>
                                                <select className="selectpicker" value={modelName} onChange={event => setModelName(event.target.value)}>
                                                    {
		                                            	modelData && modelData.map(md => {
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
                                                <label className="form-label"> Serial Number</label>
                                                <input type="text" value={sn} className="form-control" onChange={event => setSN(event.target.value)} placeholder="N/A" />

                                            </div>
                                            <div className="col-md-6 mt-2313">
                                                <label className="form-label"> Cabinet ID</label>
                                                <input type="text" value={cabinet_id} className="form-control" onChange={event => setCabinetID(event.target.value)} placeholder="N/A" />

                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mt-2313">
                                                <label className="form-label"> Status</label>

                                                <select className="selectpicker" value={device_status} onChange={event => setDeviceStatus(event.target.value)}>
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
                                                <input type="text" value={top_u_position} className="form-control" placeholder="N/A" onChange={event => setTopUPosition(event.target.value)} />

                                            </div>
                                        </div>
                                        <div className="row">
                                            <h5 className="mt-3" style={{ color: "#147AD6", fontWeight: "700", marginBottom: "0px" }}>Maintenance & Support</h5>
                                            <div className="col-md-6 mt-2">
                                                <label className="form-label"> Status</label>
                                                <select className="selectpicker" value={support_status} onChange={event => setSupportStatus(event.target.value)}>
                                                    {
                                                        support_status == 'active' ?<option value={1}>Active</option>:<option value={2}>Inactive</option>
                                                    }
                                                    <option value={1}>Active</option>
                                                    <option value={2}>Inactive</option>


                                                </select>
                                            </div>
                                            <div className="col-md-6 mt-2">
                                                <label className="form-label"> Expiry Date</label>
                                                <input type="date" value={support_expiry} className="form-control" placeholder="Date" onChange={event => setSupportExpiry(event.target.value)} onfocus="(this.type='date')" />

                                            </div>
                                        </div>
                                        <div className="toolbar toolbar-bottom mt-51 d-flex justify-content-end" role="toolbar">
                                            <button type="button" onClick={closeModal} className="btn btn-outline-primary mr_1"> Cancel </button>
                                            {isLoading ? (
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"> Loading ... </button>
                                            ) : (
                                                <button type="submit" onClick={() => onSubmit()} className="btn btn-primary">Save</button>
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
