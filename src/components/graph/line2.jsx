import React from 'react';
import {numberFormat} from "common/helpers";

const Line2 = props => {

	const {
		inServiceText,
		availableText,
		inServicePercent,
		availablePercent,
		reserved,
		rofr,
		blocked,
		complete,
		reservedPer,
		rofrPer,
		blockedPer,
		completePer
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
				{reserved?(
					<div style={{
						textAlign:'center', 
						width:`${reservedPer}%`, 
						paddingRight:'0px'
					}}>{numberFormat(reserved)} </div>
				):null}
				{rofr?(
					<div style={{
						textAlign:'center', 
						width:`${rofrPer}%`, 
						paddingRight:'0px'
					}}>{numberFormat(rofr)} </div>
				):null}
				{blocked?(
					<div style={{
						textAlign:'center', 
						width:`${blockedPer}%`, 
						paddingRight:'0px'
					}}>{numberFormat(blocked)} </div>
				):null}
				{complete?(
					<div style={{
						textAlign:'center', 
						width:`${completePer}%`, 
						paddingRight:'0px'
					}}>{numberFormat(complete)} </div>
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
				<div style={{ 
					width:`${reservedPer}%`,
					backgroundColor:'#1b70c0',
					height:'0.3rem',
					float:'center'
				}} ></div>
				<div style={{ 
					width:`${rofrPer}%`,
					backgroundColor:'#595959',
					height:'0.3rem',
					float:'center'
				}} ></div>
				<div style={{ 
					width:`${blockedPer}%`,
					backgroundColor:'#000000',
					height:'0.3rem',
					float:'center'
				}} ></div>
				<div style={{ 
					width:`${completePer}%`,
					backgroundColor:'#c2adc2',
					height:'0.3rem',
					float:'center'
				}} ></div>

			</div>
		</div>
	);
}

export default Line2;
