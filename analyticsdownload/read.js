const fs = require('fs');

let files = fs.readdirSync('./cache');
let fileData = {};

files.forEach(f => {
	let data = JSON.parse(fs.readFileSync('./cache/'+f, 'UTF-8'));
	data.forEach(i => {
		if(!fileData[i.path]) fileData[i.path]=0;
		fileData[i.path] += parseInt(i.count,10);
	});
});

let keys = Object.keys(fileData);
keys = keys.sort((a,b) => {
	if(fileData[a] < fileData[b]) return 1;
	if(fileData[a] > fileData[b]) return -1;
	return 0;
});


let sorted = [];

keys.forEach(k => {
	sorted.push({path:k, views:fileData[k]});
	//console.log(k.padEnd(80)+' '+fileData[k]);
});
console.log(JSON.stringify(sorted));
/*
let total = 0;
for(let k in fileData) {
	total += fileData[k];
}
*/
//console.log(`Total page views: ${total}`);