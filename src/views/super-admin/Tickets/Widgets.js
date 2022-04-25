import React from 'react'
import './Tickets.css'
import Layout from '../Layouts'
import Faults from './Faults'
import Tickets from './Tickets'
export default function Widgets() {
    return (
        <Layout>
        <div className="container-fluid pb-5">
            <div className="row pt-2">
                <div className="col-lg-12 col-md-12 col-sm-12 col-12 gx-4">
                    <div className="row g-2">
                        <div className="col-lg-3 col-md-3 col-sm-12 col-12 mb-3">
                            <div className="grid_card">
                                <div className="card_head">
                                    <div className="txt_card">
                                        <h3>Incidents</h3>
                                    </div>
                                    <div className="txt_card_2">
                                        <p><img src="\images\red.png" width="15px" />S1</p>
                                        <p><img src="\images\orange-1.png" width="15px" />S2</p>
                                        <p><img src="\images\yellow.png" width="15px" />S3</p>
                                    </div>
                                </div>
                                <div className="card_diag">
                                    <img src="\images\red-o.png" width="80%" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-12 col-12">
                            <div className="grid_card">
                                <div className="card_head">
                                    <div className="txt_card">
                                        <h3>Faults</h3>
                                    </div>
                                    <div className="txt_card_2">
                                    <p><img src="\images\red.png" width="15px" />S1</p>
                                        <p><img src="\images\orange-1.png" width="15px" />S2</p>
                                        <p><img src="\images\yellow.png" width="15px" />S3</p>
                                    </div>
                                </div>
                                <div className="card_diag">
                                    <img src="\images\red-o.png" width="80%" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-12 col-12">
                            <div className="grid_card">
                                <div className="card_head">
                                    <div className="txt_card">
                                        <h3>Site Visits</h3>
                                    </div>
                                    <div className="txt_card_2">
                                        <p><img src="\images\red.png" width="15px" />Today</p>
                                        <p><img src="\images\orange-1.png" width="15px" />Tomorrow</p>
                                    </div>
                                </div>
                                <div className="card_diag">
                                    <img src="\images\red-o.png" width="80%" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-12 col-12">
                            <div className="grid_card grid_mr">
                                <div className="card_head">
                                    <div className="txt_card">
                                        <h3>Shipments</h3>
                                    </div>
                                    <div className="txt_card_2">
                                    <p><img src="\images\red.png" width="15px" />Today</p>
                                        <p><img src="\images\orange-1.png" width="15px" />Tomorrow</p>
                                    </div>
                                </div>
                                <div className="card_diag">
                                    <img src="\images\red-o.png" width="80%" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Tickets/>
                    <Faults />
                </div>
            </div>
        </div>
        </Layout>

    )
}
