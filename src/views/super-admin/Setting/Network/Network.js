import React from 'react'

export default function Network() {
    return (
        <div className="row">
            <div className="col-xl-1" style={{ width: "11%" }}>
                <div className="leftside">
                    <p> <a href="#" className="plink active">Inventory</a> </p>
                    <p> <a href="#" className="plink">Rack Elevation</a> </p>
                    <p> <a href="#" className="plink">Topology</a> </p>
                    <p> <a href="#" className="plink">Fiber Map</a> </p>
                </div>
            </div>
            <div className="col-lg-11" style={{ width: "89%" }}>
                <div id="pro">
                    <div className="profile-tab">
                        <div className="custom-tab-1">
                            <div className="main_scrll">
                                <div className="btn_ul">
                                    <ul className="nav nav-tabs mb-3">
                                        <li className="nav-item"> <button className="btn btn-secondary" style={{ width: "100%" }} > Global </button></li>
                                        <li className="nav-item">
                                            <div className="btn-group" role="group">
                                                <button type="button" className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{width: "100%"}}> Country </button>
                                                <div className="dropdown-menu" style={{ margin: "0px" }}>
                                                    <a className="dropdown-item" href="javascript:void()">Country </a>
                                                    <a className="dropdown-item" href="javascript:void()">Country </a>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="ul_scrll">
                                    <ul className="nav nav-tabs mb-3">
                                        <li className="nav-item"><a href="#" class="nav-link">TYO1</a></li>
                                        <li className="nav-item"><a href="#" class="nav-link">TYO2</a> </li>
                                        <li className="nav-item"><a href="#" class="nav-link ">TYO3</a> </li>
                                        <li className="nav-item"><a href="#" class="nav-link"> OSA1 </a> </li>
                                        <li className="nav-item"><a href="#" class="nav-link active show"> <img className="down" src="images/downward-arrow.png" /> SEL1 </a> </li>
                                        <li className="nav-item"><a href="#" class="nav-link"> PUS1 </a> </li>
                                        <li className="nav-item"><a href="#" class="nav-link"> PEK1 </a> </li>
                                        <li className="nav-item"><a href="#" class="nav-link"> JKT1 </a> </li>
                                        <li className="nav-item"><a href="#" class="nav-link"> MNL1 </a> </li>
                                        <li className="nav-item"><a href="#" class="nav-link"> MNL1 </a> </li>
                                        <li className="nav-item"><a href="#" class="nav-link"> MNL1 </a> </li>
                                        <li className="nav-item"><a href="#" class="nav-link"> MNL1 </a> </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tblop-117">
                        <div className="ttl_op-117">
                            <h6>Latest Updates : 2022-04-22 12:22 HKT</h6>
                            <a href="#" style={{ color: "#147AD6", fontWeight: "600", fontSize: "0.813rem" }} data-bs-toggle="modal" data-bs-target=".bd-example-modal-lg"><img src="images\plus-circle-blue.svg" style={{ width: "1rem" }} /> &nbsp;Add Device</a>
                        </div>
                    </div>
                    <div className="op-117_table mt-1">
                        <div className="table-responsive" style={{ overflow: "auto", height: "350px" }}>
                            <table className="table table-responsive-md" style={{ border: "1px solid #eee" }}>
                                <thead>
                                    <tr style={{ border: "1px solid #eee" }}>
                                        <th><strong>Funtion</strong></th>
                                        <th><strong>Hostname</strong></th>
                                        <th><strong>Vendors</strong></th>
                                        <th><strong>Model</strong></th>
                                        <th><strong>S/N</strong></th>
                                        <th><strong>Status</strong></th>
                                        <th><strong>Cabinet ID</strong></th>
                                        <th><strong>Support</strong></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Distributed Routers</td>
                                        <td></td>
                                        <td>Juniper</td>
                                        <td>QFXS-220-32CD</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <i className="fas fa-edit"></i><span className="edit"></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>Juniper</td>
                                        <td>QFXS-220-32CD</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <i className="fas fa-edit"></i><span className="edit"></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Leaf Service Routers</td>
                                        <td></td>
                                        <td>Nokia</td>
                                        <td>750 IXR X1 (Type-B)</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <i className="fas fa-edit"></i><span className="edit"></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>Nokia</td>
                                        <td>750 IXR X1 (Type-A)</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <i className="fas fa-edit"></i><span className="edit"></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Route Reflector</td>
                                        <td></td>
                                        <td>Juniper</td>
                                        <td>MX204</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <i className="fas fa-edit"></i><span className="edit"></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Optical Network Equip</td>
                                        <td></td>
                                        <td>Clena</td>
                                        <td>RLS 6500</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <i className="fas fa-edit"></i><span className="edit"></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Distributed Routers</td>
                                        <td></td>
                                        <td>Clena</td>
                                        <td>Wavesever (WS)S</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <i className="fas fa-edit"></i><span className="edit"></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
