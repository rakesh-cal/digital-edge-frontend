import React from 'react';

const XCard = (props) => {

	return (
		<div className="authincation-content">
			<div className="row no-gutters">
				<div className="col-xl-12">
					<div className="auth-form">
						<h3 className="log_m"> {props.title} </h3>
						{props.children}
					</div>
				</div>
			</div>
		</div>
	);
}

export default XCard;