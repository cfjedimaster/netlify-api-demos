require('dotenv').config();
const fetch = require('node-fetch');

const token = process.env.NETLIFY_TOKEN;
const siteId = process.env.NETLIFY_SITEID;

// simple function that given S seconds, returns either "s seconds" or "n.x minutes"
function formatTime(s) {
	if(s < 120) return `${s} seconds`;
	return `${(s/60).toFixed(1)} minutes`;
}

(async () => {
    let endpoint = `https://api.netlify.com/api/v1/sites/${siteId}/deploys`;
    let result = await fetch(endpoint, {
      headers: {
        'Authorization':`Bearer ${token}`
      }
    });
    
    let data = await result.json();
	let totalTime = data.reduce((prev, cur) => {
		return prev + cur.deploy_time;
	},0);
	let total = data.length;

	let avg = totalTime / total;

	let mintime = Number.MAX_SAFE_INTEGER;
	let maxtime = Number.MIN_SAFE_INTEGER;
	data.forEach(d => {
		if(d.deploy_time) {
			if(d.deploy_time > maxtime) maxtime = d.deploy_time;
			if(d.deploy_time < mintime) mintime = d.deploy_time;
		}
	});

	console.log(`I got ${total} deploys for an average build time of ${formatTime(avg)}. 
The smallest time was ${formatTime(mintime)} and the longest was ${formatTime(maxtime)}.`);
})()