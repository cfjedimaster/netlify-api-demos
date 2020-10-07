require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const token = process.env.NETLIFY_TOKEN;
const siteId = process.env.NETLIFY_SITEID;

// Earliest will be documented
let earliest = new Date(2019,10,1);

/*
to do, determine START DATE
look at cache and see what's done
do last+1 day + X more, probably 10
*/

/*
let begin = new Date(2019,10,1);
let end = new Date(begin);
end.setDate(begin.getDate() + 1);
console.log(begin, end);
*/
async function getForDay(from, siteId, token) {
	
	let to = new Date(from);
	to.setDate(from.getDate()+1);

	let url = `https://analytics.services.netlify.com/v1/${siteId}/pages?from=${from.getTime()}&to=${to.getTime()}&timezone=-0500&limit=99999`;
	
	let result = await fetch(url, {
		headers: {
			'Authorization':`Bearer ${token}`
		}
	});
	return (await result.json()).data;

}

/*
I look at my cache folder and see which files exist. Each file is
YYYY-MM-DD.json
and from this, I can figure out my most recent time
*/
function getLastCacheDate() {
	let files = fs.readdirSync('./cache');
	if(files.length === 0) return;
	let latest = new Date(1980,0,1);
	files.forEach(f => {
		let d = f.split('.')[0];
		let [y,m,dom] = d.split('-');
		let date = new Date(y, m-1, dom);
		if(date.getTime() > latest.getTime()) {
			latest = date;
		}
	});
	return latest;
}

(async () => {
	for(let i=0;i<1;i++) {
		let latest = getLastCacheDate();
		let begin = earliest;
		if(latest) {
			begin = new Date(latest);
			begin.setDate(latest.getDate()+1);
		} 

		console.log('Fetch for '+begin);
		let data = await getForDay(begin, siteId, token);
		console.log(`Data loaded, ${data.length} items`);
		let fileName = `./cache/${begin.getFullYear()}-${(begin.getMonth()+1)}-${begin.getDate()}.json`;
		fs.writeFileSync(fileName, JSON.stringify(data), 'utf-8');
		console.log(`${fileName} written.`);
	}
})();