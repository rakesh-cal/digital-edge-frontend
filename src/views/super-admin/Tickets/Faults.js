import React from 'react'

export default function Faults() {

    return (
        <div className="row mt-3">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="grid_card grid_mr h-100 tckt">
                    <div className="card_head">
                        <div className="txt_card">
                            <ul className="tabs_card">
                                <li className="tc-1 active">Colo</li>
                                <li className="tc-1">M&E</li>
                                <li className="tc-1">Network</li>
                            </ul>
                        </div>
                    </div>
                    <div >
                        <div className="table-responsive tckect_tt">
                            <table className="table header-border table-borderless table-hover verticle-middle">
                                <thead>
                                    <tr>
                                        <th scope="col" className="pd-l">Ticket #</th>
                                        <th scope="col">Ticket Name</th>
                                        <th scope="col">DC</th>
                                        <th scope="col">Severity</th>
                                        <th scope="col">Timestamp</th>
                                        <th scope="col">Stage</th>
                                        <th scope="col">Customer</th>
                                    </tr>
                                </thead>
                                <tbody id="cardnew">
                                    <tr>
                                        <td className="pd-l bold-txt">189</td>
                                        <td className="pd-l bold-txt">Power strip lost power</td>
                                        <td className="pd-l bold-txt">TYO3</td>
                                        <td className="pd-l bold-txt">S1</td>
                                        <td className="pd-l bold-txt">2021-12-30 12:35 PM</td>
                                        <td> <span className='badge badge-success badge-lg light'>In Progress</span>  </td>
                                        <td className="pd-l bold-txt">Japan Media</td>
                                    </tr>
                                    <tr>
                                        <td className="pd-l bold-txt">188</td>
                                        <td className="pd-l bold-txt">Temperature too warm</td>
                                        <td className="pd-l bold-txt">TYO3</td>
                                        <td className="pd-l bold-txt">S2</td>
                                        <td className="pd-l bold-txt">2022-02-07 08:29 PM</td>
                                        <td> <span className='badge badge-success badge-lg light'>In Progress</span>  </td>
                                        <td className="pd-l bold-txt">Misuho</td>
                                    </tr>
                                    <tr>
                                        <td className="pd-l bold-txt">189</td>
                                        <td className="pd-l bold-txt">Power strip lost power</td>
                                        <td className="pd-l bold-txt">TYO3</td>
                                        <td className="pd-l bold-txt">S3</td>
                                        <td className="pd-l bold-txt">2021-12-30 12:35 PM</td>
                                        <td> <span className='badge badge-success badge-lg light'>In Progress</span>  </td>
                                        <td className="pd-l bold-txt">Technomax</td>
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
