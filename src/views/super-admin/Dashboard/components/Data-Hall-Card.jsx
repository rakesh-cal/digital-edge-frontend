import React,{useEffect,useState,useContext,useRef} from 'react';
import DataHallTable from './Data-Hall-Table';
import { hallData } from '../data';
import CabinetPopup from './Cabinet-Popup'
import CabinetServices from "../../../../services/CabinetService";
import AuthContext from "context";

const DataHallCard = ({selectedFloor, selectedDataCenter}) => {
	const authContext = useContext(AuthContext);

	const [showPopup, setShowPopup] = useState("")
	const [show, setShow] = useState(false)
	const [dataHallName, setDataHallName] = useState("")

	const getCabinetData = async(id, name) => {
		setDataHallName(name)
		await CabinetServices.selectByHallId(authContext.token(),{data_hall_id: id}).then(res => {
			setShowPopup(res.data)
			setShow(true)
		});
	}

	return(
		<div className="col-lg-7 col-md-12 col-sm-12 col-12">
			<div className="grid_card h-100">
				<div className="card_head">
					<div className="txt_card">
						<h3>Data Halls</h3>
					</div>
				
					<div className="txt_card_2">
						<p>
							<img src="/images/orange.png" width="13px"/> In Services
						</p>
						<p>
							<img src="/images/green.png" width="13px" /> Available
						</p>
					</div>
				</div>
				<div className="card-body">
					<div className="table-responsive">
					<DataHallTable hallData={hallData} selectedFloor={selectedFloor} getCabinetData={getCabinetData} selectedDataCenter={selectedDataCenter}/>
					</div>
				</div>
			</div>
			{show && <CabinetPopup show={show} data={showPopup} setShow={setShow} dataHallName={dataHallName} selectedFloor={selectedFloor} selectedDataCenter={selectedDataCenter}/>}
		</div>
	)
}

export default DataHallCard;