import React,{useEffect,useRef} from 'react';
import './cabinet-popup.css'

const CabinetPopup = (props) => {
    const [status, setStatus] = React.useState(['In Service', 'Complete', 'Construction', 'Planning'])
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const modalRef = useRef(null);
    
	useEffect(() => {
        setIsOpen(props.show);
        
	},[props.show]);

    const closeModal = () => {
		modalRef.current.click();
	}
	
    const returnEdited = (data, data_hall_id, data_center, selectedFloor, jsondata) => {
      // data = data.replace(/PEK1-3-3-C-001/g, props.dataHallName)
       var newdata = data.replace(/images/g, 'images/'+props.data?.dataHallHtml.data_hall.floor.datacenter.country_id+'/'+props.data?.dataHallHtml.data_hall.floor.data_center_id+'/'+props.data?.dataHallHtml.data_hall.floor_id+'/'+props.data?.dataHallHtml.data_hall.id)
       var xmlString = newdata;
       var doc = new DOMParser().parseFromString(xmlString, "text/html");
        
       
      setTimeout(function(){
        jsondata.forEach((val) => {
            let article = document.querySelector('#title-'+val.id);
            //article.textContent = val.name.split("-")[5]
             let allChildren = document.querySelectorAll("#popup-"+val.id+" .content > p");
            allChildren[1].textContent = status[val.status-1]
            allChildren[3].textContent = val.customer
            allChildren[5].textContent = val.max_kw != null ? parseFloat(val.max_kw).toFixed(3) : 0
            allChildren[7].textContent = val.num_breakers != null ? val.num_breakers : 0
            allChildren[9].textContent = val.num_xconnents != null ? val.num_xconnents : 0
        })
    },100)
        
        return newdata
    }


    return (
        <div>
            {
            props.data?.dataHallHtml == null && 
                <div className="not-found-popup modal show bd-example-modal-lg" style={{display:"block"}} id="exampleModalCenter">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                    <div className="modal-header mt-24">
                        <h3 class="modal-title notfound">Info not found
                        </h3>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" ref={modalRef} onClick={() => props.setShow(false)}> </button></div>
                    </div>
                </div>
                </div>
            }
            {
                    props.data?.dataHallHtml != null && 
                <div className="cabinet-popup modal show bd-example-modal-lg" style={{display:"block"}} id="exampleModalCenter">
        <div className="modal-dialog modal-lg">
                

                
                    <div className="modal-content">
                    <div className="modal-header mt-24">
                    {props.data?.dataHallHtml != null && 
                        <h3 className="modal-title">
                        {'Layout - '+props.dataHallName}
                        </h3>
                        }
                    <button type="button" className="btn-close" data-bs-dismiss="modal" ref={modalRef} onClick={() => props.setShow(false)}> </button></div>
                    {
                        props.data?.dataHallHtml != null && <div dangerouslySetInnerHTML={{ __html: returnEdited(props.data?.dataHallHtml.html, props.data?.dataHallHtml?.data_hall_id, props.selectedDataCenter, props.selectedFloor, props.data.data) }} />
                    }
                    </div>
                
        </div>
        </div>
        }
</div>
    )

}

export default CabinetPopup;


