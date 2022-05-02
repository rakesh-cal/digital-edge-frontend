import React,{useEffect,useState,useContext} from 'react';
import Layout from "../../Layouts";
import RoleModel from "services/roleServices";
import CreateRole from "./createRole";
import UpdateRole from "./updateRole";
import Navigation from "../Component/Navigation";
import StorageContext from "context";
import CommonService from 'services/commonService';

const Setting = () => {

const contextStore = useContext(StorageContext);
const [state,setState] = useState([]);
const [updateData,setUpdateData] = useState({});
const [show,setShow] = useState(false);
const [permission,setPermission] = useState([]);

	useEffect(() => {

		getData();
		if (contextStore.getPermission.length) {

			setPermission(contextStore.getPermission);			
		}else{

			CommonService.permission().then(res => {

				setPermission(res.data.permission);
				contextStore.setPermission(res.data.permission);

			}).catch(err => {
				/*404 page*/
			})
		}

	},[contextStore.getRole]);

	const getData = async () => {

		const roleData = contextStore.getRole;
		
		if (roleData.length) {
			
			setState(roleData);

		}else{

			await RoleModel.roleAndPermission(contextStore.token()).then(res => {
				setState(res.data.data);
				contextStore.setRole(res.data.data);
			});
		}
	}

	const arrayToString = (data) => {

		let convertJson = JSON.parse(data);
		let extractValue = [];
		let implode = "";

		extractValue = convertJson.map(a => a.name);

		if (extractValue) {
			implode = extractValue.join();
		}

		return implode;

	}
	const arrayToString2 = (data) => {

		let convertJson = JSON.parse(data);
		let extractValue = [];
		let implode = "";

		extractValue = convertJson.map(a => a.value);

		if (extractValue) {
			implode = extractValue.join();
		}

		return implode;

	}
	const permissionView = id => {

		let status = "";
		switch (id) {
			case 1:
				status = <i className="fas fa-times text-danger"></i>;
				break;
			case 2:
				status = 'R';
				break;
			default:
				status = 'RW';
				break;
		}
		return status;
	}
	const openEditModel = data => {

		//$("#editModel").modal('show');
		setUpdateData(data);
		setShow(true);
	}

		const checkstatus = status => {
			let htmlStatus = "";
			switch (status) {
				case 1:
					htmlStatus = <span 
					className="badge badge-success badge-lg light"
					
					>Active</span>
					break;
				default:
					htmlStatus = <span 
					
					className="badge badge-danger badge-lg light">Archive</span>
					break;
			}
			return htmlStatus; 
		}

		const dataCenterName = datacenter => {
			if(datacenter.length > 0){
				let dataCenterCombine = ""

				datacenter.forEach(element => {
					dataCenterCombine += element.datacenter.name+", "
				});
				dataCenterCombine = dataCenterCombine.replace(/,\s*$/, "");
				return dataCenterCombine
			}else{
				return "All"
			}
		}


	const renderItem = () => {

		return state && state.map(data => {

			return (
				<tr key={data.uuid} className="setting-table">
				    <td> {data?.name} </td>
				    <td className="center-col"> {data.country?.name} </td>
				    <td className="center-col">{dataCenterName(data.role_datacenter)}</td>
				    <td>{permissionView(data.space)}</td>
				    <td>{permissionView(data.m_e)}</td>
				    <td>{permissionView(data.network)}</td>
				    <td className="center-col">
				        {data.user_management === 0?
				        <i className="fas fa-times text-danger"></i>:<img src="/images/check.svg" />
				        }

				    </td>
				    <td className="center-col">
				       {checkstatus(data.is_active)}

				    </td>
				    	{contextStore.getAuth.role.country_id === 6?(

				    <td className="center-col">
				        <p> 
				        <a 
				        className="edit"
				       	onClick={() => openEditModel(data)}
				        style={{cursor:"pointer"}}
				       >    
				        <i className="fas fa-edit"></i> </a> </p>
				       
				    </td>
				    	):null}
				</tr>
			);
		})
	}

return (
<Layout>
    <div className="content-body">
    	<Navigation/>
        <hr className="main" />
        <div className="container-fluid">

        

            <div className="row">
				<div className='col-12 col-sm-2'>
				<div className="add-new-button">
					{contextStore.getAuth.role.country_id === 6?(
                    <a href="#" id="addnew" className="btn btn-primary me-3 btn-sm" data-bs-toggle="modal" data-bs-target=".bd-example-modal-lg">
                        <img src="/images/plus-circle.svg" />&nbsp; Add New Role
                    </a>
					):null}
                    <CreateRole 
                    retriveCurrentData={getData} 
                    permission={permission}
                    token={contextStore.token()}/>

                </div>
				</div>
                


                {show === true?(
				<UpdateRole 
				token={contextStore.token()} 
				data={updateData} 
				show={show}
				setShow={setShow}
				permission={permission}
				retriveCurrentData={getData}
				/>
                ):null}

            </div>
            <div className="col-lg-12">
                <div className="card">

                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-responsive-md">
                                <thead>
                                    <tr>

                                        <th><strong> Role Name </strong></th>
                                        <th className="center-col"><strong> Country </strong></th>
                                        <th className="center-col"><strong> Data Centres </strong></th>
                                        <th><strong> Space </strong></th>
                                        <th><strong> M&E </strong></th>
                                        <th><strong> Network </strong></th>
                                        <th className="center-col"><strong> User </strong></th>
                                        <th className="center-col"><strong> Status </strong></th>
                                        	{contextStore.getAuth.role.country_id === 6?(

                                        <th className="center-col"><strong> Actions </strong></th>
                                        	):null}
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderItem()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</Layout>
);
}

export default Setting;