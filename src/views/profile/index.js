import React,{useState,useEffect,useRef,useContext} from 'react';
import AuthContext from "context";
import Layout from "../super-admin/Layouts";
import { XError } from 'components/common';
import Swal from 'sweetalert2'
import ProfileService from "../../services/profileService"
import './profile-style.css'

const Profile = () => {

	const contextStore = useContext(AuthContext);
    const [isLoading,setIsLoading] = useState(false);
    const [state,setState] = useState({
        name: contextStore.getAuth.name,
        email: contextStore.getAuth.email,
        profile_img: contextStore.getAuth.profile_img,
        role: contextStore.getAuth.role.name,
        country: contextStore.getAuth.country.name,
        status: contextStore.getAuth.status,
        image: "",
        password: "",
        confirm_password: ""
	});
    const [error,setError] = useState({
		name:"",
        email: "",
        password: "",
        confirm_password: ""
	}); 

    const getUserData = async () => {
        await ProfileService.get(contextStore.token()).then(res => {
           
            setState({...state,
                name: res.data.data.name,
                email: res.data.data.email,
                profile_img: res.data.data.profile_img,
                role: res.data.data.role.name,
                country: res.data.data.country.name,
                status: res.data.data.status
            });
        });
    }

    const onSubmit = async () => {
        // setState({...state,data_center_id: props.data_center_id})
         setIsLoading(true);
         //if(checkValidation()){
           // setState({...state,floor_id:props.floor_data.id})
             
             await ProfileService.update(contextStore.token(),state).then(async res => {
                 contextStore.setAuth(res.data.data)
                 setIsLoading(false);
                 //props.selectDataCenterFloor(props.data_center_id);
                 //closeModal();
                 setError({
                    name:"",
                    email: "",
                    password: "",
                    confirm_password: ""
                 })
                 Swal.fire('Profile Updated');
                 //props.selectDataCenterFloor(props.dataCenterId)
 
             }).catch(err => {
 
                 setIsLoading(false);
                 let error = {
                     "name":"",
                     "email": "",
                     "password": "",
                     "confirm_password":""
                 };
                 const errors = err?.response?.data?.errors;
 
                 if(errors?.name !== undefined || errors?.name !== "" || errors?.name !== null){
                     error.name = errors.name;
                 }

                 if(errors?.email !== undefined || errors?.email !== "" || errors?.email !== null){
                    error.email = errors.email;
                }

                if(errors?.password !== undefined || errors?.password !== "" || errors?.password !== null){
                    error.password = errors.password;
                }

                if(errors?.confirm_password !== undefined || errors?.confirm_password !== "" || errors?.confirm_password !== null){
                    error.confirm_password = errors.confirm_password;
                }
                 
 
                 setError({...error});
             })
        // }else{
            // setIsLoading(false);
        // }
     }

    const renderProfileImage = () => {
        if(state?.profile_img != "" && state?.profile_img != null && state?.profile_img != undefined ){
            return <div class="p-image-2">
            <img src={state?.profile_img}/>
            <label class="edit_profile_dg" style={{cursor: "pointer"}} for="actual-file2"><img src="images/edit1.png"/></label>
            <input class="file-upload" type="file" id="actual-file2" accept="image/*" onChange={onChangePicture}/>
         </div>
        }else{
            return <div class="p-image">
            <label style={{background: "#F3F4F9", padding: "36px 35px", borderRadius: "10px", cursor: "pointer"}} for="actual-file"><img src="images/upload icon.svg"/></label>
            <input class="file-upload" type="file" id="actual-file" accept="image/*" onChange={onChangePicture}/>
         </div>
        }
        
    }

    const onChangePicture = e => {
        if (e.target.files[0]) {
       
          var FR= new FileReader();
    
        FR.addEventListener("load", function(e) {
            setState({...state,
                profile_img: e.target.result,
                image: e.target.result
            });
        });
        FR.readAsDataURL( e.target.files[0] );
        }
       
      };

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

    return(
    
        <Layout>
    <div class="container-fluid">
    <div class="row">
       <div class="main_profile">
          <div class="profile_head">
             <h3>Profile {getStatus(state.status)} </h3>
          </div>
          <div class="profile_info_start mt-4">
             <h3>General information</h3>
          </div>
          <div class="upload_profile">
              {
                  renderProfileImage()
              }
             
          </div>
          <div class="form_start">
             <div class="row">
                <div class="col-12 col-sm-6 col-md-6 col-lg-6">
                   <label class="form-label"> Name</label>
                   <input type="text" class="form-control" placeholder="Jennifer" value={state?.name} onChange={event => setState({...state,name:event.target.value})}/>
                   <XError message={error.name} />
                   <div class="country_role_info">
                      <p>Country: <strong>{state.country}</strong></p>
                      <p>Role: <strong>{state.role}</strong></p>
                   </div>
                </div>
                <div class="col-12 col-sm-6 col-md-6 col-lg-6">
                   <label class="form-label">Email/Username</label>
                   <input type="text" class="form-control" placeholder="jennifersmith@mail.com" value={state?.email} onChange={event => setState({...state,email:event.target.value})}/>
                   <XError message={error.email} />
                </div>
             </div>
             <div class="profile_info_start mt-2">
                <h3>Change Password</h3>
             </div>
             <div class="row mt-4">
                <div class="col-12 col-sm-6 col-md-6 col-lg-6">
                   <label class="form-label">New password</label>
                   <input type="password" class="form-control" onChange={event => setState({...state,password:event.target.value})}/>
                   <XError message={error.password} />
                </div>
                <div class="col-12 col-sm-6 col-md-6 col-lg-6">
                   <label class="form-label">Confirm new password</label>
                   <input type="password" class="form-control" onChange={event => setState({...state,confirm_password:event.target.value})}/>
                   <XError message={error.confirm_password} />
                </div>
             </div>
             <div class="cnfrm_change mt-4">
             {isLoading?(
	                <button type="submit" class="btn btn-primary" >Saving Changes ... </button>
	                ):(
                        <button type="submit" class="btn btn-primary" onClick={() => onSubmit()}>Confirm Changes</button>
	                )
	            }
                <button type="button" class="btn btn-outline-primary" style={{"border-radius": "5px"}} onClick={() => window.history.back()}> Cancel </button>
             </div>
          </div>
       </div>
    </div>
 </div>
 </Layout>)
}

export default Profile;