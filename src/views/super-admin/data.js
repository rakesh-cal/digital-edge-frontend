const nodeDataArray = [
		  { key: "IDF3",isGroup: true },
		  { key: "IDF1",isGroup: true },
		/*  { key: "MMR-2B",isGroup: true },
		  { key: "Weak Current Room",isGroup: true },*/
		  { key: "MMR-1",isGroup: true },
		  { key: "MMR-2A",isGroup: true },
		  { key: "PEK-1-03-IDF3-0001", group: "IDF3" },
		  { key: "PEK-1-03-IDF3-0002", group: "IDF3" },
		/*  { key: "PEK-1-02-IDF3-0001", group: "IDF1" },*/
		  { key: "PEK-1-02-IDF3-0002", group: "IDF1" },
		  /*{ key: "PEK-1-02-IDF3-0003", group: "IDF1" },*/
		 /* { key: "PEK-1-02-MMR2B-0101", group: "MMR-2B" },
		  { key: "PEK-1-02-MMR2B-0102", group: "MMR-2B" },
		  { key: "PEK-1-02-MMR2B-0103", group: "MMR-2B" },
		  { key: "PEK-1-02-MMR2B-0104", group: "MMR-2B" },
		  { key: "PEK-1-02-MMR2B-0105", group: "MMR-2B" },*/
		  /*{ key: "PEK-1-02-W1-1-000-0101", group: "Weak Current Room" },
		  { key: "PEK-1-02-W1-1-000-0102", group: "Weak Current Room" },*/
		/*  { key: "PEK-1-01-MMR1-0101", group: "MMR-1" },
		  { key: "PEK-1-01-MMR1-0102", group: "MMR-1" },
		  { key: "PEK-1-01-MMR1-0103", group: "MMR-1" },
		  { key: "PEK-1-01-MMR1-0104", group: "MMR-1" },
		  { key: "PEK-1-01-MMR1-0105", group: "MMR-1" },*/
		  { key: "PEK-1-01-MMR1-0205", group: "MMR-1" },
		/*  { key: "PEK-1-01-MMR1-0204", group: "MMR-1" },
		  { key: "PEK-1-01-MMR1-0203", group: "MMR-1" },
		  { key: "PEK-1-01-MMR1-0202", group: "MMR-1" },
		  { key: "PEK-1-01-MMR1-0201", group: "MMR-1" },*/
		/*  { key: "PEK-1-02-MMR2A-0101", group: "MMR-2A" },
		  { key: "PEK-1-02-MMR2A-0102", group: "MMR-2A" },
		  { key: "PEK-1-02-MMR2A-0103", group: "MMR-2A" },*/
		  { key: "PEK-1-02-MMR2A-0104", group: "MMR-2A" },
		  /*{ key: "PEK-1-02-MMR2A-0105", group: "MMR-2A" },*/
		  
		];

	const linkDataArray = [
		  	{ 
		  		from: "PEK-1-03-IDF3-0001", 
		  		to: "PEK-1-02-MMR2A-0104",
		  		progress:{
		  			status:true,
		  			color:"#147AD6"
		  		},
		  		data:{
		  			from: "PEK-1-03-IDF3-0001", 
		  			to: "PEK-1-02-MMR2A-0104",
		  		},
		  		text:"Cabinet 1" 
		  	},
		  	{ 
		  		from: "PEK-1-01-MMR1-0205",
		  		to: "PEK-1-03-IDF3-0001", 
		  		progress:{
		  			status:true,
		  			color:"#E03138"
		  		},
		  		data:{
		  			from: "PEK-1-03-IDF3-0001", 
		  			to: "PEK-1-01-MMR1-0205",
		  		},
		  		text:"Cabinet 1" 
		  	},
		  	{ 
		  		from: "PEK-1-03-IDF3-0002",
		  		to: "PEK-1-02-IDF3-0002",
		  		progress:{
		  			status:true,
		  			color:"#E03138"
		  		},
		  		data:{
		  			from: "PEK-1-03-IDF3-0002",
		  			to: "PEK-1-02-IDF3-0002",
		  		},
		  		text:"Cabinet 2" 
		  	},
		  	/*{ 
		  		from: "PEK-1-02-IDF3-0001",
		  		to: "PEK-1-02-MMR2A-0104",
		  		progress:{
		  			status:true,
		  			color:"#147AD6"
		  		},
		  		data:{
		  			from: "PEK-1-02-IDF3-0001",
		  			to: "PEK-1-02-MMR2A-0104",
		  		},
		  		text:"Cabinet 2" 
		  	},
		  	{ 
		  		from: "PEK-1-02-IDF3-0001",
		  		to: "PEK-1-01-MMR1-0205",
		  		progress:{
		  			status:true,
		  			color:"#FF13F2"
		  		},
		  		data:{
		  			from: "PEK-1-02-IDF3-0001",
		  			to: "PEK-1-01-MMR1-0205",
		  		},
		  		text:"Cabinet 2" 
		  	},
		  	{ 
		  		from: "PEK-1-01-MMR1-0204",
		  		to: "PEK-1-02-MMR2B-0103",
		  		progress:{
		  			status:true,
		  			color:"#E03138"
		  		},
		  		data:{
		  			from: "PEK-1-01-MMR1-0204",
		  			to: "PEK-1-02-MMR2B-0103",
		  		},
		  		text:"Cabinet 2" 
		  	},
		  	{ 
		  		from: "PEK-1-02-MMR2B-0103",
		  		to: "PEK-1-02-MMR2A-0104",
		  		progress:{
		  			status:true,
		  			color:"#3CF2F2"
		  		},
		  		data:{
		  			from: "PEK-1-02-MMR2B-0103",
		  			to: "PEK-1-02-MMR2A-0104",
		  		},
		  		text:"Cabinet 2" 
		  	},
		  	{ 
		  		from: "PEK-1-02-MMR2B-0104",
		  		to: "PEK-1-02-W1-1-000-0102",
		  		progress:{
		  			status:true,
		  			color:"#147AD6"
		  		},
		  		data:{
		  			from: "PEK-1-02-MMR2B-0104",
		  			to: "PEK-1-02-W1-1-000-0102",
		  		},
		  		text:"Cabinet 2" 
		  	},
		  	*/
		];

	const dataHallsArray = {
		"1F":[{name:"MMR-1"},{name:"MMR-2A"}],
		"2F":[{name:"IDF1"},{name:"MMR-2B"},{name:"Weak Current Room"}],
		"3F":[{name:"IDF3"}],
	}

export {
	nodeDataArray,
	linkDataArray,
	dataHallsArray
}