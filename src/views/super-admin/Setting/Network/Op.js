import React from 'react'
import Layout from 'views/super-admin/Layouts';
import Network from './Network';
import NetworkModel from './NetworkModel';
import './Op.css';
export default function Op() {
    return (
        <Layout>
            <div className="content-body">
                <div className="container-fluid">
                    <div id="title">
                        <h4 className="card-title"> Settings </h4>
                        <p>  Manage users and set roles and permissions </p>
                    </div>
                    <div className="card-header" id="header">
                        <div className="d-sm-flex d-block justify-content-between align-items-center">
                            <div className="card-action coin-tabs mt-3 mt-sm-0">
                                <ul className="nav nav-tabs" role="tablist">
                                    <li className="nav-item gap_s">
                                        <a className="nav-link" id="tab1" data-bs-toggle="tab" href="#"> User Management </a>
                                    </li>
                                    <li className="nav-item gap_s">
                                        <a className="nav-link" id="tab2" data-bs-toggle="tab" href="#"> Roles & Permissions </a>
                                    </li>
                                    <li className="nav-item gap_s">
                                        <a className="nav-link" id="tab3" data-bs-toggle="tab" href="#"> Data Centres </a>
                                    </li>
                                    <li className="nav-item gap_s">
                                        <a className="nav-link active" id="tab3" data-bs-toggle="tab" href="#">Network</a>
                                    </li>
                                    <li className="nav-item gap_s">
                                        <a className="nav-link" id="tab3" data-bs-toggle="tab" href="#">Report</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <hr className="main" />
                    {/* Add Network Table File */}
                    <Network/>
                    {/*// Add Network Table File */}
                    <NetworkModel/>
                </div>
            </div>
        </Layout>
    )
}
