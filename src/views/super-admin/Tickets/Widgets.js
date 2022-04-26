import React from 'react'
import './Tickets.css'
import Layout from '../Layouts'
import Faults from './Faults'
import Tickets from './Tickets'
import { useEffect, useState, } from 'react';
export default function Widgets() {
    const [onbtn, setOnBtn] = useState(true);
    const [offbtn, setOffBtn] = useState(true);
    const refreshHandleOn = () => {
        localStorage.setItem('count', 1)
        setOffBtn(false);
        refresh();
    }
    const refreshHandleOff = () => {
        localStorage.setItem('count', 0)
        setOnBtn(false);
        refresh();
    }

    const refresh = () => {
        const items = localStorage.getItem('count');
        if (items != 0) {
            setInterval(() => {
                window.location.href = "/tickets";
            }, 60000);
        }
    }
    useEffect(() => {
        if (localStorage.getItem('count') != 0) {
            refreshHandleOn();

        } else {
            refreshHandleOff();

        }
    }, [])
    return (
        <Layout>
            <div className="container-fluid pb-5">

                <div className="row pt-2">
                    <span >
                        <button onClick={refreshHandleOff} className="btn-sm refreshOff" disabled={offbtn}>OFF</button>
                        <button onClick={refreshHandleOn} className="btn-sm refreshOn" disabled={onbtn}>ON</button>
                    </span>
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
                        <Tickets />
                        <Faults />
                    </div>
                </div>
            </div>
        </Layout>

    )
}
