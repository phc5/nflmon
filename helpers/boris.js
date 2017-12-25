const cheerio = require('cheerio');
const request = require('request');


const scoringObject = {
	standard: {
	  qb: 'http://www.borischen.co/p/quarterback-tier-rankings.html',
	  rb: 'http://www.borischen.co/p/running-back-tier-rankings.html',
	  wr: 'http://www.borischen.co/p/wide-receiver-tier-rankings.html',
	  te: 'http://www.borischen.co/p/tight-end-tier-rankings.html',
	  k: 'http://www.borischen.co/p/kicker-tier-rankings.html',
	  dst: 'http://www.borischen.co/p/defense-dst-tier-rankings.html',
	  flex: 'http://www.borischen.co/p/flex-tier-rankings.html',
	},
	half: {
	  qb: 'http://www.borischen.co/p/quarterback-tier-rankings.html',
	  rb: 'http://www.borischen.co/p/half-05-5-ppr-running-back-tier-rankings.html',
	  wr: 'http://www.borischen.co/p/half-05-5-ppr-wide-receiver-tier.html',
	  te: 'http://www.borischen.co/p/half-05-5-ppr-tight-end-tier-rankings.html',
	  k: 'http://www.borischen.co/p/kicker-tier-rankings.html',
	  dst: 'http://www.borischen.co/p/defense-dst-tier-rankings.html',
	  flex: 'http://www.borischen.co/p/05-half-ppr-flex-tier-rankings.html',
	},
	full: {
	  qb: 'http://www.borischen.co/p/quarterback-tier-rankings.html',
	  rb: 'http://www.borischen.co/p/ppr-running-back-tier-rankings.html',
	  wr: 'http://www.borischen.co/p/ppr-wide-receiver-tier-rankings.html',
	  te: 'http://www.borischen.co/p/blog-page.html',
	  k: 'http://www.borischen.co/p/kicker-tier-rankings.html',
	  dst: 'http://www.borischen.co/p/defense-dst-tier-rankings.html',
	  flex: 'http://www.borischen.co/p/all-data-are-from-fantasypros.html',
	}
};

exports.getTiers = (position, scoring) => {
	return new Promise((resolve, reject) => {
		var url = scoringObject[scoring][position];
		request(url, (err, res, body) => {
			if (err) {
				reject(error);
			}
			const $ = cheerio.load(body);
			const dataURL = $('.separator').next().children().attr('data');
			request.get(dataURL, (dataErr, dataRes, dataBody) => {
				if (dataErr) {
					reject(dataErr);
				} else {
					const data = {};
					const tiers = dataBody.replace(/\n/g, '').split('Tier');
					tiers.shift();
					data.tierList = tiers;
					data.position = position.toUpperCase();
					data.scoring = scoring;
					data.url = url;
					resolve(data);
				}
			});
		});
	});
};

exports.print = (tierList) => {
	tierList.map((tiers) => {
		console.log(tiers);
	});
};