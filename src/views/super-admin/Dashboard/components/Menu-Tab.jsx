import React from 'react';

const MenuTab = ({setMenuTab,menuTab}) => {

	//Status
	//Inventory = 1;
	//Capacity = 2;
	//Cabling = 3;

	const onMenuChange = menu => {

		switch(menu) {
		  	case 1:
		    	setMenuTab({
		    		inventory: true,
					capacity:false,
					cabling:false
		    	});
		    break;
		  	case 2:
		    	setMenuTab({
		    		inventory: false,
					capacity:true,
					cabling:false
		    	})
		    break;
		    case 3:
		    	setMenuTab({
		    		inventory: false,
					capacity:false,
					cabling:true
		    	})
		    break;
		  default:
		    	setMenuTab({
		    		inventory: true,
					capacity:false,
					cabling:false
		    	})
		}
	}

	return(
		<div className="profile-tab menu_tab_btn">
			<div className="custom-tab-1">
				<ul className="nav nav-tabs">
					<li className="nav-item" onClick={() => onMenuChange(1)} style={{cursor:"pointer"}}> 
						<button 
						className={menuTab.inventory?"btn btn-secondary":"btn btn-light"} 
						type="button" >
							Inventory2
						</button>
					</li>
					<li className="nav-item" onClick={() => onMenuChange(2)} style={{cursor:"pointer"}}> 
						<button 
						className={menuTab.capacity?"btn btn-secondary":"btn btn-light"}  
						type="button"
						
						> 
							Capacity
						</button>
					</li>
					<li className="nav-item" onClick={() => onMenuChange(3)} style={{cursor:"pointer"}}> 
						<button 
						className={menuTab.cabling?"btn btn-secondary":"btn btn-light"} 
						type="button"
						
						> 
							Cabling
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default MenuTab;