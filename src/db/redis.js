let redis = require('redis');

module.exports.Redis = (configuration) => {

	let client = redis.createClient();

	client.on('error', (err) => {
		log.error('redis - error', err);
	})

	client.on('ready', (err) => {
		let version = client.server_info.redis_version;
		log.info(`redis - ok, version=${version}`);
	});

	let wrapper = function() {
		this.client = client;
		if (process.env.NODE_ENV != 'production' && configuration.get('redis_debug')) {
			redis.debug_mode = true;
		}
		this.print = redis.print;
	}

	return new wrapper();
}