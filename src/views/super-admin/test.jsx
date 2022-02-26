import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const data = {
   
    datasets: [
        {
            data: [300, 300],
            backgroundColor: [
                "#FE8600",
                "#3FEB7B"
            ],
            hoverBackgroundColor: [
                "#FE8600",
                "#3FEB7B"
            ],
            borderColor: [
              	"#FE8600",
                "#3FEB7B"
            ],
            borderWidth: 3
        }]
};

const test = ()  => {

  return(
  	<div style={{height:"200px",width:"200px"}} className="outer">
  		<Doughnut 
  		data={data}
  		options={{
  			maintainAspectRatio: false ,
  			rotation: -90,
  			circumference: 180,
  			legend: {
                display: false
            },
            tooltip: {
                enabled: false
            },
           	cutout: 70
  		}}
  		/>
  		 <p className="percent">89 <p>Floors</p> </p>	
  	</div>
  ) 
  
}

export default test;
