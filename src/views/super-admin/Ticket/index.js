import React,{useState,useEffect,useContext} from 'react';
import Layout from "../Layouts";
import "./style.css";
import TicketService from 'services/ticketService';
import AuthContext from "context";
import Card from './components/card';
import {cardData} from './components/data';

const Ticket = () => {

	const contextStore = useContext(AuthContext);
	const [state,setState] =  useState([]);
	const [menu,setMenu] =  useState(1);

	useEffect(() => {

		TicketService.index(contextStore.token())
		.then(res => setState(res.data.ticket))
		.catch(err => {
			//500 error page
		});

	},[]);


	const getStatus = id => {
		switch (id) {
			case 1:
				return "In Service";
				break;
			case 2:
				return "Complete";
				break;
			case 3:
				return "Construction";
				break;
			case 4:
				return "Planning";
				break;
			case 5:
				return "Reserved";
				break;
			case 6:
				return "ROFR";
				break;
			case 7:
				return "Blocked";
				break;
		}
	}

	return(
		<Layout>
			<div className='bg_color_dash'>
<div className="container-fluid pb-5">
	<div className="row pt-2">
		<div className="col-lg-12 col-md-12 col-sm-12 col-12 gx-4">
			<div className="row g-2">
				<Card cardData={cardData} state={state}/>
               </div>
               <div className="row">
                 <div className="invglob">
                   <div className="profile-tab menu_tab_btn">
                           <div className="custom-tab-1">
                              <ul className="nav nav-tabs" style={{
                              	flexWrap:"nowrap",
                              	overflowX:"auto",
                              	paddingBottom: ".5rem"
                              	}}>
                                 <li className="nav-item"> 
                                 <button 
                                 className={menu === 1?'btn btn-secondary':'btn btn-light'} 
                                 onClick={() => setMenu(1)} > Incidents</button>
                                 </li>
                                 <li className="nav-item"> 
                                 <button 
                                 className={menu === 2?'btn btn-secondary':'btn btn-light'} 
                                 onClick={() => setMenu(2)}>Faults</button>
                                 </li>
                                 <li className="nav-item"> 
                                 <button 
                                 className={menu === 3 ?'btn btn-secondary':'btn btn-light'} 
                                 onClick={() => setMenu(3)}> Shipment</button>
                                 </li>
                                 <li className="nav-item"> 
                                 <button 
                                 className={menu === 5?'btn btn-secondary':'btn btn-light'} 
                                 onClick={() => setMenu(5)}> Remote Hands</button>
                                 </li>
                                 <li className="nav-item"> 
                                 <button 
                                 className={menu === 6?'btn btn-secondary':'btn btn-light'} 
                                 onClick={() => setMenu(6)}> Provisioning</button>
                                 </li>
                                 <li className="nav-item"> 
                                 <button 
                                 className={menu === 4?'btn btn-secondary':'btn btn-light'} 
                                 onClick={() => setMenu(4)}> Site Visits</button>
                                 </li>
                              </ul>
                           </div>
                        </div>
                 </div>
               </div>
               <div className="row mt-2">
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
                        <div className="card-body">
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
                                       	{
                                       		state && state.map(data => {
	                                       		if (data.ticket_type_id === menu) {

	                                       			return(
			                                          	<tr>
				                                            <td className="pd-l bold-txt">{data.number}</td>
				                                            <td className="pd-l bold-txt">{data.subject}</td>
				                                            <td className="pd-l bold-txt">{data.operation_site}</td>
				                                            <td className="pd-l bold-txt">{data.severity}</td>
				                                            <td className="pd-l bold-txt">{data.create_timestamp}</td>
				                                            <td> <span className="badge badge-success badge-lg light">{getStatus(data.ticket_status)}</span>  </td>
				                                            <td className="pd-l bold-txt">{data.customer}</td>
			                                          	</tr>
	                                       			)
	                                       		}
                                       		})
                                       	}
                                       </tbody>
                                    </table>
                                 </div>
                              </div>

                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
	  </div>
			
		</Layout>
	);
}

export default Ticket;