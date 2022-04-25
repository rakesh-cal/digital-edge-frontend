import React from 'react'

export default function Tickets() {
    return (
        <div className="row">
            <div className="invglob">
                <div className="profile-tab">
                    <div className="custom-tab-1">
                        <ul className="nav nav-tabs" style={{flexWrap:'nowrap', overflowX:'auto', paddingBottom: '.5rem'}}>
                            <li className="nav-item"> <button className="btn btn-light" > Incidents</button></li>
                            <li className="nav-item"> <button className="btn btn-secondary" >Faults</button></li>
                            <li className="nav-item"> <button className="btn btn-light" > Shipment</button></li>
                            <li className="nav-item"> <button className="btn btn-light" > Remote Hands</button></li>
                            <li className="nav-item"> <button className="btn btn-light" > Provisioning</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
