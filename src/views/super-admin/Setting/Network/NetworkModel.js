import React from 'react'

export default function NetworkModel() {
  return (
    <div className="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                           <div className="modal-content">
                              <div className="modal-header mt-59">
                                 <h3 className="modal-title">Update Device Details</h3>
                                 <button type="button" className="btn-close" data-bs-dismiss="modal"> </button>
                              </div>
                              <div className="modal-body">
                                 <div className="card">
                                    <div className="card-body" style={{padding: "0px"}}>
                                       <div className="basic-form">
                                          <form>
                                             <div className="row">
                                                <div className="col-md-6 mt-2313">
                                                   <label className="form-label"> Hostname</label>
                                                   <input type="text" className="form-control" placeholder="Distributed Routers"/>
                                                </div>
                                                <div className="col-md-6 col-sm-6 mt-2313">
                                                   <label className="form-label"> Make</label>
                                                   <select className="selectpicker">
                                                      <option>N/A</option>
                                                      <option>N/A</option>
                                                      <option>N/A</option>
                                                   </select>
                                                </div>
                                             </div>
                                             <div className="row">
                                                <div className="col-md-6 mt-2313">
                                                   <label className="form-label"> Function</label>
                                                   <input type="text" className="form-control" placeholder="N/A"/>
                                                </div>
                                                <div className="col-md-6 col-sm-6 mt-2313">
                                                   <label className="form-label">Model</label>
                                                   <select className="selectpicker">
                                                      <option>QFXS-220-32CD</option>
                                                      <option>QFXS-220-32CD</option>
                                                      <option>QFXS-220-32CD</option>
                                                   </select>
                                                </div>
                                             </div>
                                             <div className="row">
                                                <div className="col-md-6 mt-2313">
                                                   <label className="form-label"> Serial Number</label>
                                                   <input type="text" className="form-control" placeholder="N/A"/>
                                                </div>
                                                <div className="col-md-6 mt-2313">
                                                   <label className="form-label"> Cabinet ID</label>
                                                   <input type="text" className="form-control" placeholder="N/A"/>
                                                </div>
                                             </div>
                                             <div className="row">
                                                <div className="col-md-6 mt-2313">
                                                   <label className="form-label"> Status</label>
                                                   <input type="text" className="form-control" placeholder="N/A"/>
                                                </div>
                                                <div className="col-md-6 mt-2313">
                                                   <label className="form-label"> Top U Position</label>
                                                   <input type="text" className="form-control" placeholder="N/A"/>
                                                </div>
                                             </div>
                                             <div className="row">
                                             	<h5 className="mt-3" style={{color: "#147AD6", fontWeight:"700", marginBottom: "0px"}}>Maintenance & Support</h5>
                                                <div className="col-md-6 mt-2">
                                                   <label className="form-label"> Status</label>
                                                   <input type="text" className="form-control" placeholder="N/A"/>
                                                </div>
                                                <div className="col-md-6 mt-2">
                                                   <label className="form-label"> Expiry Date</label>
                                                   <input type="date" className="form-control" placeholder="Date" onfocus="(this.type='date')"/>
                                                </div>
                                             </div>
                                             <div className="toolbar toolbar-bottom mt-51 d-flex justify-content-end" role="toolbar">
                                                <button type="button" className="btn btn-outline-primary mr_1"> Cancel </button>
                                                <button type="submit" className="btn btn-primary">Save</button>
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
