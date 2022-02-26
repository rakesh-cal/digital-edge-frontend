import React from 'react';
import {numberFormat} from "common/helpers";

const Line = (props) => {

	let {
		inServiceText,
		availableText,
		totalText,
		inServicePercent,
		availablePercent,
		totalPercent
	} = props;

	inServiceText = isNaN(inServiceText) || inServiceText == null?0:inServiceText;
	availableText = isNaN(availableText) || availableText == null?0:availableText;
	totalText = isNaN(totalText) || totalText == null?0:totalText;

	return (
		<React.Fragment>
			<div 
			style={{
				textAlign:'left',
				font:"normal normal normal 11px/14px DM Sans",
				width:'100%'
				}}>{numberFormat(inServiceText)+'/'+numberFormat(availableText)}</div>

			<div style={{width: "100%"}} >
				{/*<div style={{
					backgroundColor:'#E0E2E5', 
					float:'left', 
					height:'4px', 
					width:`50%`
				}}>&nbsp;
				</div>*/}
				<div style={{
					backgroundColor:'#FE8600', 
					float:'left', 
					height:'4px', 
					width:`${inServicePercent}%`
				}}>&nbsp;
				</div>
				<div style={{
					backgroundColor:'#3FEB7B', 
					float:'left', 
					height:'4px', 
					width:`${availablePercent}%`
				}}>&nbsp;
				</div>
				
			</div>
		</React.Fragment>
	)
}


export default Line;