import React,{useEffect,useState,useContext} from 'react';
import Layout from "../../Layouts";
import Navigation from "../Component/Navigation";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import UserModal from "services/userServices";
import moment from "moment";
import StorageContext from "context";

const User = () => {

	const contextStore = useContext(StorageContext);
	const [state,setState] = useState();
	const [updateData,setUpdateData] = useState({});
	const [show,setShow] = useState(false);

	useEffect(() => {

		getAllUsers();

	},[contextStore.getUser]);

	const getAllUsers = async () => {
		
		const users = contextStore.getUser;

		if(users.length){
			setState(users);
		}else{

			const data = await UserModal.index(contextStore.token());
			setState(data?.data?.data);
			contextStore.setUser(data?.data?.data);
		}
	}

	const getStatus = status => {

		let stringStatus = "";

		switch (status) {
			case 0:
				stringStatus = <span 
				className="badge badge-warning badge-lg light"
				//style={{width:"50%"}}
				>Pending</span>;
				break;
			case 1:
				stringStatus = <span 
				className="badge badge-success badge-lg light"
				//style={{width:"50%"}}
				>Active</span>;
				break;
			case 2:
				stringStatus = <span 
				className="badge badge-danger badge-lg light"
				style={{width:"50%"}}
				>Inactive</span>;
				break;
			default:
				stringStatus = <span 
				className="badge badge-success badge-lg light"
				//style={{width:"50%"}}
				>Active</span>;
				break;
		}


		return stringStatus;
	}

	const changeStatus = async (status,uuid) => {


		await UserModal.changeStatus(contextStore.token(),{status,uuid}).then(async res => {
			
			getAllUsers();

		}).catch(err => {

			// redirect to 500 page
		});
	}

	const renderHtml = () => {

		return state && state.map( user => {
		
			return (
				<tr key={user.uuid} className="setting-table">
				    <td> {user.email} </td>
				    <td> {user.name} </td>
				    <td> {user.role?.name || ""} </td>
				    <td> {user.country?.name || ""} </td>
				    <td> { moment(user.updated_at).format('YYYY-MM-DD hh:mm A') } </td>
				    <td> { getStatus(user.status) } </td>
				    <td><p > 
				        <a 
				        className="edit"
				        onClick={() => openEditModel(user)}
				        style={{cursor:"pointer"}}
				       >    
				        <i className="fas fa-edit"></i> </a> </p></td>
				</tr>
			)
			
		});
	}
	const openEditModel = data => {

		setUpdateData(data);
		setShow(true);
	}

	return(
		<Layout>
			<div className="content-body">
        			<Navigation/>
        			 <hr className="main" />
        		<div className="container-fluid">
        			<div className="row"> 
					   
					    	<div className='col-12 col-sm-2'>
							<a href="#" 
					    	id="addnew" 
					    	className="btn btn-primary me-3 btn-sm" 
					    	data-bs-toggle="modal" 
					    	data-bs-target=".bd-example-modal-lg"
					    	><img src="/images/plus-circle.svg" />&nbsp; Add New User  </a>	
							</div>
					    	

		               		<CreateUser 
		               		retriveCurrentData={getAllUsers}
		               		token={contextStore.token()}
		               		/>
		               		{show === true?(
								<UpdateUser 
								token={contextStore.token()} 
								data={updateData} 
								show={show}
								setShow={setShow}
								retriveCurrentData={getAllUsers}
								/>
				                ):null}
						
					
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-responsive-md">
                                        <thead>
                                            <tr>
                                                <th><strong> Username/Email </strong></th>
                                                <th><strong> Name </strong></th>
                                                <th><strong> Roles </strong></th>
                                                <th><strong> Country </strong></th>
                                                <th><strong> Last Activity </strong></th>
												<th><strong> Status </strong></th>
												<th><strong> Actions </strong></th>												
												
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
										
                                              {renderHtml()}										
 
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
 
                </div>
				</div>
			</div>
		</Layout>
	)
}

export default User;
