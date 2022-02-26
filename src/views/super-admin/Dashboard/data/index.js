const cardData = [
		{
			title: 'Floors',
			graph: [],
			totalNumber:0,
			className:'',
			types:[
				{
					title:"In Services",
					imagePath:"/images/orange.png"
				},
				{
					title:"Unavailable",
					imagePath:"/images/gray.png"
				}
			]
		},
		{
			title: 'Cabinets',
			graph: [],
			className:'',
			totalNumber:0,
			types:[
				{
					title:"In Services",
					imagePath:"/images/orange.png"
				},
				{
					title:"Available",
					imagePath:"/images/green.png"
				}
			]
		},
		{
			title: 'Cages',
			graph: [0,0],
			className:'grid_mr',
			totalNumber:0,
			types:[
				{
					title:"In Services",
					imagePath:"/images/orange.png"
				},
				{
					title:"Available",
					imagePath:"/images/green.png"
				}
			]
		},
		{
			title: 'Power (kW)',
			graph: [],
			className:'',
			totalNumber:0,
			types:[
				{
					title:"In Services",
					imagePath:"/images/orange.png"
				},
				{
					title:"Available",
					imagePath:"/images/green.png"
				}
			]
		}
		
	];
	const floorData = [
		{
			floor: '6F',
			cabinet:'/images/line-x.png',
			power:'/images/line-x.png',
			cage:'/images/line-x.png',
			group:'/images/Group 3647.svg'
		},
		{
			floor: '6F',
			cabinet:'/images/line-x.png',
			power:'/images/line-x.png',
			cage:'/images/line-x.png',
			group:'/images/Group 3647.svg'
		},
		{
			floor: '6F',
			cabinet:'/images/line-x.png',
			power:'/images/line-x.png',
			cage:'/images/line-x.png',
			group:'/images/Group 3647.svg'
		},
		{
			floor: '6F',
			cabinet:'/images/line-x.png',
			power:'/images/line-x.png',
			cage:'/images/line-x.png',
			group:'/images/Group 3647.svg'
		},
		{
			floor: '6F',
			cabinet:'/images/line-x.png',
			power:'/images/line-x.png',
			cage:'/images/line-x.png',
			group:'/images/Group 3647.svg'
		}
	];

	const hallData = [
		{
			title:"Level 3(N)",
			cabinet:"/images/line-xx.png",
			power:"/images/line-xx.png",
			cage:"/images/line-xx.png",
			layout:"/images/Group 3647.svg"
		},
		{
			title:"Level 3(N)",
			cabinet:"/images/line-xx.png",
			power:"/images/line-xx.png",
			cage:"/images/line-xx.png",
			layout:"/images/Group 3647.svg"
		}
	];



export {
	cardData,
	floorData,
	hallData
}