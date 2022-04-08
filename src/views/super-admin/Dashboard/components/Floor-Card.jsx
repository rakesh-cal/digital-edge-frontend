import React from 'react';
import { floorData } from '../data';
import FloorTable from './FloorTable';

const FloorCard = ({
	selectedDataCenter,
	selectedFloor,
	selectFloor,
	setFloorSort,
	floorSort
}) => {
	return(
		<div className="col-lg-5 col-md-12 col-sm-12 col-12">
			<div className="grid_card h-100">
				<div className="inv mb-0">
					<div className="card_head">
						<div className="txt_card">
							<h3>Floors</h3>
						</div>
						{/*<div className="txt_card" >
							<h3 style={{
						 color: "#92979A",
						 fontSize: "0.875rem!important",
						 fontWeight: 400}}>Sold/Available</h3>
						</div>*/}

					<div className="txt_card_2">
						<p>
							<img src="/images/orange.png" width="13px"/> Sold
						</p>
						<p>
							<img src="/images/green.png" width="13px" /> Available
						</p>
					</div>
					</div>
                    <div className='table_scrll'>
					<FloorTable 
					floorData={floorData} 
					selectedDataCenter={selectedDataCenter}
					selectedFloor={selectedFloor}
					selectFloor={selectFloor}
					setFloorSort={setFloorSort}
					floorSort={floorSort}
					/>
					</div>
					
				</div>
			</div>
		</div>
	)
}

export default FloorCard;