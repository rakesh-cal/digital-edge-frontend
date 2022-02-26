import React from 'react';
import {numberFormat} from "common/helpers";

const Line2 = props => {

	const {
		inServiceText,
		availableText,
		inServicePercent,
		availablePercent
	} = props;

	return(
		<div style={{width:"100%"}}>
			<div className="graph-line">
				{inServiceText?(
				<div style={{
					textAlign:'center', 
					width:`${inServicePercent}%`,
					 paddingRight:'0px',

					}}>{numberFormat(inServiceText)}</div>
				):null}
				{availableText?(
					<div style={{
						textAlign:'center', 
						width:`${availablePercent}%`, 
						paddingRight:'0px'
					}}>{numberFormat(availableText)} </div>
				):null}
			</div>

			<div className="graph-line">
				
				<div style={{ 
					width:`${inServicePercent}%`,
					backgroundColor:'#FE8600',
					height:'0.3rem',
					float:'center'
				}} ></div>

				<div style={{ 
					width:`${availablePercent}%`,
					backgroundColor:'#3FEB7B',
					height:'0.3rem',
					float:'center'
				}} ></div>

			</div>
		</div>
	);
}

export default Line2;
