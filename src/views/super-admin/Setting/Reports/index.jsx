import React,{useEffect,useState,useContext} from 'react';
import Layout from "../../Layouts";
import Navigation from "../Component/Navigation";
import RoleModel from "services/roleServices";
import Activity from "services/activityService"
import UserModal from "services/userServices"
import Result from './result'
import Floors from "services/floorServices"
import AuthContext from "context";
import moment from "moment";

const Reports = (props) => {
   const authContext = useContext(AuthContext);
	const [state,setState] = useState([]);
   const [dataCenter, setDataCenter] = useState([])
   const [countryName, setCountryName] = useState("Country");
   const [dataCenterName, setDataCenterName] = useState("N/A");
   const [currentTab,setCurrentTab] = useState(0);
   const [activityLog, setActivityLog] = useState([])
   const [userList, setUserList] = useState([])
   const [showPopup, setShowPopup] = useState([])
   const [firstTimeCheck, setFirstTimeCheck] = useState(1)

   useEffect(() => {

		getData()
      getAllUsers()
	},[]);

	const getData = async () => {

		await RoleModel.countryService(authContext.token()).then(res => {
			setState(res.data.data);
		});
		getAllDataCenter()
		getActivityLogs("all")
      setDataCenterName("N/A")
	}

   const getAllUsers = async () => {
		
		const users = authContext.getUser;

		if(users.length){
         users.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
			setUserList(users);
		}else{

			const data = await UserModal.index(authContext.token());
         data?.data?.data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
         setUserList(data?.data?.data);
			authContext.setUser(data?.data?.data);
		}
	}

   const getAllDataCenter = async () => {
      setFirstTimeCheck(1)
      getActivityLogs("all")
		setCountryName("Country")
		await RoleModel.dataCenter(authContext.token()).then(res => {
			setDataCenter(res.data.data)
			
		})
	}

   const getDataCenterById = async(e) => {
		setCountryName(e.name)
      setDataCenterName("N/A")
      getActivityLogs("country", e.id)
		await RoleModel.dataCenterByCountryId(authContext.token(), e).then(res => {
			setDataCenter(res.data.data)
			if(res.data.data.length > 0){
				//selectDataCenterFloor(res.data.data[0])
			}
		})
	}

   const getActivityLogs = async(type, id=null)=> {
      await Activity.getActivity(authContext.token(), type, id).then(res => {
         res.data.data.map((data) => {
            return data.show = true
         })
         setActivityLog(res.data.data)
         
      })
   }

   const renderCountry = () => {

		return state && state.map(data => {
			return <a className="dropdown-item" key={data.id}
			onClick={() =>{
				//setCurrentTab(0)
				getDataCenterById(data)
			} }>{data.name} </a>
		})
	}

   const handleChange = (e, id) => {
      setActivityLog(activityLog.map((data) => {
         if(id == data.user.uuid){
            data.show = e.target.checked
         }else{
            if(firstTimeCheck == 1){
               data.show = false
            }
         }
        
         setFirstTimeCheck(2)
         return data
      }))

      
   }

   const showUser = (e) => {
      if(e.target.value.length > 2){

      var condition = new RegExp(e.target.value.toLowerCase());

      var result = authContext.getUser.filter(function (el) {
      return condition.test(el.name.toLowerCase());
      });
      setUserList(result)
      }else{
         setUserList(authContext.getUser)
      }
   }

   const renderDataCenter = () => {

		return dataCenter && dataCenter.map((data, i) => {
			
			return (
				<li 
				className="nav-item" 
				key={i} 
				onClick={() => {
					setCurrentTab(data.id)
               getActivityLogs("data_center", data.id)
               setDataCenterName(data.name)
					//selectDataCenterFloor(data)
				}}>
					<a 
					href="#" 
					// className={`nav-link ${currentTab == 0 && i == 0 ?"active show":""}`}
               className={`nav-link`}
					>
						
						{data.name}
					</a>
				</li>
			)
		})
	}

   const showResults  = (data) => {
      setShowPopup(data)
   }

   // const closeResultPopup = () => {
   //    setShowPopup(false)
   // }

   const renderActivityLog = () => {
      return (
         activityLog && activityLog.map((data,i) => {
            return (data.show && <tr key={i}>
               <td>{ moment(data.date_change).format('YYYY-MM-DD hh:mm A') }</td>
               <td>{data.datacenter != null ? data.datacenter.name : 'N/A'}</td>
               <td>{data.user.name}</td>
               <td>{data.action_type.name}</td>
               <td>{data.entity_type.name}</td>
               <td><span className="badge badge-success badge-lg light">Success</span></td>
               {/* <td> <button className="btn btn-success" id="addneww" data-bs-toggle="modal" data-bs-target=".bd-example-modal-lg" onClick={()=> showResults(data)}> Show Result </button> </td> */}
            </tr>)
         })
      )
   }

   const renderUserList = () => {
      return (
         userList && userList.map((data, i) => {
            return (
               	<div className="form-check" key={i}>
                  <input className="form-check-input" type="checkbox" name=" checked flexRadioDefault" id={'flexRadioDefault'+i} onChange={(e) => handleChange(e, data.uuid)}/>
                  <label className="form-check-label" htmlFor={'flexRadioDefault'+i}>
                  {data.name}
                  </label>
               	</div>
            )
         })
      )
   }

    return(
		
		<Layout>
			<div className="content-body reports-block" >
				
            	<Navigation/>
               <hr className="main" />
				<div className="container-fluid pt-0">
        			  
        	
                      <div className="row">
                        <div className="col-xl-2 col-lg-2">
                            <div className="leftside">
                                <p> <a href="#"  className="plink active">System Activity</a> </p>
                            </div>
                        </div>
                  <div className="col-lg-10">
                     <div id="pro">
                        <div className="profile-tab">
                           <div className="custom-tab-1">
                              <div className="main_scrll">
                                 <div className="btn_ul">
                                    <ul className="nav nav-tabs mb-3">
                                 <li className="nav-item"> <button className="btn btn-secondary" style={{width: '100%'}} onClick={getAllDataCenter}> Global </button></li>
                                 <li className="nav-item">
                                    <div className="btn-group" role="group">
                                       <button type="button" className="btn btn-light dropdown-toggle" style={{width: '100%'}} data-bs-toggle="dropdown" aria-expanded="false"> {countryName} </button>
                                       <div className="dropdown-menu" style={{margin: '0px'}}>
                                          {renderCountry()}
                                       </div>
                                    </div>
                                 </li>
                                 </ul> 
                                 </div>
                                 <div className="ul_scrll">
                                    <ul className="nav nav-tabs mb-3">
                                 {renderDataCenter()} 
                              </ul>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="col-lg-12">
                     <div className="card" style={{minHeight: '20rem'}}>
                        <div className="card-body">
                           <div className="table-responsive">
                              <table className="table table-responsive-md">
                                 <thead>
                                    <tr>
                                       <th><strong>Timestamp</strong></th>
                                       <th><strong>Data Center</strong></th>
                                       <th><strong>User &nbsp;&nbsp;&nbsp; &nbsp;<span>
                                          <div className="btn-group" role="group">
                                         <img src="\images\sliders.svg" style={{cursor: "pointer"}} data-bs-toggle="dropdown" aria-expanded="false"/>
                                       <div className="dropdown-menu" style={{margin: "0px"}}>
                                          
                                          <div className="form-check" style={{paddingLeft: "0px",marginBottom: ".7rem"}}>
                                                            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Search" style={{marginLeft: "0px", height: "30px"}} onChange={(e) => showUser(e)}/>
                                                         </div>
                                          <div style={{maxHeight: '12rem', overflow: 'auto'}}>
                                          {renderUserList()}
                                          </div>
                                       </div>
                                    </div>

                                       </span></strong></th>
                                       <th><strong> Actions </strong></th>
                                       <th><strong> Entity </strong></th>
                                       <th><strong> Result</strong></th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {renderActivityLog()}
                                   
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

            {showPopup && <Result show={true} data={showPopup}/>}

        </Layout>
    )
}

export default Reports;