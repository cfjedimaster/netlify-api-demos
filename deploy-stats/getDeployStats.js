require('dotenv').config();
const fetch = require('node-fetch');

const token = process.env.NETLIFY_TOKEN;
const siteId = process.env.NETLIFY_SITEID;


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
	// seconds
	let avg = totalTime / total;
	let mins = (avg / 60).toFixed(2);
	console.log(`I got ${total} deploys for an average build time of ${mins} minutes.`);
})()