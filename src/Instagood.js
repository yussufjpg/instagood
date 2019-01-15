/*!
 * instagood
 * Copyright(c) 2019 Victor Matias (reidark)
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

const

	API = require('./api'),
	request = require('request');

/**
 * Instagood
 *
 * @example
 *
 * let instance = new instagood('user');
 */

class Instagood {

	/**
	 * Constructor
	 *
	 * @param {string} username Instagram username.
	 * @param {string} csrf csrftoken from instagram api requests ().
	 * @param {string} sessionID sessionID from instagram api requests ().
	 */

	constructor(username = '', csrf = '', sessionID = '') {
		this.username = username;
		this.csrf = csrf;
		this.sessionID = sessionID;
	};

	/**
	 * Get
	 *
	 * @param {string} key The class key you want to get.
	 *
	 * @returns {any} The value of key you passed.
	 */

	get(key) {
		return this[key];
	};

	/**
	 * Set
	 *
	 * @param {string} key Class new key.
	 * @param {any} value Key value.
	 *
	 * @returns {this} Method chaining.
	 */

	set(key, value = '') {
		this[key] = value;

		return this;
	};

	/**
	 * Get User ID
	 *
	 * @param {string} username Username.
	 *
	 * @returns {object} Object with user infos.
	 */

	getUserInfo(username) {
		let options = {
			method: 'GET',
			url: `${API.routes.user.info}${username}`,
		};

		return new Promise((resolve, reject) => {
			request(options, (err, res, body) => {
				body = JSON.parse(body);

				if (body && body.status === 'ok' && body.users.length) {
					resolve({
						status: 'ok',
						...body.users[0].user,
					});
				} else {
					reject({ status: 'fail' });
				}
			});
		});
	};

	/**
	 * Format headers
	 *
	 * @param {object} headers Custom headers.
	 *
	 * @returns {object} Object with headers formatted values.
	 */

	formatHeaders(headers = API.headers) {
		headers['x-csrftoken'] = this.csrf;
		headers.cookie = headers.cookie
				.replace(/__CSRF__/g, this.csrf)
				.replace(/__SESSIONID__/g, this.sessionID);

		return headers;
	};

	/**
	 * Convert to ID
	 *
	 * @param {string} user User.
	 *
	 * @returns {Promise} Promise containing the user id.
	 */

	async convertToId(user) {
		return !/^\d+$/.test(user) ? this.getUserInfo(user).then(user => user.pk) : user;
	};

	/**
	 * Options
	 *
	 * @param {object} options Custom options.
	 *
	 * @returns {object} Object with request options values.
	 */

	options(options) {
		return {
			headers: this.formatHeaders(),
			...options,
		};
	};

	/**
	 * Follow
	 *
	 * @param {string} user User name or ID to follow.
	 *
	 * @returns {Promise} Returns a Promise with status 'ok' or 'fail' with respectives infos.
	 *
	 * @example
	 *
	 * foo.follow('user').then((response) => console.log(response), (err) => console.log(err));
	 */

	async follow(user) {
		let id = await this.convertToId(user);

		let options = {
			method: 'POST',
			url: `${API.routes.frienships}/${id}/follow/`,
			json: true,
		};

		return new Promise((resolve, reject) => {
			request(this.options(options), (err, res, body) => {
				if (body && body.status === 'ok') {
					resolve({
						id,
						...body
					});
				} else {
					reject({ status: 'fail' });
				}
			});
		});
	};

	/**
	 * Unfollow
	 *
	 * @param {string} user User name or ID to unfollow.
	 *
	 * @returns {Promise} Returns a Promise with status 'ok' or 'fail' with respectives infos.
	 *
	 * @example
	 *
	 * foo.unfollow('user').then((response) => console.log(response), (err) => console.log(err));
	 */

	async unfollow(user) {
		let id = await this.convertToId(user);

		let options = {
			method: 'POST',
			url: `${API.routes.frienships}/${id}/unfollow/`,
			json: true,
		};

		return new Promise((resolve, reject) => {
			request(this.options(options), (err, res, body) => {
				if (body && body.status === 'ok') {
					resolve({
						id,
						...body
					});
				} else {
					reject({ status: 'fail' });
				}
			});
		});
	};

};

module.exports = Instagood;
