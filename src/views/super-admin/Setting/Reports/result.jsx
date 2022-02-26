import React,{useEffect,useState,useContext,useRef} from 'react';

const Result = (props) => {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const modalRef = useRef(null);

	useEffect(() => {
        setIsOpen(props.show);
        
	},[props.show]);

    const closeModal = () => {
		modalRef.current.click();
	}
	

    return (
        <div className="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true">
<div className="modal-dialog modal-lg">
<div className="modal-content">
<div className="modal-header mt-59">
<h3 className="modal-title"> Results </h3>
<button type="button" className="btn-close" data-bs-dismiss="modal" ref={modalRef}> </button></div>
<div className="modal-body">
<div className="card">
<div className="card-body" style={{padding:'0px'}}>
    <div className="basic-form">
        {props.data.new_value} 
    </div>
</div>
</div>												
</div>
</div>
</div>
</div>
    )

}

export default Result;


